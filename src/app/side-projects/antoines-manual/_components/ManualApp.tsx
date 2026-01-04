"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChapterSidebar } from "./ChapterSidebar";
import { ChapterContent } from "./ChapterContent";
import { manualConfig } from "../_content";
import { Bars3Icon } from "@heroicons/react/24/outline";

export function ManualApp() {
  const [activeChapterId, setActiveChapterId] = useState(
    manualConfig.chapters[0].id
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeChapter = manualConfig.chapters.find(
    (c) => c.id === activeChapterId
  );

  const handleSelectChapter = useCallback((chapterId: string) => {
    setActiveChapterId(chapterId);
    // Scroll content area to top
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePrevious = useCallback(() => {
    const currentIndex = manualConfig.chapters.findIndex(
      (c) => c.id === activeChapterId
    );
    if (currentIndex > 0) {
      handleSelectChapter(manualConfig.chapters[currentIndex - 1].id);
    }
  }, [activeChapterId, handleSelectChapter]);

  const handleNext = useCallback(() => {
    const currentIndex = manualConfig.chapters.findIndex(
      (c) => c.id === activeChapterId
    );
    if (currentIndex < manualConfig.chapters.length - 1) {
      handleSelectChapter(manualConfig.chapters[currentIndex + 1].id);
    }
  }, [activeChapterId, handleSelectChapter]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  if (!activeChapter) return null;

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex h-full">
        {/* Mobile header */}
        <header className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-sm border-b border-stone-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-stone-50 text-stone-500"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h1 className="text-sm font-medium text-stone-800">
                {manualConfig.title}
              </h1>
            </div>
            <div className="w-9" />
          </div>
        </header>

        {/* Sidebar - fixed */}
        <ChapterSidebar
          chapters={manualConfig.chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={handleSelectChapter}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area - scrollable */}
        <main 
          ref={contentRef}
          className="flex-1 pt-14 lg:pt-0 overflow-y-auto flex flex-col"
        >
          <ChapterContent
            chapter={activeChapter}
            totalChapters={manualConfig.chapters.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </main>
      </div>
    </div>
  );
}
