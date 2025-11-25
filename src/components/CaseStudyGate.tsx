"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const CORRECT_PASSWORD = "casestudies2025";
const NOTION_URL =
  "https://antoine-works.notion.site/2b4ac148c0f280e69441c2b86156ea76?v=2b4ac148c0f280fda5cf000cca477b80";
const STORAGE_KEY = "case-study-unlocked";

export default function CaseStudyGate() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY) === "true";
    setIsUnlocked(unlocked);
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      localStorage.setItem(STORAGE_KEY, "true");
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  // Don't render until we've checked localStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="mt-10 p-12 border rounded-lg bg-slate-50 border-slate-100">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-base text-slate-700 font-semibold text-center">
                Want to see in-depth case studies?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className={`flex-1 px-4 py-2.5 text-sm bg-white border rounded-lg outline-none transition-colors ${
                    showError
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-slate-300"
                  }`}
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <LockClosedIcon className="w-4 h-4" />
                  Unlock
                </button>
              </div>
              <AnimatePresence>
                {showError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-500"
                  >
                    Incorrect code. Try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-base text-slate-700 font-semibold text-center">
              In-depth case studies
            </p>
            <a
              href={NOTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              View on Notion
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
