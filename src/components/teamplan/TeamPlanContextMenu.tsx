'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export type ContextMenuType = 'person' | 'timeSlot' | 'project';

interface TeamPlanContextMenuProps {
  children: React.ReactNode;
  type: ContextMenuType;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canDelete: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  label?: string;
}

export default function TeamPlanContextMenu({
  children,
  type,
  canMoveUp,
  canMoveDown,
  canDelete,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  label,
}: TeamPlanContextMenuProps) {
  const getLabel = () => {
    if (label) return label;
    return type === 'person' ? 'Person' : type === 'timeSlot' ? 'Time Slot' : 'Project';
  };

  const getMoveUpIcon = () => {
    return type === 'timeSlot' ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />;
  };

  const getMoveDownIcon = () => {
    return type === 'timeSlot' ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
  };

  const getMoveUpText = () => {
    return type === 'person' ? 'Move Up' : 'Move Left';
  };

  const getMoveDownText = () => {
    return type === 'person' ? 'Move Down' : 'Move Right';
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {type === 'project' ? (
          <>
            <ContextMenuItem
              onClick={onDuplicate}
              className="flex items-center gap-2"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              Duplicate Project
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={onDelete}
              disabled={!canDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Delete {getLabel()}
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="flex items-center gap-2"
            >
              {getMoveUpIcon()}
              {getMoveUpText()}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="flex items-center gap-2"
            >
              {getMoveDownIcon()}
              {getMoveDownText()}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={onDelete}
              disabled={!canDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Delete {getLabel()}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}