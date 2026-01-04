"use client";

import { Chapter } from "../_types";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ChapterSidebarProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function ChapterSidebar({
  chapters,
  activeChapterId,
  onSelectChapter,
  isOpen,
  onClose,
  onOpenSearch,
}: ChapterSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-[100dvh] lg:h-auto lg:self-stretch w-60 lg:w-56
          bg-white lg:bg-stone-50/50
          border-r border-stone-100
          transform transition-transform duration-200 ease-out
          lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#0058A3] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-medium text-stone-700">
                Antoine Pirard
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-stone-100 text-stone-400"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Search trigger */}
          <button
            onClick={() => {
              onOpenSearch();
              onClose();
            }}
            className="flex items-center gap-2 px-2 py-2 mb-4 bg-stone-100 rounded-full text-left text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span className="text-sm flex-1">Search...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded-full bg-white px-1.5 font-mono text-[10px] text-stone-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* Chapter list */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-0.5">
              {chapters.map((chapter) => {
                const isActive = chapter.id === activeChapterId;
                return (
                  <li key={chapter.id}>
                    <button
                      onClick={() => {
                        onSelectChapter(chapter.id);
                        onClose();
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md
                        text-left transition-colors duration-100
                        ${
                          isActive
                            ? "bg-[#0058A3]/10 text-[#0058A3]"
                            : "text-stone-600 hover:bg-stone-100"
                        }
                      `}
                    >
                      <span
                        className={`
                          w-5 h-5 rounded flex items-center justify-center
                          text-xs font-medium shrink-0
                          ${
                            isActive
                              ? "bg-[#FFDA1A] text-stone-800"
                              : "bg-stone-200/60 text-stone-500"
                          }
                        `}
                      >
                        {chapter.number}
                      </span>
                      <span className="text-sm truncate">{chapter.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="pt-3 mt-3 border-t border-stone-100">
            <p className="text-[10px] text-stone-400 px-2">
              Last updated Jan 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
