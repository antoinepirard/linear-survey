"use client";

import { useState, useMemo } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { CompetitorList } from "./CompetitorList";
import { ChangesFeed } from "./ChangesFeed";
import { WeeklyDigest } from "./WeeklyDigest";
import { mockCompetitors, mockChanges, mockWeeklyDigest } from "../_data/mock";
import type { Competitor, Change } from "../_types";

type View = "feed" | "digest";

export function DifffsApp() {
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors);
  const [changes, setChanges] = useState<Change[]>(mockChanges);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const [view, setView] = useState<View>("feed");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter changes by selected competitor
  const filteredChanges = useMemo(() => {
    const sorted = [...changes].sort(
      (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
    if (!selectedCompetitorId) return sorted;
    return sorted.filter((c) => c.competitorId === selectedCompetitorId);
  }, [changes, selectedCompetitorId]);

  // Count unread changes
  const unreadCount = useMemo(() => {
    return changes.filter((c) => !c.isRead).length;
  }, [changes]);

  // Count changes this week
  const weeklyChangeCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return changes.filter((c) => new Date(c.detectedAt) >= sevenDaysAgo).length;
  }, [changes]);

  // Add competitor handler
  const handleAddCompetitor = (competitor: Competitor) => {
    setCompetitors((prev) => [...prev, competitor]);
  };

  // Mark change as read
  const handleMarkAsRead = (changeId: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, isRead: true } : c))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <span className="font-mono text-sm tracking-tight">difffs</span>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-zinc-900 border-r border-white/5
          transform transition-transform duration-200 ease-out
          lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="font-mono text-sm tracking-tight">difffs</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 -mr-2 text-white/60 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>{competitors.length} competitors</span>
            <span>·</span>
            <span>{weeklyChangeCount} changes this week</span>
          </div>
        </div>

        {/* Competitor list */}
        <div className="flex-1 overflow-y-auto">
          <CompetitorList
            competitors={competitors}
            selectedId={selectedCompetitorId}
            onSelect={(id) => {
              setSelectedCompetitorId(id);
              setIsSidebarOpen(false);
            }}
            onAddCompetitor={handleAddCompetitor}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Main header */}
        <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-white/5 pt-14 lg:pt-0">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            {/* View tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setView("feed")}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${view === "feed" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"}
                `}
              >
                <BellIcon className="w-4 h-4" />
                <span>Feed</span>
                {unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setView("digest")}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${view === "digest" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"}
                `}
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Weekly Digest</span>
              </button>
            </div>

            {/* Filter indicator */}
            {selectedCompetitorId && (
              <button
                onClick={() => setSelectedCompetitorId(null)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span>
                  Filtering:{" "}
                  {competitors.find((c) => c.id === selectedCompetitorId)?.name}
                </span>
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Content area */}
        <div className="p-4 lg:p-6">
          {view === "feed" ? (
            <ChangesFeed
              changes={filteredChanges}
              competitors={competitors}
              onMarkAsRead={handleMarkAsRead}
            />
          ) : (
            <WeeklyDigest digest={mockWeeklyDigest} />
          )}
        </div>
      </main>
    </div>
  );
}

