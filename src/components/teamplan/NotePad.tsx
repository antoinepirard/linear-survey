'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextSelectionMenu from '@/components/ui/text-selection-menu';
import { useTextSelection } from '@/hooks/useTextSelection';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { NotePadProps, NotePadError } from '@/types/notepad';

export default function NotePad({ 
  className = '',
  onError,
  width,
  currentPlan = null,
  onUpdatePlan,
}: NotePadProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Content management helper
  const loadContent = useCallback((): string | null => {
    return currentPlan?.notepadData.content || null;
  }, [currentPlan]);

  const saveContent = useCallback((content: string) => {
    if (currentPlan && onUpdatePlan) {
      onUpdatePlan({
        notepadData: {
          ...currentPlan.notepadData,
          content
        }
      });
    }
  }, [currentPlan, onUpdatePlan]);

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



  return (
    <div 
      className={`bg-white notepad-container ${className}`} 
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
              key={menuUpdateKey} 
              editor={editor}
              onClose={() => setShowSelectionMenu(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}