'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import TextSelectionMenu from '@/components/ui/text-selection-menu';
import { useNotePadStorage } from '@/hooks/useNotePadStorage';
import { useResizable } from '@/hooks/useResizable';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { NotePadProps, NotePadError, TipTapEditor } from '@/types/notepad';

export default function NotePad({ 
  className = '',
  onError,
  maxWidth = NOTEPAD_CONSTANTS.MAX_WIDTH,
  minWidth = NOTEPAD_CONSTANTS.MIN_WIDTH,
  defaultWidth = NOTEPAD_CONSTANTS.DEFAULT_WIDTH
}: NotePadProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuUpdateKey, setMenuUpdateKey] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // Custom hooks for separated concerns
  const {
    title,
    width,
    isLoading,
    setTitle,
    setWidth,
    loadContent,
    saveContent,
  } = useNotePadStorage({
    contentKey: NOTEPAD_CONSTANTS.STORAGE_KEY,
    titleKey: NOTEPAD_CONSTANTS.TITLE_STORAGE_KEY,
    widthKey: NOTEPAD_CONSTANTS.WIDTH_STORAGE_KEY,
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

  // Text selection menu positioning logic
  const calculateMenuPosition = (editorInstance: TipTapEditor, container: HTMLElement) => {
    const { selection } = editorInstance.state;
    const { from, to } = selection;
    
    const start = editorInstance.view.coordsAtPos(from);
    const end = editorInstance.view.coordsAtPos(to);
    const containerRect = container.getBoundingClientRect();
    
    const menuWidth = NOTEPAD_CONSTANTS.MENU_WIDTH;
    const menuHeight = NOTEPAD_CONSTANTS.MENU_HEIGHT;
    const gap = NOTEPAD_CONSTANTS.MENU_GAP;
    
    let x = (start.left + end.left) / 2 - containerRect.left;
    let y = start.top - containerRect.top - menuHeight - gap;
    
    // Horizontal bounds checking
    const containerWidth = containerRect.width;
    const halfMenuWidth = menuWidth / 2;
    
    if (x - halfMenuWidth < 0) {
      x = halfMenuWidth;
    } else if (x + halfMenuWidth > containerWidth) {
      x = containerWidth - halfMenuWidth;
    }
    
    // Vertical bounds checking
    if (y < 0) {
      y = end.top - containerRect.top + gap + 10;
    }
    
    return { x, y };
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
        const { selection } = editor.state;
        const { empty } = selection;
        
        if (!empty && editorRef.current) {
          const position = calculateMenuPosition(editor, editorRef.current);
          setMenuPosition(position);
          setShowSelectionMenu(true);
        } else {
          setShowSelectionMenu(false);
        }
      } catch (error) {
        handleError(error as Error, 'EDITOR_ERROR', { action: 'selection_update' });
      }
    },
    onTransaction: ({ editor }) => {
      try {
        const { selection } = editor.state;
        const { empty } = selection;
        
        if (!empty && showSelectionMenu) {
          setMenuUpdateKey(prev => prev + 1);
        }
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

  // Hide menu when clicking outside and cleanup on unmount
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowSelectionMenu(false);
      }
    };

    if (showSelectionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSelectionMenu]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts or event listeners
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const toggleExpanded = () => {
    setHasAnimated(true);
    setIsExpanded(!isExpanded);
  };

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
              isExpanded ? 'border-r border-slate-200' : ''
            } ${
              // Mobile responsive classes
              width < 500 ? 'min-w-[280px]' : ''
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Header with collapse button */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <div className="flex-1" />
                <button
                  onClick={toggleExpanded}
                  className="w-8 h-8 bg-white hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Collapse notes"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
                </button>
              </div>

              {/* Title Input */}
              <div className="px-4 sm:px-6 pb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={NOTEPAD_CONSTANTS.TITLE_PLACEHOLDER}
                  className="w-full text-xl sm:text-2xl font-semibold text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-300"
                  aria-label="Note title"
                />
              </div>

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
            className="absolute top-0 w-4 h-full cursor-col-resize flex items-center justify-center z-10"
            style={{ left: width }}
            role="separator"
            aria-label="Resize notepad"
            aria-orientation="vertical"
          >
            <div
              className={`w-1 h-6 rounded-full transition-colors duration-150 ${
                isResizing ? 'bg-blue-500' : 'bg-slate-200 hover:bg-slate-400'
              }`}
            />
          </div>
          </>
        )}
      </AnimatePresence>

      {/* Expand Button when collapsed */}
      {!isExpanded && (
        <button
          onClick={toggleExpanded}
          className="w-8 h-8 m-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center transition-colors duration-200 group"
          aria-label="Expand notes"
        >
          <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
        </button>
      )}
    </div>
  );
}