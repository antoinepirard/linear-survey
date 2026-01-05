"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FlagIcon,
  MapIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  CheckIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { StrategyNodeData, StrategyNodeType } from "../_types";
import {
  STATUS_CONFIG,
  NODE_TYPE_CONFIG,
  calculateProgress,
  formatDate,
} from "../_types";

// Get the appropriate icon component for a node type
function NodeTypeIcon({
  nodeType,
  className,
}: {
  nodeType: StrategyNodeType;
  className?: string;
}) {
  const iconClass = className || "w-4 h-4";

  switch (nodeType) {
    case "company-goal":
      return <FlagIcon className={iconClass} />;
    case "strategy":
      return <MapIcon className={iconClass} />;
    case "initiative":
      return <RocketLaunchIcon className={iconClass} />;
    case "task":
      return <CheckCircleIcon className={iconClass} />;
    default:
      return <FlagIcon className={iconClass} />;
  }
}

function StrategyNodeComponent({
  data,
  selected,
}: {
  data: StrategyNodeData;
  selected?: boolean;
}) {
  const statusConfig = STATUS_CONFIG[data.status];
  const nodeTypeConfig = NODE_TYPE_CONFIG[data.nodeType];
  const progress = calculateProgress(data.metrics);
  const hasProgress = data.metrics?.progress?.enabled && progress !== null;

  // Check if we have any metadata to show in footer
  const hasTimeline =
    data.metrics?.timeline?.enabled && data.metrics.timeline.dueDate;
  const hasOwner = data.metrics?.owner?.enabled && data.metrics.owner.name;
  const hasFooter = hasTimeline || hasOwner;

  return (
    <div className="relative">
      {/* Status badge - positioned in top right, overlapping the edge */}
      {data.status !== "not-started" && (
        <div
          className={`absolute -top-2.5 right-4 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            data.status === "on-track"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : data.status === "at-risk"
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-rose-50 text-rose-600 border border-rose-200"
          }`}
        >
          {data.status === "on-track" && <CheckIcon className="w-3 h-3" />}
          {hasProgress ? `${progress}%` : statusConfig.label}
        </div>
      )}

      {/* Main card */}
      <div
        className={`
          bg-white rounded-xl ring-1 transition-all duration-150
          w-[280px] shadow-sm
          ${
            selected
              ? "ring-blue-400 shadow-md shadow-blue-500/10"
              : "ring-slate-300/40"
          }
        `}
      >
        {/* Top handle */}
        <Handle
          type="target"
          id="top"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !bg-white !border !border-slate-300 !rounded-full hover:!border-blue-400 transition-colors"
        />

        {/* Content */}
        <div className="px-4 py-3">
          {/* Title row with icon */}
          <div className="flex items-start gap-2 mb-1.5">
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${nodeTypeConfig.bgColor}`}
            >
              <NodeTypeIcon
                nodeType={data.nodeType}
                className={`w-3.5 h-3.5 ${nodeTypeConfig.iconColor}`}
              />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight pt-0.5">
              {data.title || "Untitled"}
            </h3>
          </div>

          {/* Description */}
          {data.description && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Footer with metadata */}
        {hasFooter && (
          <div className="border-t border-slate-100 px-4 py-2.5 flex items-center gap-3">
            {hasTimeline && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDate(data.metrics!.timeline!.dueDate)}
              </span>
            )}
            {hasOwner && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 truncate">
                <UserIcon className="w-3.5 h-3.5 flex-shrink-0" />
                {data.metrics!.owner!.name}
              </span>
            )}
          </div>
        )}

        {/* Bottom handle */}
        <Handle
          type="source"
          id="bottom"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !bg-white !border !border-slate-300 !rounded-full hover:!border-blue-400 transition-colors"
        />
      </div>
    </div>
  );
}

export const StrategyNode = memo(StrategyNodeComponent);

// Export the icon component for reuse in sidebar
export { NodeTypeIcon };
