"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-lg w-full text-center"
      >
        {/* Big bold title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight"
        >
          Conviction
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xl text-slate-500 mb-12"
        >
          Vote with your heart. Distribute 100 points across options.
        </motion.p>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button
            onClick={onCreateVote}
            size="lg"
            className="h-16 px-12 text-lg rounded-2xl"
          >
            Create a Vote
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 text-sm text-slate-400"
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
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm font-medium text-slate-400">
                Recent Rooms
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

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
                      className="block p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between gap-3 pr-8">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            &ldquo;{room.topic}&rdquo;
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                room.role === "host"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-200 text-slate-600"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all"
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
