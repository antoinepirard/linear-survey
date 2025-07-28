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
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, DocumentDuplicateIcon, PlusIcon, ArrowRightIcon, FolderIcon, TagIcon, ExclamationTriangleIcon, ArchiveBoxArrowDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ProjectImpact } from '@/data/teamplan';

// Custom priority icons (same as in ImpactSelector)
const PriorityLowIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H7C6.44772 5 6 5.44772 6 6V13C6 13.5523 6.44772 14 7 14H8C8.55228 14 9 13.5523 9 13V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor" opacity="0.3"/>
    <path d="M3 8H2C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H3C3.55228 14 4 13.5523 4 13V9C4 8.44772 3.55228 8 3 8Z" fill="currentColor"/>
    <path d="M13 2H12C11.4477 2 11 2.44772 11 3V13C11 13.5523 11.4477 14 12 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" fill="currentColor" opacity="0.3"/>
  </svg>
);

const PriorityMediumIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H7C6.44772 5 6 5.44772 6 6V13C6 13.5523 6.44772 14 7 14H8C8.55228 14 9 13.5523 9 13V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor"/>
    <path d="M3 8H2C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H3C3.55228 14 4 13.5523 4 13V9C4 8.44772 3.55228 8 3 8Z" fill="currentColor"/>
    <path d="M13 2H12C11.4477 2 11 2.44772 11 3V13C11 13.5523 11.4477 14 12 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" fill="currentColor" opacity="0.3"/>
  </svg>
);

const PriorityHighIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H7C6.44772 5 6 5.44772 6 6V13C6 13.5523 6.44772 14 7 14H8C8.55228 14 9 13.5523 9 13V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor"/>
    <path d="M3 8H2C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H3C3.55228 14 4 13.5523 4 13V9C4 8.44772 3.55228 8 3 8Z" fill="currentColor"/>
    <path d="M13 2H12C11.4477 2 11 2.44772 11 3V13C11 13.5523 11.4477 14 12 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" fill="currentColor"/>
  </svg>
);

const PriorityUrgentIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.99998 1C2.46956 1 1.96085 1.21071 1.58578 1.58578C1.21071 1.96085 1 2.46956 1 2.99998V12.9999C1 13.5303 1.21071 14.039 1.58578 14.4141C1.96085 14.7892 2.46956 14.9999 2.99998 14.9999H12.9999C13.5303 14.9999 14.039 14.7892 14.4141 14.4141C14.7892 14.039 14.9999 13.5303 14.9999 12.9999V2.99998C14.9999 2.46956 14.7892 1.96085 14.4141 1.58578C14.039 1.21071 13.5303 1 12.9999 1H2.99998ZM6.91395 3.99998H8.65194L8.49994 9.60193H7.06995L6.91395 3.99998ZM8.72294 11.1639C8.71983 11.4117 8.62001 11.6485 8.44477 11.8237C8.26953 11.999 8.03275 12.0988 7.78495 12.1019C7.65979 12.106 7.53508 12.0849 7.41825 12.0398C7.30141 11.9948 7.19484 11.9267 7.10485 11.8396C7.01487 11.7525 6.94331 11.6482 6.89445 11.5329C6.84558 11.4176 6.8204 11.2936 6.8204 11.1684C6.8204 11.0432 6.84558 10.9192 6.89445 10.804C6.94331 10.6887 7.01487 10.5844 7.10485 10.4973C7.19484 10.4102 7.30141 10.3421 7.41825 10.297C7.53508 10.2519 7.65979 10.2308 7.78495 10.2349C8.28494 10.2349 8.71894 10.6519 8.72294 11.1639Z" fill="currentColor"/>
  </svg>
);

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
  onMoveToBacklog?: () => void;
  onMoveToGroup?: (groupName: string) => void;
  onSetImpact?: (impact: ProjectImpact | undefined) => void;
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
  onMoveToBacklog,
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
              onClick={onMoveToBacklog}
              disabled={!onMoveToBacklog}
              className="flex items-center gap-2"
            >
              <ArchiveBoxArrowDownIcon className="h-4 w-4" />
              Remove from plan
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
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-36">
                <ContextMenuItem
                  onClick={() => onSetImpact?.(undefined)}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <Image 
                    src="/Assets/TeamPlan-Ravell/priority-unset.svg" 
                    alt="Unset priority"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  Unset
                  {!currentImpact && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('low')}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <PriorityLowIcon className="h-4 w-4" />
                  Low
                  {currentImpact === 'low' && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('medium')}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <PriorityMediumIcon className="h-4 w-4" />
                  Medium
                  {currentImpact === 'medium' && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('high')}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <PriorityHighIcon className="h-4 w-4" />
                  High
                  {currentImpact === 'high' && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onSetImpact?.('urgent')}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <PriorityUrgentIcon className="h-4 w-4" />
                  Urgent
                  {currentImpact === 'urgent' && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
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