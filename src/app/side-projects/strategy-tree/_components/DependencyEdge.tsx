"use client";

import { memo, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DependencyEdgeData {
  label?: string;
  [key: string]: unknown;
}

type DependencyEdgeType = Edge<DependencyEdgeData, "dependency">;

function DependencyEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<DependencyEdgeType>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const event = new CustomEvent("deleteEdge", { detail: { edgeId: id } });
      window.dispatchEvent(event);
    },
    [id]
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? "#f59e0b" : "#94a3b8",
          strokeWidth: selected ? 1.5 : 1,
          strokeDasharray: "5 3",
        }}
        markerEnd={
          selected
            ? "url(#arrow-dependency-selected)"
            : "url(#arrow-dependency)"
        }
      />

      {/* Edge label and delete button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex flex-col items-center gap-1"
        >
          {/* Dependency indicator */}
          <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
            {data?.label || "depends on"}
          </span>

          {/* Delete button - only show when selected */}
          {selected && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-5 h-5 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md transition-colors"
              title="Delete dependency"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const DependencyEdge = memo(DependencyEdgeComponent);
