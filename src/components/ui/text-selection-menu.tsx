'use client';

import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { 
  ChevronDown,
  Bold,
  Italic,
  Code,
  List
} from 'react-feather';
import { 
  StrikethroughIcon,
  Bars3Icon,
  Bars2Icon,
  NumberedListIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

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

function MenuButton({ isActive, onClick, children, title }: MenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className={cn(
        "h-7 w-7 p-0 text-slate-400 hover:bg-slate-800 hover:text-white",
        isActive && "text-white hover:bg-slate-500"
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
      icon: <Bold size={16} />,
      title: "Bold",
      isActive: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic size={16} />,
      title: "Italic", 
      isActive: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: <StrikethroughIcon className="h-4 w-4" />,
      title: "Strikethrough",
      isActive: editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: <Code size={16} />,
      title: "Code",
      isActive: editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  const structuralActions = [
    {
      icon: <Bars3Icon className="h-4 w-4" />,
      title: "Heading 1",
      isActive: editor.isActive('heading', { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: <Bars3Icon className="h-4 w-4" />,
      title: "Heading 2",
      isActive: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: <Bars2Icon className="h-4 w-4" />,
      title: "Heading 3",
      isActive: editor.isActive('heading', { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: <List size={16} />,
      title: "Bullet List",
      isActive: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <NumberedListIcon className="h-4 w-4" />,
      title: "Numbered List", 
      isActive: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  const hasActiveStructural = structuralActions.some(action => action.isActive);
  
  // Get the currently active structural element for display
  const activeStructural = structuralActions.find(action => action.isActive);
  const submenuIcon = activeStructural ? activeStructural.icon : <DocumentTextIcon className="h-4 w-4" />;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "flex items-center gap-0.5 bg-slate-900 border border-slate-700 rounded-lg p-1",
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
        <div className="w-px h-4 bg-slate-700 mx-1" />

        {/* Structural elements trigger */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}} // Don't do anything on click, just show submenu
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleSubmenuLeave}
            title="Headings & Lists"
            className={cn(
              "h-7 px-2 text-slate-400 hover:bg-slate-800 hover:text-white relative flex items-center gap-1",
              hasActiveStructural && "text-white hover:bg-slate-500"
            )}
          >
            {submenuIcon}
            <ChevronDown size={12} />
          </Button>

          {/* Submenu */}
          <AnimatePresence>
            {showSubmenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 rounded-lg p-1 flex items-center gap-0.5 whitespace-nowrap"
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