'use client';

import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronDown,
  Bold,
  Italic,
  List
} from 'react-feather';
import { 
  StrikethroughIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  NumberedListIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface TextSelectionMenuProps {
  editor: Editor;
  className?: string;
}

interface MenuButtonProps {
  isActive?: boolean;
  onMouseDown: () => void;
  children: React.ReactNode;
  title: string;
}

function MenuButton({ isActive, onMouseDown, children, title }: MenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent blur event
        onMouseDown();
      }}
      title={title}
      className={cn(
        "h-7 w-7 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        isActive && "text-gray-900 bg-gray-100"
      )}
    >
      {children}
    </Button>
  );
}

export default function TextSelectionMenu({ editor, className }: TextSelectionMenuProps) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuTimeout, setSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openTimeout, setOpenTimeout] = useState<NodeJS.Timeout | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Force update when editor state changes
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setUpdateTrigger(prev => prev + 1);
    };

    // Listen to editor transactions to update active states
    editor.on('transaction', handleUpdate);
    
    return () => {
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  // Clear all timeouts helper
  const clearAllTimeouts = useCallback(() => {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      setSubmenuTimeout(null);
    }
    if (openTimeout) {
      clearTimeout(openTimeout);
      setOpenTimeout(null);
    }
  }, [submenuTimeout, openTimeout]);

  const handleSubmenuEnter = useCallback(() => {
    clearAllTimeouts();
    
    // Add 300ms delay before showing submenu
    const timeout = setTimeout(() => {
      setShowSubmenu(true);
    }, 300);
    setOpenTimeout(timeout);
  }, [clearAllTimeouts]);

  const handleSubmenuLeave = useCallback(() => {
    clearAllTimeouts();
    
    // Longer delay to give time to reach submenu
    const timeout = setTimeout(() => {
      setShowSubmenu(false);
    }, 500);
    setSubmenuTimeout(timeout);
  }, [clearAllTimeouts]);

  // Submenu-specific hover handlers
  const handleSubmenuContainerEnter = useCallback(() => {
    clearAllTimeouts(); // Keep submenu open when hovering over it
  }, [clearAllTimeouts]);

  const handleSubmenuContainerLeave = useCallback(() => {
    clearAllTimeouts();
    
    // Standard delay when leaving submenu
    const timeout = setTimeout(() => {
      setShowSubmenu(false);
    }, 150);
    setSubmenuTimeout(timeout);
  }, [clearAllTimeouts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Memoize actions to prevent recreation on every render
  const formatActions = useMemo(() => [
    {
      icon: <Bold size={16} />,
      title: "Bold",
      isActive: editor.isActive('bold'),
      onMouseDown: () => {
        editor.chain().focus().toggleBold().run();
      },
    },
    {
      icon: <Italic size={16} />,
      title: "Italic", 
      isActive: editor.isActive('italic'),
      onMouseDown: () => {
        editor.chain().focus().toggleItalic().run();
      },
    },
    {
      icon: <StrikethroughIcon className="h-4 w-4" />,
      title: "Strikethrough",
      isActive: editor.isActive('strike'),
      onMouseDown: () => {
        editor.chain().focus().toggleStrike().run();
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editor, updateTrigger]);

  const structuralActions = useMemo(() => [
    {
      icon: <H1Icon className="h-4 w-4" />,
      title: "Heading 1",
      isActive: editor.isActive('heading', { level: 1 }),
      onMouseDown: () => {
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        setShowSubmenu(false);
      },
    },
    {
      icon: <H2Icon className="h-4 w-4" />,
      title: "Heading 2",
      isActive: editor.isActive('heading', { level: 2 }),
      onMouseDown: () => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        setShowSubmenu(false);
      },
    },
    {
      icon: <H3Icon className="h-4 w-4" />,
      title: "Heading 3",
      isActive: editor.isActive('heading', { level: 3 }),
      onMouseDown: () => {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        setShowSubmenu(false);
      },
    },
    {
      icon: <List size={16} />,
      title: "Bullet List",
      isActive: editor.isActive('bulletList'),
      onMouseDown: () => {
        editor.chain().focus().toggleBulletList().run();
        setShowSubmenu(false);
      },
    },
    {
      icon: <NumberedListIcon className="h-4 w-4" />,
      title: "Numbered List", 
      isActive: editor.isActive('orderedList'),
      onMouseDown: () => {
        editor.chain().focus().toggleOrderedList().run();
        setShowSubmenu(false);
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editor, updateTrigger]);

  // Memoize computed values
  const { hasActiveStructural, submenuIcon } = useMemo(() => {
    const hasActive = structuralActions.some(action => action.isActive);
    const activeStructural = structuralActions.find(action => action.isActive);
    const icon = activeStructural ? activeStructural.icon : <DocumentTextIcon className="h-4 w-4" />;
    
    return {
      hasActiveStructural: hasActive,
      submenuIcon: icon,
    };
  }, [structuralActions]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "flex items-center gap-0.5 bg-white ring-1 ring-gray-300/30 rounded-lg p-1 shadow-lg",
          className
        )}
      >
        {/* Text formatting actions */}
        <div className="flex items-center gap-0.5">
          {formatActions.map((action, index) => (
            <MenuButton
              key={index}
              isActive={action.isActive}
              onMouseDown={action.onMouseDown}
              title={action.title}
            >
              {action.icon}
            </MenuButton>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-300 mx-1" />

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
              "h-7 px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 relative flex items-center gap-1",
              hasActiveStructural && "text-gray-900 bg-gray-100"
            )}
            ref={triggerRef}
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
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white ring-1 ring-gray-300/30 rounded-lg p-1 flex items-center gap-0.5 whitespace-nowrap shadow-lg submenu-container"
                onMouseEnter={handleSubmenuContainerEnter}
                onMouseLeave={handleSubmenuContainerLeave}
              >
                {structuralActions.map((action, index) => (
                  <MenuButton
                    key={index}
                    isActive={action.isActive}
                    onMouseDown={action.onMouseDown}
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