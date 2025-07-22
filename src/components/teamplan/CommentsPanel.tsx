'use client';

import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

interface CommentsPanelProps {
  width: number;
}

export default function CommentsPanel({ width }: CommentsPanelProps) {
  return (
    <div 
      className="flex flex-col h-full"
      style={{ width }}
    >
      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <ChatBubbleLeftIcon className="w-8 h-8 text-slate-950" />
        </div>
        
        <h3 className="text-base font-medium text-slate-900 mb-2">
          Comments coming soon!
        </h3>
        
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          This is where you&apos;ll get comments from working on your plan. Team members can leave feedback, suggestions, and updates on your planning progress.
        </p>
      </div>
    </div>
  );
}