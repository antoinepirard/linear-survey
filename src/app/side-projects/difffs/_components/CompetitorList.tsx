"use client";

import { useState } from "react";
import {
  PlusIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AddCompetitorDialog } from "./AddCompetitorDialog";
import type { Competitor, SurfaceType, Surface } from "../_types";
import { formatRelativeTime } from "../_utils/helpers";

interface CompetitorListProps {
  competitors: Competitor[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAddCompetitor: (competitor: Omit<Competitor, "id" | "addedAt">) => void;
  onRemoveCompetitor?: (competitorId: string) => void;
  onCheckCompetitor?: (competitorId: string) => Promise<void>;
  isChecking?: boolean;
  checkingCompetitorId?: string | null;
}

const surfaceIcons: Record<SurfaceType, typeof GlobeAltIcon> = {
  pricing: CurrencyDollarIcon,
  homepage: HomeIcon,
  changelog: DocumentTextIcon,
  product: GlobeAltIcon,
  docs: GlobeAltIcon,
  careers: GlobeAltIcon,
};

function getLastChecked(surfaces: Surface[]): string | null {
  const checkedSurfaces = surfaces.filter((s) => s.lastChecked);
  if (checkedSurfaces.length === 0) return null;
  
  // Find most recent check
  const mostRecent = checkedSurfaces.reduce((latest, surface) => {
    if (!latest.lastChecked) return surface;
    if (!surface.lastChecked) return latest;
    return new Date(surface.lastChecked) > new Date(latest.lastChecked) ? surface : latest;
  });
  
  return mostRecent.lastChecked || null;
}

export function CompetitorList({
  competitors,
  selectedId,
  onSelect,
  onAddCompetitor,
  onRemoveCompetitor,
  onCheckCompetitor,
  isChecking = false,
  checkingCompetitorId = null,
}: CompetitorListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="py-2">
      {/* All changes option */}
      <div className="px-2 mb-1">
        <button
          onClick={() => onSelect(null)}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
            ${selectedId === null 
              ? "bg-white/10 text-white" 
              : "text-white/60 hover:text-white hover:bg-white/5"
            }
          `}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
            <GlobeAltIcon className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">All Competitors</p>
            <p className="text-xs text-white/40">{competitors.length} tracked</p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 border-t border-white/5" />

      {/* Competitor list */}
      <div className="px-2 space-y-1">
        {competitors.map((competitor) => {
          const lastChecked = getLastChecked(competitor.surfaces);
          const isThisChecking = checkingCompetitorId === competitor.id;

          return (
            <div
              key={competitor.id}
              className={`
                group relative rounded-lg transition-colors
                ${selectedId === competitor.id 
                  ? "bg-white/10" 
                  : "hover:bg-white/5"
                }
              `}
            >
              <button
                onClick={() => onSelect(competitor.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-left
                  ${selectedId === competitor.id 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                  }
                `}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-white/80">
                    {competitor.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{competitor.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      {competitor.surfaces.map((surface) => {
                        const Icon = surfaceIcons[surface.type];
                        return (
                          <Icon
                            key={surface.type}
                            className="w-3 h-3 text-white/30"
                            title={surface.type}
                          />
                        );
                      })}
                    </div>
                    {lastChecked && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-[10px] text-white/30">
                          {formatRelativeTime(lastChecked)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              {/* Action buttons (visible on hover) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onCheckCompetitor && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCheckCompetitor(competitor.id);
                    }}
                    disabled={isChecking}
                    className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
                    title="Check for changes"
                  >
                    <ArrowPathIcon 
                      className={`w-3.5 h-3.5 ${isThisChecking ? "animate-spin" : ""}`} 
                    />
                  </button>
                )}
                {onRemoveCompetitor && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove ${competitor.name}?`)) {
                        onRemoveCompetitor(competitor.id);
                      }
                    }}
                    className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove competitor"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add competitor button */}
      <div className="px-2 mt-4">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Competitor</span>
        </button>
      </div>

      {/* Add competitor dialog */}
      <AddCompetitorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={(competitor) => {
          onAddCompetitor(competitor);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
