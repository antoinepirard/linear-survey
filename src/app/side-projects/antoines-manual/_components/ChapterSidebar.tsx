"use client";

import { Chapter } from "../_types";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChapterSidebarProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChapterSidebar({
  chapters,
  activeChapterId,
  onSelectChapter,
  isOpen,
  onClose,
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
          h-screen w-60 lg:w-56
          bg-white lg:bg-stone-50/50
          border-r border-stone-100
          transform transition-transform duration-200 ease-out
          lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#0058A3] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-medium text-stone-700">
                Manual
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-stone-100 text-stone-400"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

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
                      <span className="text-sm truncate">
                        {chapter.title}
                      </span>
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
