'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const STORAGE_KEY = 'teamplan-notes';
const TITLE_STORAGE_KEY = 'teamplan-notes-title';

interface NotePadProps {
  className?: string;
}

export default function NotePad({ className = '' }: NotePadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    ],
    content: '<p>Start writing your notes here...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none p-4 min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (typeof window !== 'undefined') {
        const content = editor.getHTML();
        localStorage.setItem(STORAGE_KEY, content);
      }
    },
  });

  // Load saved content from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && editor) {
      const savedContent = localStorage.getItem(STORAGE_KEY);
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
      setIsLoading(false);
    }
  }, [editor]);

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
              {/* Header */}
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Notes</span>
                </div>
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
                    [&_.ProseMirror_h1]:text-xl 
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
                    [&_.ProseMirror_li]:mb-1
                    [&_.ProseMirror_code]:bg-slate-100 
                    [&_.ProseMirror_code]:px-1 
                    [&_.ProseMirror_code]:rounded 
                    [&_.ProseMirror_code]:text-slate-800 
                    [&_.ProseMirror_code]:font-mono 
                    [&_.ProseMirror_code]:text-sm"
                />
              </div>

              {/* Formatting Shortcuts Help */}
              <div className="p-3 border-t border-slate-100 bg-slate-50">
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="font-medium">Markdown shortcuts:</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div>**bold**</div>
                    <div>*italic*</div>
                    <div># Heading</div>
                    <div>- List</div>
                    <div>1. Numbered</div>
                    <div>&gt; Quote</div>
                  </div>
                </div>
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