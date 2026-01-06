"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CURRENT_VERSION = "0.2.0";
const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/antoinepirard/linear-survey/main/package.json";
const GITHUB_RELEASES_URL =
  "https://github.com/antoinepirard/linear-survey/releases";
const DISMISS_KEY = "linear-survey-update-dismissed";

function compareVersions(current: string, latest: string): number {
  const currentParts = current.split(".").map(Number);
  const latestParts = latest.split(".").map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const latestPart = latestParts[i] || 0;

    if (latestPart > currentPart) return 1;
    if (latestPart < currentPart) return -1;
  }

  return 0;
}

export function UpdateBanner() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(true); // Start hidden
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user already dismissed this version
    const dismissedVersion = localStorage.getItem(DISMISS_KEY);
    
    async function checkForUpdates() {
      try {
        const response = await fetch(GITHUB_RAW_URL, {
          cache: "no-store",
        });
        
        if (!response.ok) {
          setChecking(false);
          return;
        }

        const data = await response.json();
        const latest = data.version;

        if (latest && compareVersions(CURRENT_VERSION, latest) > 0) {
          setLatestVersion(latest);
          // Only show if not dismissed for this version
          if (dismissedVersion !== latest) {
            setDismissed(false);
          }
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      } finally {
        setChecking(false);
      }
    }

    checkForUpdates();
  }, []);

  function handleDismiss() {
    if (latestVersion) {
      localStorage.setItem(DISMISS_KEY, latestVersion);
    }
    setDismissed(true);
  }

  if (checking || dismissed || !latestVersion) {
    return null;
  }

  return (
    <div className="bg-accent text-white px-4 py-2 text-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>
            🎉 New version available:{" "}
            <span className="font-semibold">v{latestVersion}</span>
            <span className="text-white/80 ml-1">(current: v{CURRENT_VERSION})</span>
          </span>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-white/90"
          >
            View changes
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0 text-white hover:bg-white/20 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

