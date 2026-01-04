"use client";

import { ChangeCard } from "./ChangeCard";
import type { Change, Competitor } from "../_types";

interface ChangesFeedProps {
  changes: Change[];
  competitors: Competitor[];
  onMarkAsRead: (changeId: string) => void;
}

export function ChangesFeed({
  changes,
  competitors,
  onMarkAsRead,
}: ChangesFeedProps) {
  // Group changes by date
  const groupedChanges = changes.reduce<Record<string, Change[]>>(
    (acc, change) => {
      const date = new Date(change.detectedAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(change);
      return acc;
    },
    {}
  );

  const getCompetitorName = (competitorId: string) => {
    return competitors.find((c) => c.id === competitorId)?.name || "Unknown";
  };

  if (changes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-white/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white/80 mb-2">
          No changes detected
        </h3>
        <p className="text-sm text-white/40 max-w-sm">
          Changes from your tracked competitors will appear here when detected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedChanges).map(([date, dateChanges]) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-medium text-white/40">{date}</h2>
            <div className="flex-1 border-t border-white/5" />
          </div>

          {/* Changes for this date */}
          <div className="space-y-4">
            {dateChanges.map((change) => (
              <ChangeCard
                key={change.id}
                change={change}
                competitorName={getCompetitorName(change.competitorId)}
                onMarkAsRead={() => onMarkAsRead(change.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

