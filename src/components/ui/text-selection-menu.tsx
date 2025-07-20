'use client';

import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface TextSelectionMenuProps {
  editor: Editor;
  className?: string;
}

interface MenuButtonProps {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}

interface SubmenuButtonProps {
  isActive?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
  title: string;
}

function MenuButton({ isActive, onClick, children, title }: MenuButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className={cn(
        "h-8 w-8 p-0 hover:bg-slate-100",
        isActive && "bg-slate-900 text-white hover:bg-slate-800"
      )}
    >
      {children}
    </Button>
  );
}

function SubmenuButton({ isActive, onClick, onMouseEnter, onMouseLeave, children, title }: SubmenuButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={title}
      className={cn(
        "h-8 w-8 p-0 hover:bg-slate-100 relative",
        isActive && "bg-slate-900 text-white hover:bg-slate-800"
      )}
    >
      {children}
    </Button>
  );
}

export default function TextSelectionMenu({ editor, className }: TextSelectionMenuProps) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuTimeout, setSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);

  if (!editor) {
    return null;
  }

  const handleSubmenuEnter = () => {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      setSubmenuTimeout(null);
    }
    setShowSubmenu(true);
  };

  const handleSubmenuLeave = () => {
    const timeout = setTimeout(() => {
      setShowSubmenu(false);
    }, 150); // Small delay to allow moving to submenu
    setSubmenuTimeout(timeout);
  };

  const formatActions = [
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          B
        </span>
      ),
      title: "Bold",
      isActive: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold italic">
          I
        </span>
      ),
      title: "Italic", 
      isActive: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          <span className="line-through">S</span>
        </span>
      ),
      title: "Strikethrough",
      isActive: editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-mono font-bold">
          &lt;/&gt;
        </span>
      ),
      title: "Code",
      isActive: editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          <span className="underline decoration-dashed decoration-1 underline-offset-1">L</span>
        </span>
      ),
      title: "Link",
      isActive: editor.isActive('link'),
      onClick: () => {
        // For now, just show that a link is detected - could add link editing functionality later
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run();
        }
      },
    },
  ];

  const structuralActions = [
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          H1
        </span>
      ),
      title: "Heading 1",
      isActive: editor.isActive('heading', { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          H2
        </span>
      ),
      title: "Heading 2",
      isActive: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          H3
        </span>
      ),
      title: "Heading 3",
      isActive: editor.isActive('heading', { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          •
        </span>
      ),
      title: "Bullet List",
      isActive: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
          1.
        </span>
      ),
      title: "Numbered List", 
      isActive: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  const hasActiveStructural = structuralActions.some(action => action.isActive);
  
  // Get the currently active structural element for display
  const activeStructural = structuralActions.find(action => action.isActive);
  const submenuIcon = activeStructural ? activeStructural.icon : (
    <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">
      ¶
    </span>
  );

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5",
          className
        )}
      >
        {/* Text formatting actions */}
        <div className="flex items-center gap-0.5">
          {formatActions.map((action, index) => (
            <MenuButton
              key={index}
              isActive={action.isActive}
              onClick={action.onClick}
              title={action.title}
            >
              {action.icon}
            </MenuButton>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Structural elements trigger */}
        <div className="relative">
          <Button
            variant={hasActiveStructural ? "default" : "ghost"}
            size="sm"
            onClick={() => {}} // Don't do anything on click, just show submenu
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleSubmenuLeave}
            title="Headings & Lists"
            className={cn(
              "h-8 px-2 hover:bg-slate-100 relative flex items-center gap-1",
              hasActiveStructural && "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {submenuIcon}
            <ChevronDownIcon className="h-3 w-3" />
          </Button>

          {/* Submenu */}
          <AnimatePresence>
            {showSubmenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 flex items-center gap-0.5 whitespace-nowrap"
                onMouseEnter={handleSubmenuEnter}
                onMouseLeave={handleSubmenuLeave}
              >
                {structuralActions.map((action, index) => (
                  <MenuButton
                    key={index}
                    isActive={action.isActive}
                    onClick={() => {
                      action.onClick();
                      setShowSubmenu(false);
                    }}
                    title={action.title}
                  >
                    {action.icon}
                  </MenuButton>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}