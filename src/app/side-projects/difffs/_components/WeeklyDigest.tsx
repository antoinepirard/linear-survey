"use client";

import { useMemo } from "react";
import {
  SparklesIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import type { WeeklyDigestData, ChangeType } from "../_types";
import { CHANGE_TYPE_CONFIG } from "../_types";
import { getWeekRange } from "../_utils/helpers";

interface WeeklyDigestProps {
  digest: WeeklyDigestData;
}

export function WeeklyDigest({ digest }: WeeklyDigestProps) {
  // Calculate change type distribution
  const typeDistribution = useMemo(() => {
    const counts: Record<ChangeType, number> = {
      pricing: 0,
      packaging: 0,
      positioning: 0,
      feature: 0,
      trust: 0,
      urgency: 0,
    };

    digest.summaries.forEach((summary) => {
      summary.changeTypes.forEach((type) => {
        counts[type]++;
      });
    });

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a);
  }, [digest]);

  const maxCount = Math.max(...typeDistribution.map(([, count]) => count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            Weekly Digest
          </h2>
          <p className="text-sm text-white/40">
            {getWeekRange(digest.weekStart, digest.weekEnd)}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
          <ChartBarIcon className="w-4 h-4 text-white/40" />
          <span className="text-sm font-medium text-white/80">
            {digest.totalChanges} changes
          </span>
        </div>
      </div>

      {/* Top theme */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-medium text-white/60">
            Top Theme This Week
          </span>
        </div>
        <p className="text-lg font-semibold text-white">{digest.topTheme}</p>
      </div>

      {/* Competitor summaries */}
      <div>
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
          By Competitor
        </h3>
        <div className="space-y-3">
          {digest.summaries.map((summary) => (
              <div
                key={summary.competitorId}
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-white/80">
                    {summary.competitorName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {summary.competitorName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {summary.changeTypes.slice(0, 3).map((type) => {
                      const config = CHANGE_TYPE_CONFIG[type];
                      return (
                        <span
                          key={type}
                          className={`
                            inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium
                            ${config.bgColor} ${config.color}
                          `}
                        >
                          {config.label}
                        </span>
                      );
                    })}
                    {summary.changeTypes.length > 3 && (
                      <span className="text-[10px] text-white/40">
                        +{summary.changeTypes.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Change count */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-semibold text-white">
                    {summary.changeCount}
                  </p>
                  <p className="text-xs text-white/40">
                    {summary.changeCount === 1 ? "change" : "changes"}
                  </p>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* Change type distribution */}
      <div>
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
          Change Types
        </h3>
        <div className="space-y-3">
          {typeDistribution.map(([type, count]) => {
            const config = CHANGE_TYPE_CONFIG[type as ChangeType];
            const percentage = (count / maxCount) * 100;

            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-sm text-white/40">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.bgColor.replace("/10", "/50")}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-white/80">
            Competitor activity is up
          </p>
          <p className="text-xs text-white/40">
            {digest.totalChanges} changes detected across{" "}
            {digest.summaries.length} competitors
          </p>
        </div>
      </div>
    </div>
  );
}

