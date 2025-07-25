'use client';

import { useEffect, useRef, useCallback, useState, memo } from 'react';
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
import { useTextSelection } from '@/hooks/useTextSelection';
import { usePlanNotePadStorage } from '@/hooks/usePlanNotePadStorage';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { NotePadProps, NotePadError } from '@/types/notepad';

function NotePad({
  className = '',
  onError,
  width,
  currentPlan = null,
  onUpdatePlan,
}: NotePadProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Use the plan-specific notepad storage hook
  const {
    loadContent,
    saveContent: saveContentToStorage,
  } = usePlanNotePadStorage({
    currentPlan,
    onUpdatePlan,
    defaultWidth: width || NOTEPAD_CONSTANTS.DEFAULT_WIDTH,
    minWidth: NOTEPAD_CONSTANTS.MIN_WIDTH,
    maxWidth: NOTEPAD_CONSTANTS.MAX_WIDTH,
  });

  // Error handling helper
  const handleError = useCallback((error: Error, code: NotePadError['code'], details?: Record<string, unknown>) => {
    const notePadError: NotePadError = Object.assign(error, { code, details });
    console.error(`NotePad ${code}:`, error, details);
    onError?.(notePadError);
  }, [onError]);

  // Content save with status handling
  const saveContent = useCallback(
    async (newContent: string) => {
      if (currentPlan && onUpdatePlan) {
        setSaveStatus('saving');
        try {
          saveContentToStorage(newContent);
          setSaveStatus('saved');
          // Clear 'saved' status after 2 seconds
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
          setSaveStatus('error');
          handleError(error as Error, 'STORAGE_ERROR', { action: 'save_content' });
          // Clear error status after 5 seconds
          setTimeout(() => setSaveStatus('idle'), 5000);
        }
      }
    },
    [currentPlan, onUpdatePlan, saveContentToStorage, handleError]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: false, // Disable StarterKit's BulletList
        orderedList: false, // Disable StarterKit's OrderedList
        listItem: false, // Disable StarterKit's ListItem
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
        placeholder: NOTEPAD_CONSTANTS.PLACEHOLDER_TEXT,
      }),
      Typography,
      SlashCommand,
      // EmptyLinePlaceholder, // Temporarily disabled to test code block typing
    ],
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
        
        return false;
      },
      handleDOMEvents: {
        mouseup: () => {
          if (editor) {
            handleMouseUp(editor);
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      try {
        const newContent = editor.getHTML();
        saveContent(newContent);
        // Reset save status when user starts typing
        if (saveStatus !== 'idle') {
          setSaveStatus('idle');
        }
      } catch (error) {
        handleError(error as Error, 'EDITOR_ERROR', { action: 'save_content' });
      }
    },
    onSelectionUpdate: ({ editor }) => {
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
          editor.commands.setContent(savedContent);
        }
      } catch (error) {
        handleError(error as Error, 'STORAGE_ERROR', { action: 'load_content' });
      }
    },
  });

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

  // Update editor content when plan changes
  useEffect(() => {
    if (editor && currentPlan) {
      const savedContent = loadContent();
      if (savedContent !== null) {
        // Only update if the content is actually different to avoid unnecessary re-renders
        if (editor.getHTML() !== savedContent) {
          editor.commands.setContent(savedContent, { emitUpdate: false }); // don't emit update
        }
      } else {
        // Clear editor if no content
        editor.commands.clearContent();
      }
    }
  }, [editor, currentPlan, loadContent]);

  // Click-outside handling is now managed by the useTextSelection hook

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts or event listeners
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
      </div>

      {/* Save Status Indicator - Outside scroll container to stay fixed */}
      <AnimatePresence>
        {saveStatus !== 'idle' && (
          <motion.div 
            className="absolute bottom-4 right-4 z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <div className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1.5">
            {saveStatus === 'saving' && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border border-slate-300 border-t-slate-600"></div>
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <div className="h-3 w-3 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>All changes saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <div className="h-3 w-3 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Failed to save</span>
              </>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(NotePad);