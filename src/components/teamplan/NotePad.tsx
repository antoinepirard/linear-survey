'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

const STORAGE_KEY = 'teamplan-notes';
const TITLE_STORAGE_KEY = 'teamplan-notes-title';

interface NotePadProps {
  className?: string;
}

export default function NotePad({ className = '' }: NotePadProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [title, setTitle] = useState('');

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
      Placeholder.configure({
        placeholder: 'Start writing your notes here...',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none px-6 pb-4 min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (typeof window !== 'undefined') {
        const content = editor.getHTML();
        localStorage.setItem(STORAGE_KEY, content);
      }
    },
  });

  // Load saved content and title from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && editor) {
      const savedContent = localStorage.getItem(STORAGE_KEY);
      const savedTitle = localStorage.getItem(TITLE_STORAGE_KEY);
      
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
      if (savedTitle) {
        setTitle(savedTitle);
      }
      setIsLoading(false);
    }
  }, [editor]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TITLE_STORAGE_KEY, newTitle);
    }
  };

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
          <motion.div
            initial={hasAnimated ? { width: 0, opacity: 0 } : { width: 400, opacity: 1 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={hasAnimated ? { 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            } : { duration: 0 }}
            className="bg-white border-r border-slate-200 overflow-hidden h-full"
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
              <div className="px-6 pb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full text-2xl font-semibold text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-300"
                />
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-y-auto">
                <EditorContent 
                  editor={editor} 
                  className="h-full"
                />
              </div>
            </div>
          </motion.div>
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