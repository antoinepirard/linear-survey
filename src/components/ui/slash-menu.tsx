'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  DocumentTextIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  NumberedListIcon,
  ChatBubbleLeftIcon,
  CodeBracketIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { List } from 'react-feather';

interface SlashMenuProps {
  items: any[];
  command: (item: any) => void;
}

export interface SlashMenuRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const iconMap: Record<string, React.ReactNode> = {
    'Text': <DocumentTextIcon className="h-4 w-4" />,
    'Heading 1': <H1Icon className="h-4 w-4" />,
    'Heading 2': <H2Icon className="h-4 w-4" />,
    'Heading 3': <H3Icon className="h-4 w-4" />,
    'Bullet List': <List size={16} />,
    'Numbered List': <NumberedListIcon className="h-4 w-4" />,
    'Quote': <ChatBubbleLeftIcon className="h-4 w-4" />,
    'Code Block': <CodeBracketIcon className="h-4 w-4" />,
    'Divider': <MinusIcon className="h-4 w-4" />,
  };

  const executeCommand = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % items.length);
        return true;
      }

      if (event.key === 'Enter') {
        executeCommand(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 min-w-[280px] max-h-[400px] overflow-y-auto z-50"
    >
      {items.length ? (
        items.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors",
              "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
              selectedIndex === index && "bg-gray-50"
            )}
            onClick={() => executeCommand(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex-shrink-0 text-gray-500">
              {iconMap[item.title] || <DocumentTextIcon className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {item.description}
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-500">No results</div>
      )}
    </motion.div>
  );
});

SlashMenu.displayName = 'SlashMenu';

export default SlashMenu;