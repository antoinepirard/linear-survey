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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    <div className={`relative flex ${className}`}>
      {/* Expandable Content */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="bg-white border-r border-slate-200 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Title Input */}
              <div className="px-6 pt-6 pb-4">
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
                  className="h-full 
                    [&_.ProseMirror]:min-h-full 
                    [&_.ProseMirror]:text-sm 
                    [&_.ProseMirror]:text-slate-700 
                    [&_.ProseMirror]:leading-6
                    [&_.ProseMirror.ProseMirror-focused]:outline-none
                    [&_.ProseMirror_.is-editor-empty_.is-empty::before]:text-slate-300
                    [&_.ProseMirror_.is-editor-empty_.is-empty::before]:pointer-events-none
                    [&_.ProseMirror_h1]:text-2xl 
                    [&_.ProseMirror_h1]:font-bold 
                    [&_.ProseMirror_h1]:text-slate-800 
                    [&_.ProseMirror_h1]:mb-4 
                    [&_.ProseMirror_h1]:mt-6
                    [&_.ProseMirror_h2]:text-lg 
                    [&_.ProseMirror_h2]:font-semibold 
                    [&_.ProseMirror_h2]:text-slate-800 
                    [&_.ProseMirror_h2]:mb-3 
                    [&_.ProseMirror_h2]:mt-5
                    [&_.ProseMirror_h3]:text-base 
                    [&_.ProseMirror_h3]:font-semibold 
                    [&_.ProseMirror_h3]:text-slate-800 
                    [&_.ProseMirror_h3]:mb-2 
                    [&_.ProseMirror_h3]:mt-4
                    [&_.ProseMirror_p]:mb-3
                    [&_.ProseMirror_strong]:font-semibold 
                    [&_.ProseMirror_strong]:text-slate-800
                    [&_.ProseMirror_em]:italic
                    [&_.ProseMirror_blockquote]:border-l-4 
                    [&_.ProseMirror_blockquote]:border-slate-300 
                    [&_.ProseMirror_blockquote]:pl-4 
                    [&_.ProseMirror_blockquote]:italic 
                    [&_.ProseMirror_blockquote]:text-slate-600
                    [&_.ProseMirror_ul]:list-disc 
                    [&_.ProseMirror_ul]:ml-6 
                    [&_.ProseMirror_ul]:mb-3
                    [&_.ProseMirror_ol]:list-decimal 
                    [&_.ProseMirror_ol]:ml-6 
                    [&_.ProseMirror_ol]:mb-3
                    [&_.ProseMirror_li]:mb-0
                    [&_.ProseMirror_code]:bg-slate-100 
                    [&_.ProseMirror_code]:px-1 
                    [&_.ProseMirror_code]:rounded 
                    [&_.ProseMirror_code]:text-slate-800 
                    [&_.ProseMirror_code]:font-mono 
                    [&_.ProseMirror_code]:text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={toggleExpanded}
        className="w-12 h-full bg-slate-50 hover:bg-slate-100 border-r border-slate-200 flex items-center justify-center transition-colors duration-200 group"
        aria-label={isExpanded ? "Collapse notes" : "Expand notes"}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
        )}
      </button>
    </div>
  );
}