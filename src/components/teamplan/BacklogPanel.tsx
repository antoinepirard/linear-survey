'use client';

import { RectangleGroupIcon } from '@heroicons/react/24/solid';

interface BacklogPanelProps {
  width: number;
}

export default function BacklogPanel({ width }: BacklogPanelProps) {
  return (
    <div 
      className="flex flex-col h-full"
      style={{ width }}
    >
      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <RectangleGroupIcon className="w-8 h-8 text-slate-500" />
        </div>
        
        <h3 className="text-base font-medium text-slate-900 mb-2">
          Backlog coming soon!
        </h3>
        
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          This is for projects you haven&apos;t planned yet. Extract projects from your notes with one click, let AI automatically detect projects from your notepad, or sync your Linear projects here. Once added, projects stay in your backlog until you&apos;re ready to plan them.
        </p>
      </div>
    </div>
  );
}