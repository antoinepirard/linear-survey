'use client';

import { RectangleGroupIcon } from '@heroicons/react/24/outline';

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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <RectangleGroupIcon className="w-8 h-8 text-slate-400" />
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Your backlog is empty
        </h3>
        
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          Start adding tasks and ideas to organize your project backlog. 
          Items added here can be prioritized and moved to active sprints.
        </p>
      </div>
    </div>
  );
}