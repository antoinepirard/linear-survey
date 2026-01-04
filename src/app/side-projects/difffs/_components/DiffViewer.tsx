"use client";

import { useMemo } from "react";

interface DiffViewerProps {
  before?: string;
  after?: string;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
}

function computeDiff(before: string, after: string): DiffLine[] {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const result: DiffLine[] = [];

  // Simple diff algorithm - compare line by line
  const maxLen = Math.max(beforeLines.length, afterLines.length);
  
  // Create a map of lines that exist in both
  const beforeSet = new Set(beforeLines);
  const afterSet = new Set(afterLines);

  // Build result maintaining approximate order
  let beforeIdx = 0;
  let afterIdx = 0;

  while (beforeIdx < beforeLines.length || afterIdx < afterLines.length) {
    const beforeLine = beforeLines[beforeIdx];
    const afterLine = afterLines[afterIdx];

    if (beforeLine === afterLine) {
      // Lines match - unchanged
      result.push({ type: "unchanged", content: beforeLine || "" });
      beforeIdx++;
      afterIdx++;
    } else if (beforeLine && !afterSet.has(beforeLine)) {
      // Line was removed
      result.push({ type: "removed", content: beforeLine });
      beforeIdx++;
    } else if (afterLine && !beforeSet.has(afterLine)) {
      // Line was added
      result.push({ type: "added", content: afterLine });
      afterIdx++;
    } else {
      // Both lines exist somewhere, move forward
      if (beforeIdx < beforeLines.length) beforeIdx++;
      if (afterIdx < afterLines.length) afterIdx++;
    }

    // Safety check to prevent infinite loops
    if (result.length > maxLen * 2) break;
  }

  return result;
}

export function DiffViewer({ before = "", after = "" }: DiffViewerProps) {
  const diff = useMemo(() => computeDiff(before, after), [before, after]);

  // Show side-by-side view for larger screens
  return (
    <div className="p-4">
      {/* Side by side view on desktop */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        {/* Before */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-red-400/70 uppercase tracking-wider">
              Before
            </span>
          </div>
          <div className="bg-zinc-950 rounded-lg p-3 font-mono text-sm overflow-x-auto">
            {before ? (
              before.split("\n").map((line, i) => {
                const wasRemoved = !after.includes(line);
                return (
                  <div
                    key={i}
                    className={`
                      px-2 py-0.5 -mx-2
                      ${wasRemoved ? "bg-red-500/10 text-red-300" : "text-white/60"}
                    `}
                  >
                    {wasRemoved && (
                      <span className="text-red-500 mr-2 select-none">−</span>
                    )}
                    {line || " "}
                  </div>
                );
              })
            ) : (
              <span className="text-white/30 italic">No previous content</span>
            )}
          </div>
        </div>

        {/* After */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-emerald-400/70 uppercase tracking-wider">
              After
            </span>
          </div>
          <div className="bg-zinc-950 rounded-lg p-3 font-mono text-sm overflow-x-auto">
            {after ? (
              after.split("\n").map((line, i) => {
                const wasAdded = !before.includes(line);
                return (
                  <div
                    key={i}
                    className={`
                      px-2 py-0.5 -mx-2
                      ${wasAdded ? "bg-emerald-500/10 text-emerald-300" : "text-white/60"}
                    `}
                  >
                    {wasAdded && (
                      <span className="text-emerald-500 mr-2 select-none">+</span>
                    )}
                    {line || " "}
                  </div>
                );
              })
            ) : (
              <span className="text-white/30 italic">No new content</span>
            )}
          </div>
        </div>
      </div>

      {/* Unified view on mobile */}
      <div className="md:hidden">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Changes
          </span>
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500/50" />
              Removed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
              Added
            </span>
          </div>
        </div>
        <div className="bg-zinc-950 rounded-lg p-3 font-mono text-xs overflow-x-auto">
          {diff.map((line, i) => (
            <div
              key={i}
              className={`
                px-2 py-0.5 -mx-2
                ${line.type === "added" ? "bg-emerald-500/10 text-emerald-300" : ""}
                ${line.type === "removed" ? "bg-red-500/10 text-red-300" : ""}
                ${line.type === "unchanged" ? "text-white/40" : ""}
              `}
            >
              <span className="select-none mr-2 w-3 inline-block text-center">
                {line.type === "added" && (
                  <span className="text-emerald-500">+</span>
                )}
                {line.type === "removed" && (
                  <span className="text-red-500">−</span>
                )}
              </span>
              {line.content || " "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

