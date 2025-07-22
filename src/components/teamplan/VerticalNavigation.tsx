'use client';

import { 
  DocumentTextIcon,
  RectangleGroupIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

interface VerticalNavigationProps {
  isSidebarExpanded: boolean;
  isBacklogExpanded: boolean;
  onToggleSidebar: () => void;
  onToggleBacklog: () => void;
  onOpenComments?: () => void;
}

export default function VerticalNavigation({
  isSidebarExpanded,
  isBacklogExpanded,
  onToggleSidebar,
  onToggleBacklog,
  onOpenComments
}: VerticalNavigationProps) {
  return (
    <div className="flex flex-col items-center py-4 flex-shrink-0">
      {/* Navigation Items */}
      <div className="flex flex-col space-y-3">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 ${
            isSidebarExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <DocumentTextIcon className="w-5 h-5" />
        </button>

        {/* Backlog */}
        <button
          onClick={onToggleBacklog}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 ${
            isBacklogExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isBacklogExpanded ? "Close backlog" : "Open backlog"}
          title={isBacklogExpanded ? "Close backlog" : "Open backlog"}
        >
          <RectangleGroupIcon className="w-5 h-5" />
        </button>
        {/* Backlog (Future functionality) */}
        <button
        onClick={onOpenComments}
        className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors duration-200 cursor-not-allowed"
        aria-label="Open comments (coming soon)"
        title="Comments (coming soon)"
        disabled
        >
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}