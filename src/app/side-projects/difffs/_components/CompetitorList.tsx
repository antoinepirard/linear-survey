"use client";

import { useState } from "react";
import {
  PlusIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { AddCompetitorDialog } from "./AddCompetitorDialog";
import type { Competitor, SurfaceType } from "../_types";

interface CompetitorListProps {
  competitors: Competitor[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAddCompetitor: (competitor: Competitor) => void;
}

const surfaceIcons: Record<SurfaceType, typeof GlobeAltIcon> = {
  pricing: CurrencyDollarIcon,
  homepage: HomeIcon,
  changelog: DocumentTextIcon,
  product: GlobeAltIcon,
  docs: GlobeAltIcon,
  careers: GlobeAltIcon,
};

export function CompetitorList({
  competitors,
  selectedId,
  onSelect,
  onAddCompetitor,
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
        {competitors.map((competitor) => (
          <button
            key={competitor.id}
            onClick={() => onSelect(competitor.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
              ${selectedId === competitor.id 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:text-white hover:bg-white/5"
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
              <div className="flex items-center gap-1.5 mt-0.5">
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
            </div>
          </button>
        ))}
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

