"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LightBulbIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { DiffViewer } from "./DiffViewer";
import type { Change, SurfaceType } from "../_types";
import { CHANGE_TYPE_CONFIG, SURFACE_CONFIG } from "../_types";
import { formatRelativeTime } from "../_utils/helpers";

interface ChangeCardProps {
  change: Change;
  competitorName: string;
  onMarkAsRead: () => void;
}

const surfaceIcons: Record<SurfaceType, typeof HomeIcon> = {
  pricing: CurrencyDollarIcon,
  homepage: HomeIcon,
  changelog: DocumentTextIcon,
  product: HomeIcon,
  docs: HomeIcon,
  careers: HomeIcon,
};

export function ChangeCard({
  change,
  competitorName,
  onMarkAsRead,
}: ChangeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeConfig = CHANGE_TYPE_CONFIG[change.changeType];
  const surfaceConfig = SURFACE_CONFIG[change.surfaceType];
  const SurfaceIcon = surfaceIcons[change.surfaceType];

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!change.isRead) {
      onMarkAsRead();
    }
  };

  return (
    <div
      className={`
        rounded-xl border transition-all
        ${change.isRead 
          ? "bg-white/[0.02] border-white/5" 
          : "bg-white/[0.04] border-orange-500/20"
        }
      `}
    >
      {/* Main content */}
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Unread indicator */}
          {!change.isRead && (
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
          )}

          {/* Change type badge */}
          <span
            className={`
              inline-flex items-center px-2 py-1 rounded-md text-xs font-medium shrink-0
              ${typeConfig.bgColor} ${typeConfig.color}
            `}
          >
            {typeConfig.label}
          </span>

          {/* Surface badge */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-white/40 bg-white/5 shrink-0">
            <SurfaceIcon className="w-3 h-3" />
            {surfaceConfig.label}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Competitor & time */}
          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-white/80">{competitorName}</p>
            <p className="text-xs text-white/40">
              {formatRelativeTime(change.detectedAt)}
            </p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-white/90 leading-relaxed mb-4">
          {change.summary}
        </p>

        {/* Why it matters */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <LightBulbIcon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Why it matters
            </span>
          </div>
          <ul className="space-y-1.5">
            {change.whyItMatters.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/60"
              >
                <span className="text-white/20 mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested actions */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Suggested response
            </span>
          </div>
          <ul className="space-y-1.5">
            {change.suggestedActions.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/60"
              >
                <span className="text-emerald-400/50 mt-0.5">→</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expand/collapse button */}
        {(change.beforeText || change.afterText) && (
          <button
            onClick={handleExpand}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                <span>Hide diff</span>
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                <span>View diff</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Diff viewer */}
      {isExpanded && (change.beforeText || change.afterText) && (
        <div className="border-t border-white/5">
          <DiffViewer before={change.beforeText} after={change.afterText} />
        </div>
      )}
    </div>
  );
}

