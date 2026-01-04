"use client";

import { useState } from "react";
import {
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon,
  CubeIcon,
  BookOpenIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Competitor, SurfaceType } from "../_types";
import { SURFACE_CONFIG } from "../_types";

interface AddCompetitorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (competitor: Omit<Competitor, "id" | "addedAt">) => void;
}

const surfaceIcons: Record<SurfaceType, typeof HomeIcon> = {
  pricing: CurrencyDollarIcon,
  homepage: HomeIcon,
  changelog: DocumentTextIcon,
  product: CubeIcon,
  docs: BookOpenIcon,
  careers: UserGroupIcon,
};

// MVP surfaces
const MVP_SURFACES: SurfaceType[] = ["pricing", "homepage", "changelog"];

export function AddCompetitorDialog({
  isOpen,
  onClose,
  onAdd,
}: AddCompetitorDialogProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [selectedSurfaces, setSelectedSurfaces] = useState<SurfaceType[]>([
    "pricing",
    "homepage",
  ]);

  const toggleSurface = (surface: SurfaceType) => {
    setSelectedSurfaces((prev) =>
      prev.includes(surface)
        ? prev.filter((s) => s !== surface)
        : [...prev, surface]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !domain.trim() || selectedSurfaces.length === 0) {
      return;
    }

    let cleanDomain = domain.trim();
    // Remove protocol if present
    cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
    // Remove trailing slash
    cleanDomain = cleanDomain.replace(/\/$/, "");
    // Remove www. prefix
    cleanDomain = cleanDomain.replace(/^www\./, "");

    const competitor: Omit<Competitor, "id" | "addedAt"> = {
      name: name.trim(),
      domain: cleanDomain,
      surfaces: selectedSurfaces.map((type) => {
        // Build appropriate URL for each surface type
        let path = "";
        switch (type) {
          case "homepage":
            path = "";
            break;
          case "pricing":
            path = "/pricing";
            break;
          case "changelog":
            path = "/changelog";
            break;
          case "product":
            path = "/product";
            break;
          case "docs":
            path = "/docs";
            break;
          case "careers":
            path = "/careers";
            break;
        }
        return {
          type,
          url: `https://${cleanDomain}${path}`,
          lastChecked: "", // Not checked yet
        };
      }),
    };

    onAdd(competitor);
    
    // Reset form
    setName("");
    setDomain("");
    setSelectedSurfaces(["pricing", "homepage"]);
  };

  const handleClose = () => {
    onClose();
    // Reset form on close
    setName("");
    setDomain("");
    setSelectedSurfaces(["pricing", "homepage"]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Competitor
          </DialogTitle>
          <DialogDescription className="text-white/50 text-sm">
            Track changes on competitor websites to stay ahead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Competitor name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Acme Corp"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Domain input */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Website
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., acme.com"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
            />
            <p className="mt-1.5 text-xs text-white/30">
              Enter the domain without https:// (e.g., stripe.com)
            </p>
          </div>

          {/* Surface selection */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">
              Surfaces to track
            </label>
            <div className="grid grid-cols-1 gap-2">
              {MVP_SURFACES.map((surface) => {
                const Icon = surfaceIcons[surface];
                const config = SURFACE_CONFIG[surface];
                const isSelected = selectedSurfaces.includes(surface);

                return (
                  <button
                    key={surface}
                    type="button"
                    onClick={() => toggleSurface(surface)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg border text-left transition-all
                      ${
                        isSelected
                          ? "bg-orange-500/10 border-orange-500/30 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${isSelected ? "bg-orange-500/20" : "bg-white/5"}
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? "text-orange-400" : "text-white/40"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {config.description}
                      </p>
                    </div>
                    <div
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                        ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "border-white/20"
                        }
                      `}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !domain.trim() || selectedSurfaces.length === 0}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Add Competitor
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
