"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chapter } from "../_types";

interface SearchResult {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  matchText: string;
  matchType: "title" | "heading" | "content";
}

interface SearchCommandProps {
  chapters: Chapter[];
  onSelectChapter: (chapterId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({
  chapters,
  onSelectChapter,
  isOpen,
  onOpenChange,
}: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search through chapters
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show all chapters when no query
      return chapters.map((chapter) => ({
        chapterId: chapter.id,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        matchText: chapter.title,
        matchType: "title" as const,
      }));
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    chapters.forEach((chapter) => {
      // Search in title
      if (chapter.title.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          chapterId: chapter.id,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          matchText: chapter.title,
          matchType: "title",
        });
        return;
      }

      // Search in content
      const lines = chapter.content.split("\n");
      for (const line of lines) {
        if (line.toLowerCase().includes(lowerQuery)) {
          // Extract heading if it's a heading line
          const isHeading = line.startsWith("#");
          const cleanLine = line.replace(/^#+\s*/, "").replace(/\*\*/g, "");
          
          if (cleanLine.trim()) {
            searchResults.push({
              chapterId: chapter.id,
              chapterNumber: chapter.number,
              chapterTitle: chapter.title,
              matchText: cleanLine.slice(0, 80) + (cleanLine.length > 80 ? "..." : ""),
              matchType: isHeading ? "heading" : "content",
            });
            break; // Only show first match per chapter
          }
        }
      }
    });

    return searchResults;
  }, [query, chapters]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => (i > 0 ? i - 1 : i));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelectChapter(results[selectedIndex].chapterId);
            onOpenChange(false);
          }
          break;
      }
    },
    [results, selectedIndex, onSelectChapter, onOpenChange]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 max-w-md overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search manual</DialogTitle>
        
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
          <MagnifyingGlassIcon className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search manual..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-stone-400"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-stone-200 bg-stone-50 px-1.5 font-mono text-[10px] text-stone-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-stone-500">
              No results found
            </div>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li key={`${result.chapterId}-${index}`}>
                  <button
                    onClick={() => {
                      onSelectChapter(result.chapterId);
                      onOpenChange(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors
                      ${index === selectedIndex ? "bg-stone-50" : ""}
                    `}
                  >
                    <span
                      className={`
                        w-5 h-5 rounded flex items-center justify-center text-xs font-medium shrink-0 mt-0.5
                        ${index === selectedIndex ? "bg-[#0058A3] text-white" : "bg-stone-100 text-stone-500"}
                      `}
                    >
                      {result.chapterNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">
                        {result.chapterTitle}
                      </p>
                      {result.matchType !== "title" && (
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          {result.matchText}
                        </p>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-stone-200 bg-white px-1.5 font-mono text-[10px] text-stone-400">
                        ↵
                      </kbd>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50">
          <p className="text-[10px] text-stone-400">
            <kbd className="font-mono">↑↓</kbd> to navigate · <kbd className="font-mono">↵</kbd> to select · <kbd className="font-mono">esc</kbd> to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Search trigger button for the sidebar
interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-stone-500 hover:bg-stone-100 transition-colors"
    >
      <MagnifyingGlassIcon className="w-4 h-4" />
      <span className="text-sm flex-1">Search...</span>
      <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-stone-200 bg-white px-1.5 font-mono text-[10px] text-stone-400">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}

