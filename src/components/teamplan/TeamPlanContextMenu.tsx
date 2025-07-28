'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, DocumentDuplicateIcon, PlusIcon, ArrowRightIcon, FolderIcon, TagIcon, ExclamationTriangleIcon, FireIcon } from '@heroicons/react/24/outline';
import { ProjectImpact } from '@/data/teamplan';

export type ContextMenuType = 'person' | 'timeSlot' | 'project' | 'cell' | 'backlogProject';

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
  onAddProject?: () => void;
  onMoveToBoard?: () => void;
  onMoveToGroup?: (groupName: string) => void;
  onSetImpact?: (impact: ProjectImpact) => void;
  availableGroups?: string[];
  currentGroup?: string;
  currentImpact?: ProjectImpact;
  personName?: string;
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
  onAddProject,
  onMoveToBoard,
  onMoveToGroup,
  onSetImpact,
  availableGroups = [],
  currentGroup,
  currentImpact,
  personName,
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
              Delete <span className="text-red-400">{getLabel()}</span>
            </ContextMenuItem>
          </>
        ) : type === 'backlogProject' ? (
          <>
            <ContextMenuItem
              onClick={onMoveToBoard}
              className="flex items-center gap-2"
            >
              <ArrowRightIcon className="h-4 w-4" />
              Move to Board
            </ContextMenuItem>
            
            {/* Move to Group Submenu */}
            <ContextMenuSub>
              <ContextMenuSubTrigger className="flex items-center gap-2">
                <FolderIcon className="h-4 w-4" />
                Move to Group
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                {availableGroups.length > 0 ? (
                  <>
                    {availableGroups
                      .filter(group => group !== currentGroup)
                      .map((group) => (
                        <ContextMenuItem
                          key={group}
                          onClick={() => onMoveToGroup?.(group)}
                          className="flex items-center gap-2"
                        >
                          <TagIcon className="h-4 w-4" />
                          {group}
                        </ContextMenuItem>
                      ))}
                    {currentGroup && (
                      <>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={() => onMoveToGroup?.('')}
                          className="flex items-center gap-2"
                        >
                          <TagIcon className="h-4 w-4" />
                          Remove from Group
                        </ContextMenuItem>
                      </>
                    )}
                  </>
                ) : (
                  <ContextMenuItem disabled className="text-gray-500">
                    No groups available
                  </ContextMenuItem>
                )}
              </ContextMenuSubContent>
            </ContextMenuSub>
            
            {/* Set Impact Submenu */}
            <ContextMenuSub>
              <ContextMenuSubTrigger className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4" />
                Set Impact
                {currentImpact && (
                  <span className="ml-auto text-xs text-gray-500 capitalize">{currentImpact}</span>
                )}
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-36">
                <ContextMenuItem
                  onClick={() => onSetImpact?.('low')}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <ChevronDownIcon className="h-4 w-4" />
                  Low
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('medium')}
                  className="flex items-center gap-2 text-blue-600"
                >
                  <ChevronUpIcon className="h-4 w-4" />
                  Medium
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('high')}
                  className="flex items-center gap-2 text-orange-600"
                >
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  High
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('urgent')}
                  className="flex items-center gap-2 text-red-600"
                >
                  <FireIcon className="h-4 w-4" />
                  Urgent
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            
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
              Delete <span className="text-red-400">{getLabel()}</span>
            </ContextMenuItem>
          </>
        ) : type === 'cell' ? (
          <>
            <ContextMenuItem
              onClick={onAddProject}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Project
            </ContextMenuItem>
            {personName && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  className="flex items-center gap-2"
                >
                  <ChevronUpIcon className="h-4 w-4" />
                  Move {personName} Up
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  className="flex items-center gap-2"
                >
                  <ChevronDownIcon className="h-4 w-4" />
                  Move {personName} Down
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={onDelete}
                  disabled={!canDelete}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete <span className="text-red-400">{personName}</span>
                </ContextMenuItem>
              </>
            )}
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
              Delete <span className="text-red-400">{getLabel()}</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}