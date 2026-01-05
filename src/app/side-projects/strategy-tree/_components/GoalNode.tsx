'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { GoalNodeData } from '../_types';
import { STATUS_CONFIG } from '../_types';

interface GoalNodeProps extends NodeProps<GoalNodeData> {
  hasChildren?: boolean;
  onToggleCollapse?: (nodeId: string) => void;
}

function GoalNodeComponent({ 
  id, 
  data, 
  selected,
}: GoalNodeProps) {
  const statusConfig = STATUS_CONFIG[data.status];
  const hasChildren = data.isCollapsed !== undefined;

  const handleCollapseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // This will be handled by the parent through custom events
    const event = new CustomEvent('toggleCollapse', { detail: { nodeId: id } });
    window.dispatchEvent(event);
  }, [id]);

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md border-2 transition-all duration-150
        min-w-[180px] max-w-[280px]
        ${selected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-slate-200 hover:border-slate-300'
        }
      `}
    >
      {/* Top handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-500 transition-colors"
      />

      {/* Node content */}
      <div className="p-3">
        {/* Header with status and collapse */}
        <div className="flex items-center gap-2 mb-1">
          {/* Status indicator */}
          <div 
            className={`w-2 h-2 rounded-full ${statusConfig.bgColor}`}
            title={statusConfig.label}
          />
          
          {/* Title */}
          <h3 className="text-sm font-medium text-slate-900 flex-1 truncate">
            {data.title || 'Untitled'}
          </h3>

          {/* Collapse button - only show if has children */}
          {hasChildren && (
            <button
              onClick={handleCollapseClick}
              className="p-0.5 rounded hover:bg-slate-100 transition-colors"
              title={data.isCollapsed ? 'Expand' : 'Collapse'}
            >
              {data.isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-slate-500 line-clamp-2">
            {data.description}
          </p>
        )}

        {/* Status label */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className={`text-[10px] uppercase tracking-wide font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Bottom handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-500 transition-colors"
      />

      {/* Left handle for cross-links */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2.5 !h-2.5 !bg-slate-200 !border-2 !border-white hover:!bg-blue-400 transition-colors"
      />

      {/* Right handle for cross-links */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2.5 !h-2.5 !bg-slate-200 !border-2 !border-white hover:!bg-blue-400 transition-colors"
      />
    </div>
  );
}

export const GoalNode = memo(GoalNodeComponent);

