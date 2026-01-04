"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Chapter } from "../_types";

interface ChapterContentProps {
  chapter: Chapter;
  totalChapters: number;
  onPrevious: () => void;
  onNext: () => void;
}

// Cover banner
function CoverBanner() {
  return (
    <div className="bg-[#0058A3] rounded-xl p-6 flex items-center justify-between">
      <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-none">
        MANUAL
      </h1>
      <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}

export function ChapterContent({
  chapter,
  totalChapters,
  onPrevious,
  onNext,
}: ChapterContentProps) {
  const hasPrevious = chapter.number > 1;
  const hasNext = chapter.number < totalChapters;
  const isFirstChapter = chapter.number === 1;

  return (
    <article className="flex-1 flex flex-col min-h-0">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10 lg:py-16">
          {/* Cover - only on first chapter */}
          {isFirstChapter && (
            <div className="mb-12">
              <CoverBanner />
            </div>
          )}

          {/* Markdown content */}
          <div className="prose prose-stone max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-semibold text-stone-900 mb-4 leading-tight tracking-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold text-stone-800 mt-10 mb-3 pb-2 border-b border-stone-100">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-medium text-stone-700 mt-6 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1.5 my-4 text-stone-600 text-[15px]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-1.5 my-4 text-stone-600 text-[15px] list-decimal list-inside">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-stone-400 mt-2.5 shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#FFDA1A] pl-4 my-6 text-stone-600 italic">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1 py-0.5 bg-stone-100 text-stone-700 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-stone-900 text-stone-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-stone-900 text-stone-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4">
                    {children}
                  </pre>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 rounded-lg border border-stone-200">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wide">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2.5 text-left border-b border-stone-200 font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2.5 text-stone-600 border-b border-stone-50">
                    {children}
                  </td>
                ),
                hr: () => <hr className="my-8 border-stone-100" />,
                strong: ({ children }) => (
                  <strong className="font-medium text-stone-800">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-[#0058A3] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                input: ({ checked }) => (
                  <span
                    className={`
                      inline-flex items-center justify-center w-4 h-4 rounded border mr-2
                      ${
                        checked
                          ? "bg-[#0058A3] border-[#0058A3] text-white"
                          : "border-stone-300 bg-white"
                      }
                    `}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                ),
              }}
            >
              {chapter.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Sticky navigation */}
      <div className="sticky bottom-0 bg-white border-t border-stone-100">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
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
              {Array.from({ length: totalChapters }, (_, i) => (
                <span
                  key={i}
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all
                    ${
                      i + 1 === chapter.number ? "bg-[#0058A3]" : "bg-stone-200"
                    }
                  `}
                />
              ))}
            </div>

            <button
              onClick={onNext}
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
      </div>
    </article>
  );
}
