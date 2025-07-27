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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NotePad({
  className = '',
  onError,
  currentPlan = null,
  currentDocument = null,
  allDocuments = [],
  onCreateDocument,
  onSwitchToDocument,
  onUpdateDocumentContent,
  onRenameDocument,
  onDeleteDocument,
  showDocumentList = false,
}: NotePadProps) {
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const saveInProgressRef = useRef<boolean>(false);
  const pendingSaveRef = useRef<string | null>(null);
  const [showDocumentListCollapsed, setShowDocumentListCollapsed] = useState(true);
  
  // Title management
  const [titleValue, setTitleValue] = useState('');
  const titleSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const titleChangeAbortController = useRef<AbortController | null>(null);

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

  // Title management helper with basic debouncing
  const debouncedSaveTitle = useCallback((newTitle: string) => {
    if (!currentDocument || !onRenameDocument) return;
    
    // Cancel any pending title change
    if (titleChangeAbortController.current) {
      titleChangeAbortController.current.abort();
    }
    
    // Clear existing timeout
    if (titleSaveTimeoutRef.current) {
      clearTimeout(titleSaveTimeoutRef.current);
      titleSaveTimeoutRef.current = null;
    }
    
    const controller = new AbortController();
    titleChangeAbortController.current = controller;
    
    titleSaveTimeoutRef.current = setTimeout(() => {
      if (!controller.signal.aborted) {
        try {
          const trimmedTitle = newTitle.trim();
          if (currentDocument && trimmedTitle !== currentDocument.title) {
            onRenameDocument(currentDocument.id, trimmedTitle);
          }
        } catch (error) {
          console.error('Failed to rename document:', error);
          if (currentDocument) {
            setTitleValue(currentDocument.title);
          }
        } finally {
          titleChangeAbortController.current = null;
          titleSaveTimeoutRef.current = null;
        }
      }
    }, 500);
  }, [currentDocument, onRenameDocument]);

  // Handle title input changes
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    debouncedSaveTitle(newTitle);
  }, [debouncedSaveTitle]);

  // Sync title when document changes
  useEffect(() => {
    if (currentDocument) {
      setTitleValue(currentDocument.title);
    } else if (!currentDocument) {
      setTitleValue('');
    }
  }, [currentDocument]);

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
      saveTimeoutRef.current = null;
    }
    setSaveStatus(status);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('idle');
      saveTimeoutRef.current = null;
    }, delay);
  }, []);

    // Debounced save function with improved race condition handling
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const saveQueueRef = useRef<{ content: string; documentId: string; timestamp: number }[]>([]);
  
  const debouncedSaveContent = useCallback((content: string) => {
    if (!currentDocument) return;
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = undefined;
    }
    
    // Add to save queue with timestamp for ordering
    const saveItem = {
      content,
      documentId: currentDocument.id,
      timestamp: Date.now()
    };
    saveQueueRef.current.push(saveItem);
    
    // Store the most recent content for immediate access
    pendingSaveRef.current = content;
    setSaveStatus('saving');
    
    debounceTimeoutRef.current = setTimeout(async () => {
      // Get the most recent save item for the current document
      const relevantSaves = saveQueueRef.current.filter(item => item.documentId === currentDocument?.id);
      if (relevantSaves.length === 0) {
        setSaveStatus('idle');
        return;
      }
      
      // Get the latest save request
      const latestSave = relevantSaves[relevantSaves.length - 1];
      
      // Clear processed items from queue
      saveQueueRef.current = saveQueueRef.current.filter(item => 
        item.documentId !== currentDocument?.id || item.timestamp > latestSave.timestamp
      );
      
      // Prevent concurrent saves with atomic check-and-set
      if (saveInProgressRef.current) {
        // Re-queue this save if another is in progress
        saveQueueRef.current.unshift(latestSave);
        debounceTimeoutRef.current = setTimeout(() => {
          debouncedSaveContent(latestSave.content);
        }, 100); // Retry in 100ms
        return;
      }
      
      try {
        saveInProgressRef.current = true;
        
        if (currentDocument && onUpdateDocumentContent) {
          // Double-check document hasn't changed during debounce
          if (latestSave.documentId === currentDocument.id) {
            onUpdateDocumentContent(currentDocument.id, latestSave.content);
            setSaveStatusWithTimeout('saved', 1500);
          }
        }
      } catch (error) {
        setSaveStatusWithTimeout('error', 5000);
        handleError(error as Error, 'STORAGE_ERROR', { action: 'save_content' });
      } finally {
        saveInProgressRef.current = false;
        pendingSaveRef.current = null;
        debounceTimeoutRef.current = undefined;
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
      placeholder: NOTEPAD_CONSTANTS.PLACEHOLDER_TEXT,
    }),
    Typography,
    SlashCommand,
    EmptyLinePlaceholder,
  ], []); // Stable extensions - no dependencies to prevent unnecessary recreation

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

        // Handle keyboard shortcuts with better detection
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
      
      // Mark as actively typing with enhanced detection
      markAsTyping();
      
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
  }, [editorExtensions]); // markAsTyping is stable (no dependencies) so not needed in deps

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

  // Connect mouseup handler after useTextSelection is set up
  useEffect(() => {
    if (!editor) return;

    const handleMouseUpEvent = () => {
      console.log('🔍 NotePad mouseup handler called via useEffect');
      if (editor) {
        handleMouseUp(editor);
      }
    };

    // Get the editor DOM element
    const editorElement = editor.view.dom;
    editorElement.addEventListener('mouseup', handleMouseUpEvent);

    return () => {
      editorElement.removeEventListener('mouseup', handleMouseUpEvent);
    };
  }, [editor, handleMouseUp]);

  // Handle title input key events
  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Move focus to the editor
      if (editor) {
        editor.commands.focus();
      }
    }
  }, [editor]);

  // Enhanced typing detection to prevent content loading during active typing
  const lastTypingTime = useRef<number>(0);
  const isActivelyTyping = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track the last loaded document ID and content to prevent unnecessary updates
  const lastLoadedDocumentId = useRef<string | null>(null);
  const lastLoadedContent = useRef<string | null>(null);
  
  // Enhanced typing detection function
  const markAsTyping = useCallback(() => {
    lastTypingTime.current = Date.now();
    isActivelyTyping.current = true;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Set a longer timeout to be more forgiving with typing detection
    typingTimeoutRef.current = setTimeout(() => {
      // Double-check timing to prevent race conditions
      if (Date.now() - lastTypingTime.current >= 750) {
        isActivelyTyping.current = false;

      }
      typingTimeoutRef.current = null;
    }, 750); // Increased from 500ms to 750ms for even better user experience
  }, []);
  
  // Update editor content when document changes
  useEffect(() => {
    const documentId = currentDocument?.id;
    const savedContent = currentDocument?.content;
    
    if (editor && documentId && savedContent !== undefined) {
      // Skip if we're actively typing or composing
      if (isComposing || isActivelyTyping.current) {
        return;
      }
      
      // Skip if this is the same document and content we last loaded
      if (
        lastLoadedDocumentId.current === documentId && 
        lastLoadedContent.current === savedContent
      ) {
        return;
      }
      
      // Only update if the content is actually different from what's currently in the editor
      const currentEditorContent = editor.getHTML();
      if (currentEditorContent !== savedContent) {
        editor.commands.setContent(savedContent || '', { emitUpdate: false });
      }
      
      // Update cache
      lastLoadedDocumentId.current = documentId;
      lastLoadedContent.current = savedContent;
    } else if (editor && !documentId) {
      // Clear editor if no document, but only if not actively typing
      if (!isActivelyTyping.current) {
        editor.commands.clearContent();
        lastLoadedDocumentId.current = null;
        lastLoadedContent.current = null;
      }
    }
  }, [editor, currentDocument?.id, currentDocument?.content, isComposing]);

  // Click-outside handling is now managed by the useTextSelection hook

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = undefined;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (titleSaveTimeoutRef.current) {
        clearTimeout(titleSaveTimeoutRef.current);
        titleSaveTimeoutRef.current = null;
      }
      if (titleChangeAbortController.current) {
        titleChangeAbortController.current.abort();
        titleChangeAbortController.current = null;
      }
      // Reset save state
      saveInProgressRef.current = false;
      pendingSaveRef.current = null;
      saveQueueRef.current = [];
      // Reset typing state
      isActivelyTyping.current = false;
      // Clean up editor - will be handled by useEditor destruction
    };
  }, []); // Only run on mount/unmount
  

  return (
    <div 
      className={`bg-transparent notepad-container ${className}`} 
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Document List - Collapsible */}
      {showDocumentList && currentDocument && allDocuments && allDocuments.length > 0 && (
        <div className="border-b border-slate-200/65">
          <Collapsible open={showDocumentListCollapsed} onOpenChange={setShowDocumentListCollapsed}>
            <div className="px-4 py-2 flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto text-xs font-mono text-slate-600 hover:text-slate-900">
                  <span>Documents [{allDocuments.length}]</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCreateDocument?.('')}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <CollapsibleContent>
              <div className="px-4 pb-2 max-h-32 overflow-y-auto">
                {allDocuments.map((doc, index) => (
                  <div
                    key={doc.id}
                    className={`px-2 py-1 rounded text-sm cursor-pointer flex items-center justify-between group hover:bg-slate-50 ${
                      doc.id === currentDocument.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    <div className="flex-1 min-w-0" onClick={() => onSwitchToDocument?.(doc.id)}>
                      <span className="truncate">{doc.title || 'Untitled'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {index < 9 && (
                        <span className="text-xs font-mono text-slate-400">⌘{index + 1}</span>
                      )}
                      {allDocuments.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument?.(doc.id);
                          }}
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                          title="Delete document"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
      
      {/* Editor Container - This is the scroll container */}
      <div 
        ref={editorRef} 
        className="flex-1 overflow-y-auto relative notepad-editor"
        style={{ minHeight: 0 }} // This allows flex child to shrink below content size
      >
        <NotePadErrorBoundary onError={onError}>
          {/* Title Input Field - Part of scrollable content */}
          {currentDocument && (
            <div className="px-8 pt-12 pb-0">
              <input
                ref={titleInputRef}
                type="text"
                value={titleValue}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}

                placeholder="New Document"
                className="w-full text-2xl font-bold text-slate-900 bg-transparent border-none outline-none resize-none placeholder:text-slate-400 mb-2"
                maxLength={NOTEPAD_CONSTANTS.DOCUMENT_TITLE_MAX_LENGTH}
              />
            </div>
          )}
          
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
                {saveStatus === 'saving' && `Saving ${currentDocument?.title || 'document'}...`}
                {saveStatus === 'saved' && `${currentDocument?.title || 'Document'} saved`}
                {saveStatus === 'error' && `Failed to save ${currentDocument?.title || 'document'}`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(NotePad);