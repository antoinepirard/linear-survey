'use client';

import { motion } from 'motion/react';
import { 
  DocumentTextIcon,
  RectangleGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { 
  DocumentTextIcon as DocumentTextIconSolid,
  RectangleGroupIcon as RectangleGroupIconSolid,
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid
} from '@heroicons/react/24/solid';

interface VerticalNavigationProps {
  isSidebarExpanded: boolean;
  isBacklogExpanded: boolean;
  isCommentsExpanded: boolean;
  onToggleSidebar: () => void;
  onToggleBacklog: () => void;
  onToggleComments: () => void;
}

export default function VerticalNavigation({
  isSidebarExpanded,
  isBacklogExpanded,
  isCommentsExpanded,
  onToggleSidebar,
  onToggleBacklog,
  onToggleComments
}: VerticalNavigationProps) {
  return (
    <div className="flex flex-col items-center py-4 flex-1">
      {/* Navigation Items */}
      <div className="flex flex-col space-y-3">
        {/* Sidebar Toggle */}
        <motion.button
          onClick={onToggleSidebar}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isSidebarExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ 
              rotateY: [0, 5, -5, 0],
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
          >
            {isSidebarExpanded ? (
              <DocumentTextIconSolid className="w-5 h-5" />
            ) : (
              <DocumentTextIcon className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>

        {/* Backlog */}
        <motion.button
          onClick={onToggleBacklog}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isBacklogExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isBacklogExpanded ? "Close backlog" : "Open backlog"}
          title={isBacklogExpanded ? "Close backlog" : "Open backlog"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ 
              y: [0, -1, 1, 0],
              transition: { duration: 0.5, ease: "easeInOut" }
            }}
          >
            {isBacklogExpanded ? (
              <RectangleGroupIconSolid className="w-5 h-5" />
            ) : (
              <RectangleGroupIcon className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>
        {/* Comments */}
        <motion.button
          onClick={onToggleComments}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isCommentsExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isCommentsExpanded ? "Close comments" : "Open comments"}
          title={isCommentsExpanded ? "Close comments" : "Open comments"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ 
              y: [0, -2, 0, -1, 0],
              rotate: [0, -2, 1, -1, 0],
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            {isCommentsExpanded ? (
              <ChatBubbleBottomCenterTextIconSolid className="w-5 h-5" />
            ) : (
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>
      </div>
      
      {/* Anonymous Avatar */}
      <div className="mt-auto">
        <motion.div 
          className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center"
          title="Anonymous user"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            whileHover={{ 
              scale: [1, 1.1, 1, 1.05, 1],
              transition: { duration: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }
            }}
          >
            <UserIcon className="w-4 h-4 text-slate-700" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}