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

interface StrategyEdgeData {
  label?: string;
  [key: string]: unknown;
}

type StrategyEdge = Edge<StrategyEdgeData, "button">;

function ButtonEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<StrategyEdge>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 24,
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
          stroke: selected ? "#3b82f6" : "#d4d4d8",
          strokeWidth: selected ? 1.5 : 1,
        }}
        markerEnd={selected ? "url(#arrow-selected)" : "url(#arrow)"}
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
          {/* Optional label */}
          {data?.label && (
            <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap">
              {data.label}
            </span>
          )}

          {/* Delete button - only show when selected */}
          {selected && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md transition-colors"
              title="Delete connection"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const ButtonEdge = memo(ButtonEdgeComponent);
