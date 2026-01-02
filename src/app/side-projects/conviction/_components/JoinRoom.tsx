'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useUpdateMyPresence } from '../liveblocks.config';
import { addRecentRoom } from '../_utils/recentRooms';

interface JoinRoomProps {
  roomId: string;
  topic: string;
}

export function JoinRoom({ roomId, topic }: JoinRoomProps) {
  const [name, setName] = useState('');
  const updateMyPresence = useUpdateMyPresence();

  const handleJoin = useCallback(() => {
    if (name.trim()) {
      // Store in recent rooms for the landing page
      addRecentRoom({
        roomId,
        topic,
        createdAt: Date.now(),
        role: 'participant',
      });
      
      updateMyPresence({ name: name.trim() });
    }
  }, [name, roomId, topic, updateMyPresence]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && name.trim()) {
        handleJoin();
      }
    },
    [name, handleJoin]
  );

  const isValid = name.trim().length > 0;

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center justify-center bg-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center"
      >
        {/* Topic */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
        >
          You&apos;ve been invited to vote on
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-12"
        >
          {topic}
        </motion.h1>

        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <label className="block text-lg font-medium text-slate-900 mb-3">
            What&apos;s your name?
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            autoFocus
            className="w-full h-14 px-6 text-lg text-center rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
          />
        </motion.div>

        {/* Join button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <motion.button
            onClick={handleJoin}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02, y: -2 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`w-full h-14 text-lg font-bold rounded-full text-white shadow-lg transition-all ${
              isValid
                ? "cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{ backgroundColor: isValid ? "#FF6B5B" : "#94A3B8" }}
          >
            Join Vote
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
