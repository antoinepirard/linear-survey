"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const CORRECT_PASSWORD = "casestudies2025";
const NOTION_URL =
  "https://antoine-works.notion.site/2b4ac148c0f280e69441c2b86156ea76?v=2b4ac148c0f280fda5cf000cca477b80";
const STORAGE_KEY = "case-study-unlocked";

export default function CaseStudyGate() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY) === "true";
    setIsUnlocked(unlocked);
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

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
    <div className="mt-10 rounded-2xl bg-slate-50 overflow-hidden">
      {/* Outer container - title */}
      <div className="px-6 py-3 text-center">
        <p className="text-sm text-slate-600 font-medium">
          {isUnlocked
            ? "In-depth case studies"
            : "Want to see in-depth case studies?"}
        </p>
      </div>

      {/* Inner white container - actions */}
      <div className="bg-white rounded-2xl mx-px mb-px py-6 px-6 ring-1 ring-slate-100/70 shadow-2xl/25">
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
                className="flex flex-col items-center gap-3"
              >
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access code"
                    className={`flex-1 px-4 py-2.5 text-sm rounded-lg outline-none transition-colors ${
                      showError ? "bg-red-50" : "bg-slate-50"
                    }`}
                    animate={
                      showError
                        ? { x: [0, -3, 3, -3, 3, -1.5, 1.5, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.4 }}
                  />
                  <motion.button
                    type="submit"
                    animate={{ scale: isPressed ? 0.95 : 1 }}
                    transition={{ duration: 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <LockClosedIcon className="w-4 h-4" />
                    Unlock
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <a
                href={NOTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Image
                  src="/Assets/Logos/notion-logo.svg"
                  alt="Notion"
                  width={16}
                  height={16}
                />
                View on Notion
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
