'use client';

import { 
  DocumentTextIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';

interface VerticalNavigationProps {
  isNotepadExpanded: boolean;
  onToggleNotepad: () => void;
  onOpenBacklog?: () => void;
}

export default function VerticalNavigation({
  isNotepadExpanded,
  onToggleNotepad,
  onOpenBacklog
}: VerticalNavigationProps) {
  return (
    <div className="w-12 h-full bg-white border-r border-slate-200 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-8 h-8 flex items-center justify-center">
          <PuzzlePieceIcon className="w-5 h-5 text-slate-900" />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-3">
        {/* Notepad Toggle */}
        <button
          onClick={onToggleNotepad}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 ${
            isNotepadExpanded 
              ? 'bg-slate-100 text-slate-800' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-label={isNotepadExpanded ? "Collapse notepad" : "Expand notepad"}
          title={isNotepadExpanded ? "Collapse notepad" : "Expand notepad"}
        >
          <DocumentTextIcon className="w-5 h-5" />
        </button>

        {/* Backlog (Future functionality) */}
        <button
          onClick={onOpenBacklog}
          className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors duration-200 cursor-not-allowed"
          aria-label="Open backlog (coming soon)"
          title="Backlog (coming soon)"
          disabled
        >
          <Squares2X2Icon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}