'use client';

import { useEffect, useRef, useCallback, useState, memo } from 'react';
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
import { useDebounce } from '@/hooks/useDebounce';
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
  const [content, setContent] = useState<string>(
    currentPlan?.notepadData?.content || ''
  );
  const debouncedContent = useDebounce(content, 500);

  // Content management helper
  const loadContent = useCallback((): string | null => {
    return currentPlan?.notepadData.content || null;
  }, [currentPlan]);

  const saveContent = useCallback(
    (newContent: string) => {
      if (currentPlan && onUpdatePlan) {
        onUpdatePlan({
          notepadData: {
            ...currentPlan.notepadData,
            content: newContent,
          },
        });
      }
    },
    [currentPlan, onUpdatePlan]
  );

  useEffect(() => {
    if (debouncedContent !== currentPlan?.notepadData?.content) {
      saveContent(debouncedContent);
    }
  }, [debouncedContent, currentPlan?.notepadData?.content, saveContent]);


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
        bulletList: false, // Disable StarterKit's BulletList
        orderedList: false, // Disable StarterKit's OrderedList
        listItem: false, // Disable StarterKit's ListItem
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
    ],
    content: content,
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
        setContent(editor.getHTML());
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

  // Update editor content when plan changes
  useEffect(() => {
    if (editor && currentPlan) {
      const savedContent = loadContent();
      if (savedContent !== null) {
        // Only update if the content is actually different to avoid unnecessary re-renders
        if (editor.getHTML() !== savedContent) {
          editor.commands.setContent(savedContent, { emitUpdate: false }); // don't emit update
          setContent(savedContent); // update local state
        }
      } else {
        // Clear editor if no content
        editor.commands.clearContent();
        setContent('');
      }
    }
  }, [editor, currentPlan?.id, currentPlan, loadContent]);

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

export default memo(NotePad);