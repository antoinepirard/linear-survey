"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChapterSidebar } from "./ChapterSidebar";
import { ChapterContent } from "./ChapterContent";
import { SearchCommand } from "./SearchCommand";
import { manualConfig } from "../_content";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function ManualApp() {
  const [activeChapterId, setActiveChapterId] = useState(
    manualConfig.chapters[0].id
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeChapter = manualConfig.chapters.find(
    (c) => c.id === activeChapterId
  );

  const currentIndex = manualConfig.chapters.findIndex(
    (c) => c.id === activeChapterId
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < manualConfig.chapters.length - 1;

  const handleSelectChapter = useCallback((chapterId: string) => {
    setActiveChapterId(chapterId);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      handleSelectChapter(manualConfig.chapters[currentIndex - 1].id);
    }
  }, [currentIndex, handleSelectChapter]);

  const handleNext = useCallback(() => {
    if (currentIndex < manualConfig.chapters.length - 1) {
      handleSelectChapter(manualConfig.chapters[currentIndex + 1].id);
    }
  }, [currentIndex, handleSelectChapter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && !searchOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  if (!activeChapter) return null;

  return (
    <div className="h-[100dvh] bg-white overflow-hidden flex flex-col">
      {/* Mobile header */}
      <header className="shrink-0 lg:hidden bg-white border-b border-stone-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-stone-50 text-stone-500"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-medium text-stone-800">
              Antoine Pirard
            </h1>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-stone-50 text-stone-500"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main area with sidebar and content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <ChapterSidebar
          chapters={manualConfig.chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={handleSelectChapter}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Content column */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Scrollable content */}
          <main
            ref={contentRef}
            className="flex-1 overflow-y-auto"
          >
            <ChapterContent chapter={activeChapter} />
          </main>

          {/* Bottom navigation - inside content column so it doesn't overlap sidebar */}
          <nav className="shrink-0 bg-white border-t border-stone-100">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                transition-colors duration-100
                ${
                  hasPrevious
                    ? "text-stone-600 hover:bg-stone-50"
                    : "opacity-30 cursor-not-allowed text-stone-400"
                }
              `}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex gap-1">
              {manualConfig.chapters.map((_, i) => (
                <span
                  key={i}
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all
                    ${i === currentIndex ? "bg-[#0058A3]" : "bg-stone-200"}
                  `}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                transition-colors duration-100
                ${
                  hasNext
                    ? "bg-[#0058A3] text-white hover:bg-[#004C8C]"
                    : "opacity-30 cursor-not-allowed text-stone-400 bg-stone-100"
                }
              `}
            >
              Next
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
        </div>
      </div>

      {/* Search command dialog */}
      <SearchCommand
        chapters={manualConfig.chapters}
        onSelectChapter={handleSelectChapter}
        isOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </div>
  );
}
