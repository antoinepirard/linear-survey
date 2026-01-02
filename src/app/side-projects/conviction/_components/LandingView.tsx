"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  getRecentRooms,
  removeRecentRoom,
  formatRelativeTime,
  RecentRoom,
} from "../_utils/recentRooms";

interface LandingViewProps {
  onCreateVote: () => void;
}

export function LandingView({ onCreateVote }: LandingViewProps) {
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  useEffect(() => {
    setRecentRooms(getRecentRooms());
  }, []);

  const handleRemoveRoom = useCallback((roomId: string) => {
    removeRecentRoom(roomId);
    setRecentRooms(getRecentRooms());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-lg w-full text-center"
      >
        {/* Bold title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.4,
            type: "spring",
            bounce: 0.4,
          }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 uppercase">
            Conviction
          </h1>
          <div
            className="h-2 w-32 bg-coral-500 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: "#FF6B5B" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-lg text-slate-600 mb-12 max-w-sm mx-auto"
        >
          Vote with conviction. Distribute{" "}
          <span className="font-bold text-slate-900">100 points</span> across
          your options.
        </motion.p>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <motion.button
            onClick={onCreateVote}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="h-16 px-12 text-lg font-bold rounded-full text-white shadow-lg transition-all"
            style={{ backgroundColor: "#FF6B5B" }}
          >
            Create a Vote
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 text-sm text-slate-500"
        >
          Share a link with friends to vote together
        </motion.p>

        {/* Recent Rooms */}
        {recentRooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-16"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Recent Rooms
            </p>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {recentRooms.map((room) => (
                  <motion.div
                    key={room.roomId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative"
                  >
                    <Link
                      href={`/side-projects/conviction/room/${room.roomId}`}
                      className="block p-4 rounded-xl bg-white border-2 border-slate-100 hover:border-slate-900 transition-all text-left"
                    >
                      <div className="flex items-start justify-between gap-3 pr-8">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {room.topic}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                room.role === "host"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {room.role === "host" ? "Host" : "Joined"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatRelativeTime(room.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveRoom(room.roomId);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Remove from recent"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
