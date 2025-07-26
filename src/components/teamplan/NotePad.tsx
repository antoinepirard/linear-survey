'use client';

import { useEffect, useRef, useCallback, useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '@/styles/notepad.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import { SlashCommand } from '@/extensions/slash-command';
import { EmptyLinePlaceholder } from '@/extensions/empty-line-placeholder';
import { BulletList, OrderedList, ListItem } from '@tiptap/extension-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import TextSelectionMenu from '@/components/ui/text-selection-menu';
import { NotePadErrorBoundary } from '@/components/ui/NotePadErrorBoundary';
import { useTextSelection } from '@/hooks/useTextSelection';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { NotePadProps, NotePadError } from '@/types/notepad';
import { isLegacyNotepadData } from '@/types/plan';

function NotePad({
  className = '',
  onError,
  width,
  currentPlan = null,
  currentDocument = null,
  allDocuments = [],
  onCreateDocument,
  onSwitchToDocument,
  onUpdateDocumentContent,
}: NotePadProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  // Content management helper
  const loadContent = useCallback((): string | null => {
    if (currentDocument) {
      return currentDocument.content;
    }
    // Fallback to legacy plan-based content (for backward compatibility)
    const notepadData = currentPlan?.notepadData;
    if (notepadData && isLegacyNotepadData(notepadData)) {
      return notepadData.content;
    }
    return null;
  }, [currentDocument, currentPlan]);



  // Error handling helper
  const handleError = useCallback((error: Error, code: NotePadError['code'], details?: Record<string, unknown>) => {
    const notePadError: NotePadError = Object.assign(error, { code, details });
    console.error(`NotePad ${code}:`, error, details);
    onError?.(notePadError);
  }, [onError]);

  // Helper to set save status with timeout cleanup
  const setSaveStatusWithTimeout = useCallback((status: 'saved' | 'error', delay: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaveStatus(status);
    saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), delay);
  }, []);

    // Debounced save function for better performance
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  const debouncedSaveContent = useCallback((content: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSaveStatus('saving');
    
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        if (currentDocument && onUpdateDocumentContent) {
          // Note: Version checking would be implemented here in the future
          onUpdateDocumentContent(currentDocument.id, content);
          setSaveStatusWithTimeout('saved', 1500);
        }
      } catch (error) {
        setSaveStatusWithTimeout('error', 5000);
        handleError(error as Error, 'STORAGE_ERROR', { action: 'save_content' });
      }
    }, 300); // 300ms debounce
  }, [currentDocument, onUpdateDocumentContent, handleError, setSaveStatusWithTimeout]);

  // Show save status when content is being saved
  const showSaveStatusForContent = useCallback((content: string) => {
    debouncedSaveContent(content);
  }, [debouncedSaveContent]);

  // Memoize extensions to prevent editor recreation on every render
  const editorExtensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      bulletList: false, // Disable StarterKit's BulletList
      orderedList: false, // Disable StarterKit's OrderedList
      listItem: false, // Disable StarterKit's ListItem
      link: false, // Disable StarterKit's Link
      listKeymap: false, // Disable StarterKit's ListKeymap
      codeBlock: {
        exitOnTripleEnter: true,
        exitOnArrowDown: true,
      },
    }),
    ListItem,
    BulletList.configure({
      keepMarks: true,
      keepAttributes: false,
    }),
    OrderedList.configure({
      keepMarks: true,
      keepAttributes: false,
    }),
    TaskList,
    TaskItem,
    ListKeymap,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-slate-700 underline decoration-dashed decoration-1 underline-offset-2 cursor-pointer hover:text-slate-900',
      },
    }),
    Placeholder.configure({
      placeholder: currentDocument?.title ? `Start writing in "${currentDocument.title}"...` : NOTEPAD_CONSTANTS.PLACEHOLDER_TEXT,
    }),
    Typography,
    SlashCommand,
    EmptyLinePlaceholder,
  ], [currentDocument?.title]); // Update placeholder when document changes

  const editor = useEditor({
    extensions: editorExtensions,
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none px-6 py-4',
        'aria-label': 'Note editor',
        role: 'textbox',
        'aria-multiline': 'true',
      },
      handleKeyDown: (_view, event) => {
        // Check if we're in a list context and prioritize ListKeymap for Enter key
        if (event.key === 'Enter') {
          const { state } = _view;
          const { $from } = state.selection;
          const isInList = $from.parent.type.name === 'listItem' || 
                           $from.parent.type.name === 'taskItem';
          
          // If in list, let ListKeymap handle Enter exclusively
          if (isInList) {
            return false; // Let ListKeymap take priority
          }
        }

        // Handle keyboard shortcuts
        const mod = event.metaKey || event.ctrlKey;
        const shift = event.shiftKey;
        const alt = event.altKey;
        
        if (mod && !shift && !alt && event.key === 'b') {
          editor?.chain().focus().toggleBold().run();
          return true;
        }
        
        if (mod && !shift && !alt && event.key === 'i') {
          editor?.chain().focus().toggleItalic().run();
          return true;
        }
        
        if (mod && shift && !alt && event.key === 'S') {
          editor?.chain().focus().toggleStrike().run();
          return true;
        }
        
        if (mod && alt && !shift && ['1', '2', '3'].includes(event.key)) {
          const level = parseInt(event.key) as 1 | 2 | 3;
          editor?.chain().focus().toggleHeading({ level }).run();
          return true;
        }

        // Document switching shortcuts (Cmd/Ctrl + 1-9)
        if (mod && !shift && !alt && /^[1-9]$/.test(event.key)) {
          const index = parseInt(event.key) - 1;
          const targetDoc = allDocuments[index];
          if (targetDoc && onSwitchToDocument) {
            onSwitchToDocument(targetDoc.id);
            return true;
          }
        }

        // New document shortcut (Cmd/Ctrl + T)
        if (mod && !shift && !alt && event.key === 't') {
          if (onCreateDocument) {
            onCreateDocument('New Document');
            return true;
          }
        }
        
        return false;
      },
      handleDOMEvents: {
        mouseup: () => {
          if (editor) {
            handleMouseUp(editor);
          }
          return false;
        },
        compositionstart: () => {
          setIsComposing(true);
          return false;
        },
        compositionend: () => {
          setIsComposing(false);
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      if (isComposing) return; // Skip updates during IME composition
      
      // Mark as actively typing
      lastTypingTime.current = Date.now();
      isActivelyTyping.current = true;
      
      // Clear typing flag after delay
      setTimeout(() => {
        if (Date.now() - lastTypingTime.current >= 100) {
          isActivelyTyping.current = false;
        }
      }, 150);
      
      try {
        const newContent = editor.getHTML();
        // Call the save status function which handles storage
        showSaveStatusForContent(newContent);
      } catch (error) {
        handleError(error as Error, 'EDITOR_ERROR', { action: 'save_content' });
      }
    },
    onSelectionUpdate: ({ editor }) => {
      if (isComposing) return; // Skip selection updates during IME composition
      
      try {
        handleSelectionUpdate(editor);
      } catch (error) {
        handleError(error as Error, 'EDITOR_ERROR', { action: 'selection_update' });
      }
    },
    onTransaction: () => {
      try {
        handleTransaction();
      } catch (error) {
        handleError(error as Error, 'EDITOR_ERROR', { action: 'transaction' });
      }
    },
    onCreate: ({ editor }) => {
      try {
        const savedContent = loadContent();
        if (savedContent) {
          editor.commands.setContent(savedContent, { emitUpdate: false });
        }
      } catch (error) {
        handleError(error as Error, 'STORAGE_ERROR', { action: 'load_content' });
      }
    },
  }, []); // Add empty dependency array to prevent editor recreation

  // Text selection hook
  const {
    showSelectionMenu,
    menuPosition,
    handleSelectionUpdate,
    handleTransaction,
    handleMouseUp,
  } = useTextSelection({
    editor,
    containerRef: editorRef,
  });

  // Add typing detection to prevent content loading during active typing
  const lastTypingTime = useRef<number>(0);
  const isActivelyTyping = useRef<boolean>(false);

  // Update editor content when document changes
  useEffect(() => {
    if (editor) {
      const savedContent = loadContent();
      if (savedContent !== null) {
        // Only update if the content is actually different to avoid unnecessary re-renders
        const currentContent = editor.getHTML();
        if (currentContent !== savedContent && !isComposing && !isActivelyTyping.current) {
          editor.commands.setContent(savedContent, { emitUpdate: false });
        }
      } else {
        // Clear editor if no content
        editor.commands.clearContent();
      }
    }
  }, [editor, currentDocument?.id, currentPlan?.id, loadContent, isComposing]);

  // Click-outside handling is now managed by the useTextSelection hook

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Clean up editor
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div 
      className={`bg-transparent notepad-container ${className}`} 
      style={{ width, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Editor Container - This is the scroll container */}
      <div 
        ref={editorRef} 
        className="flex-1 overflow-y-auto relative notepad-editor"
        style={{ minHeight: 0 }} // This allows flex child to shrink below content size
      >
        <NotePadErrorBoundary onError={onError}>
          <EditorContent 
            editor={editor} 
            className="w-full"
          />
          
          {/* Text Selection Menu */}
          {editor && showSelectionMenu && (
            <div
              className="absolute z-50"
              style={{
                left: menuPosition.x,
                top: menuPosition.y,
                transform: 'translateX(-50%)',
              }}
            >
              <TextSelectionMenu 
                editor={editor}
              />
            </div>
          )}
        </NotePadErrorBoundary>
      </div>

      {/* Save Status Indicator - Outside scroll container to stay fixed */}
      <AnimatePresence>
        {saveStatus !== 'idle' && (
          <motion.div 
            className="absolute bottom-4 right-4 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.15,
              ease: "easeOut"
            }}
          >
            <div className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1.5">
              {/* Icon */}
              <div className="w-3 h-3 flex items-center justify-center">
                {saveStatus === 'saving' && (
                  <div className="animate-spin rounded-full h-3 w-3 border border-slate-300 border-t-slate-600" />
                )}
                {saveStatus === 'saved' && (
                  <div className="h-3 w-3 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="h-3 w-3 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Text */}
              <span className="whitespace-nowrap">
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && 'All changes saved'}
                {saveStatus === 'error' && 'Failed to save'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(NotePad);