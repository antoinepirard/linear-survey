"use client";

import { useState, useEffect, useCallback } from "react";
import type { Competitor, Change, SurfaceType } from "../_types";
import { generateId } from "../_utils/helpers";

// Storage keys
const STORAGE_KEYS = {
  competitors: "difffs_competitors",
  snapshots: "difffs_snapshots",
  changes: "difffs_changes",
} as const;

// Snapshot type for storing page content
export interface Snapshot {
  id: string;
  competitorId: string;
  surfaceType: SurfaceType;
  url: string;
  content: string;
  capturedAt: string;
}

// Return type for the hook
interface UseDifffsReturn {
  // Data
  competitors: Competitor[];
  changes: Change[];
  snapshots: Snapshot[];
  
  // Loading states
  isLoading: boolean;
  isChecking: boolean;
  checkingCompetitorId: string | null;
  
  // Actions
  addCompetitor: (competitor: Omit<Competitor, "id" | "addedAt">) => void;
  removeCompetitor: (competitorId: string) => void;
  checkCompetitor: (competitorId: string) => Promise<void>;
  checkAllCompetitors: () => Promise<void>;
  markChangeAsRead: (changeId: string) => void;
  clearAllData: () => void;
}

// Helper to safely get from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Initial test competitor for demo
const DEMO_COMPETITORS: Competitor[] = [
  {
    id: "demo-1",
    name: "Linear",
    domain: "linear.app",
    surfaces: [
      { type: "homepage", url: "https://linear.app", lastChecked: "" },
      { type: "pricing", url: "https://linear.app/pricing", lastChecked: "" },
    ],
    addedAt: new Date().toISOString(),
  },
];

// Helper to safely set to localStorage
function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
  }
}

export function useDifffs(): UseDifffsReturn {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [checkingCompetitorId, setCheckingCompetitorId] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedCompetitors = getFromStorage<Competitor[]>(STORAGE_KEYS.competitors, []);
    // Use demo data if no competitors stored
    setCompetitors(storedCompetitors.length > 0 ? storedCompetitors : DEMO_COMPETITORS);
    setSnapshots(getFromStorage(STORAGE_KEYS.snapshots, []));
    setChanges(getFromStorage(STORAGE_KEYS.changes, []));
    setIsLoading(false);
  }, []);

  // Persist competitors to localStorage
  useEffect(() => {
    if (!isLoading) {
      setToStorage(STORAGE_KEYS.competitors, competitors);
    }
  }, [competitors, isLoading]);

  // Persist snapshots to localStorage
  useEffect(() => {
    if (!isLoading) {
      setToStorage(STORAGE_KEYS.snapshots, snapshots);
    }
  }, [snapshots, isLoading]);

  // Persist changes to localStorage
  useEffect(() => {
    if (!isLoading) {
      setToStorage(STORAGE_KEYS.changes, changes);
    }
  }, [changes, isLoading]);

  // Add a new competitor
  const addCompetitor = useCallback(
    (competitorData: Omit<Competitor, "id" | "addedAt">) => {
      const competitor: Competitor = {
        ...competitorData,
        id: generateId(),
        addedAt: new Date().toISOString(),
      };
      setCompetitors((prev) => [...prev, competitor]);
    },
    []
  );

  // Remove a competitor and its related data
  const removeCompetitor = useCallback((competitorId: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== competitorId));
    setSnapshots((prev) => prev.filter((s) => s.competitorId !== competitorId));
    setChanges((prev) => prev.filter((c) => c.competitorId !== competitorId));
  }, []);

  // Check a single competitor for changes
  const checkCompetitor = useCallback(
    async (competitorId: string) => {
      const competitor = competitors.find((c) => c.id === competitorId);
      if (!competitor) return;

      setIsChecking(true);
      setCheckingCompetitorId(competitorId);

      try {
        for (const surface of competitor.surfaces) {
          // Fetch current content
          const response = await fetch("/api/difffs/fetch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: surface.url }),
          });

          if (!response.ok) {
            console.error(`Failed to fetch ${surface.url}`);
            continue;
          }

          const { content, title } = await response.json();

          // Get the last snapshot for this surface
          const lastSnapshot = snapshots
            .filter(
              (s) =>
                s.competitorId === competitorId &&
                s.surfaceType === surface.type
            )
            .sort(
              (a, b) =>
                new Date(b.capturedAt).getTime() -
                new Date(a.capturedAt).getTime()
            )[0];

          // Create new snapshot
          const newSnapshot: Snapshot = {
            id: generateId(),
            competitorId,
            surfaceType: surface.type,
            url: surface.url,
            content,
            capturedAt: new Date().toISOString(),
          };

          // Compare with last snapshot if exists
          if (lastSnapshot && lastSnapshot.content !== content) {
            // Detect changes using the diffing utility
            const { detectChanges } = await import("../_utils/diffing");
            const detectedChanges = detectChanges(
              lastSnapshot.content,
              content,
              competitorId,
              surface.type,
              competitor.name
            );

            if (detectedChanges.length > 0) {
              setChanges((prev) => [...detectedChanges, ...prev]);
            }
          }

          // Save the new snapshot
          setSnapshots((prev) => [...prev, newSnapshot]);

          // Update surface lastChecked
          setCompetitors((prev) =>
            prev.map((c) =>
              c.id === competitorId
                ? {
                    ...c,
                    surfaces: c.surfaces.map((s) =>
                      s.type === surface.type
                        ? { ...s, lastChecked: new Date().toISOString() }
                        : s
                    ),
                  }
                : c
            )
          );
        }
      } catch (error) {
        console.error("Error checking competitor:", error);
      } finally {
        setIsChecking(false);
        setCheckingCompetitorId(null);
      }
    },
    [competitors, snapshots]
  );

  // Check all competitors
  const checkAllCompetitors = useCallback(async () => {
    for (const competitor of competitors) {
      await checkCompetitor(competitor.id);
    }
  }, [competitors, checkCompetitor]);

  // Mark a change as read
  const markChangeAsRead = useCallback((changeId: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, isRead: true } : c))
    );
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setCompetitors([]);
    setSnapshots([]);
    setChanges([]);
    localStorage.removeItem(STORAGE_KEYS.competitors);
    localStorage.removeItem(STORAGE_KEYS.snapshots);
    localStorage.removeItem(STORAGE_KEYS.changes);
  }, []);

  return {
    competitors,
    changes,
    snapshots,
    isLoading,
    isChecking,
    checkingCompetitorId,
    addCompetitor,
    removeCompetitor,
    checkCompetitor,
    checkAllCompetitors,
    markChangeAsRead,
    clearAllData,
  };
}

