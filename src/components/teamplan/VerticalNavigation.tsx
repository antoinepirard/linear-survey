'use client';

import { 
  DocumentTextIcon,
  RectangleGroupIcon,
  ChatBubbleBottomCenterTextIcon
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
    <div className="flex flex-col items-center py-4 flex-shrink-0">
      {/* Navigation Items */}
      <div className="flex flex-col space-y-3">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isSidebarExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarExpanded ? (
            <DocumentTextIconSolid className="w-5 h-5" />
          ) : (
            <DocumentTextIcon className="w-5 h-5" />
          )}
        </button>

        {/* Backlog */}
        <button
          onClick={onToggleBacklog}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isBacklogExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isBacklogExpanded ? "Close backlog" : "Open backlog"}
          title={isBacklogExpanded ? "Close backlog" : "Open backlog"}
        >
          {isBacklogExpanded ? (
            <RectangleGroupIconSolid className="w-5 h-5" />
          ) : (
            <RectangleGroupIcon className="w-5 h-5" />
          )}
        </button>
        {/* Comments */}
        <button
          onClick={onToggleComments}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isCommentsExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isCommentsExpanded ? "Close comments" : "Open comments"}
          title={isCommentsExpanded ? "Close comments" : "Open comments"}
        >
          {isCommentsExpanded ? (
            <ChatBubbleBottomCenterTextIconSolid className="w-5 h-5" />
          ) : (
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}