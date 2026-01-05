'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  FlagIcon,
  MapIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { StrategyNodeData, StrategyNodeType } from '../_types';
import { STATUS_CONFIG, NODE_TYPE_CONFIG, calculateProgress, formatDate } from '../_types';

// Get the appropriate icon component for a node type
function NodeTypeIcon({ nodeType, className }: { nodeType: StrategyNodeType; className?: string }) {
  const iconClass = className || 'w-3.5 h-3.5';
  
  switch (nodeType) {
    case 'company-goal':
      return <FlagIcon className={iconClass} />;
    case 'strategy':
      return <MapIcon className={iconClass} />;
    case 'initiative':
      return <RocketLaunchIcon className={iconClass} />;
    case 'task':
      return <CheckCircleIcon className={iconClass} />;
    default:
      return <FlagIcon className={iconClass} />;
  }
}

function StrategyNodeComponent({ 
  id, 
  data, 
  selected,
}: NodeProps<StrategyNodeData>) {
  const statusConfig = STATUS_CONFIG[data.status];
  const nodeTypeConfig = NODE_TYPE_CONFIG[data.nodeType];
  const hasChildren = data.isCollapsed !== undefined;
  const progress = calculateProgress(data.metrics);

  const handleCollapseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('toggleCollapse', { detail: { nodeId: id } });
    window.dispatchEvent(event);
  }, [id]);

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md border transition-all duration-150
        w-[240px]
        ${selected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : `${nodeTypeConfig.borderColor} hover:border-slate-300`
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
        {/* Header with type badge and collapse */}
        <div className="flex items-center gap-2 mb-1.5">
          {/* Type badge */}
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${nodeTypeConfig.bgColor} ${nodeTypeConfig.color}`}>
            <NodeTypeIcon nodeType={data.nodeType} className={`w-3 h-3 ${nodeTypeConfig.iconColor}`} />
            {nodeTypeConfig.label}
          </span>
          
          <div className="flex-1" />

          {/* Collapse button */}
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

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          {data.title || 'Untitled'}
        </h3>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">
            {data.description}
          </p>
        )}

        {/* Metrics row */}
        {data.metrics && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Progress */}
            {data.metrics.progress?.enabled && progress !== null && (
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      progress >= 100 ? 'bg-emerald-500' : 
                      progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  {progress}%
                </span>
              </div>
            )}

            {/* Timeline */}
            {data.metrics.timeline?.enabled && data.metrics.timeline.dueDate && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                <CalendarIcon className="w-3 h-3" />
                {formatDate(data.metrics.timeline.dueDate)}
              </span>
            )}

            {/* Owner */}
            {data.metrics.owner?.enabled && data.metrics.owner.name && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 truncate max-w-[80px]">
                <UserIcon className="w-3 h-3 flex-shrink-0" />
                {data.metrics.owner.name}
              </span>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <div className={`w-2 h-2 rounded-full ${statusConfig.bgColor}`} />
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

export const StrategyNode = memo(StrategyNodeComponent);

// Export the icon component for reuse in sidebar
export { NodeTypeIcon };
