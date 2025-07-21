'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { motion, AnimatePresence } from 'motion/react';
import TextSelectionMenu from '@/components/ui/text-selection-menu';
import { usePlanNotePadStorage } from '@/hooks/usePlanNotePadStorage';
import { useResizable } from '@/hooks/useResizable';
import { useTextSelection } from '@/hooks/useTextSelection';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { NotePadProps, NotePadError } from '@/types/notepad';

export default function NotePad({ 
  className = '',
  onError,
  maxWidth = NOTEPAD_CONSTANTS.MAX_WIDTH,
  minWidth = NOTEPAD_CONSTANTS.MIN_WIDTH,
  defaultWidth = NOTEPAD_CONSTANTS.DEFAULT_WIDTH,
  isExpanded = true,
  currentPlan = null,
  onUpdatePlan,
}: NotePadProps) {
  const [hasAnimated] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Custom hooks for separated concerns
  const {
    width,
    isLoading,
    setWidth,
    loadContent,
    saveContent,
  } = usePlanNotePadStorage({
    currentPlan,
    onUpdatePlan,
    defaultWidth,
    minWidth,
    maxWidth,
  });

  const { isResizing, handleResizeStart } = useResizable({
    initialWidth: width,
    minWidth,
    maxWidth,
    onWidthChange: setWidth,
  });

  // Error handling helper
  const handleError = (error: Error, code: NotePadError['code'], details?: Record<string, unknown>) => {
    const notePadError: NotePadError = Object.assign(error, { code, details });
    console.error(`NotePad ${code}:`, error, details);
    onError?.(notePadError);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-slate-700 underline decoration-dashed decoration-1 underline-offset-2 cursor-pointer hover:text-slate-900',
        },
      }),
      Placeholder.configure({
        placeholder: NOTEPAD_CONSTANTS.PLACEHOLDER_TEXT,
        includeChildren: true,
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `focus:outline-none px-6 pb-4 min-h-[${NOTEPAD_CONSTANTS.MIN_EDITOR_HEIGHT}px]`,
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
        const content = editor.getHTML();
        saveContent(content);
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
    menuUpdateKey,
    setShowSelectionMenu,
    handleSelectionUpdate,
    handleTransaction,
    handleMouseUp,
  } = useTextSelection({
    editor,
    containerRef: editorRef,
  });

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


  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-12 h-full bg-slate-50 border-r border-slate-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full flex ${className}`}>
      {/* Expandable Content */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <>
          <motion.div
            initial={hasAnimated ? { width: 0, opacity: 0 } : { width, opacity: 1 }}
            animate={{ width, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={isResizing ? { duration: 0 } : hasAnimated ? { 
              type: "spring", 
              stiffness: NOTEPAD_CONSTANTS.SPRING_CONFIG.stiffness, 
              damping: NOTEPAD_CONSTANTS.SPRING_CONFIG.damping,
              opacity: { duration: NOTEPAD_CONSTANTS.OPACITY_DURATION }
            } : { duration: 0 }}
            className={`bg-white overflow-hidden h-full relative notepad-container ${
              // Add blue border effect when resizing - this will overlay the navigation border
              isResizing ? 'border-r-2 border-blue-500' : ''
            } ${
              // Mobile responsive classes
              width < 500 ? 'min-w-[280px]' : ''
            }`}
          >
            <div className="h-full flex flex-col">

              {/* Editor */}
              <div ref={editorRef} className="flex-1 overflow-y-auto relative notepad-editor">
                <EditorContent 
                  editor={editor} 
                  className="h-full"
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
                      key={menuUpdateKey} 
                      editor={editor}
                      onClose={() => setShowSelectionMenu(false)}
                    />
                  </div>
                )}
              </div>
            </div>

          </motion.div>
          
          {/* Resize Handle - positioned outside the notepad */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute top-0 w-4 h-full cursor-col-resize flex items-center justify-center z-50"
            style={{ left: width }}
            role="separator"
            aria-label="Resize notepad"
            aria-orientation="vertical"
          >
            <div
              className={`w-1 h-8 rounded-full transition-colors duration-150 shadow-sm ${
                isResizing ? 'bg-blue-500 shadow-blue-200' : 'bg-slate-300 hover:bg-blue-400 hover:shadow-blue-100'
              }`}
            />
          </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}