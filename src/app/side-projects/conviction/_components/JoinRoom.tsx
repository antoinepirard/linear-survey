'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
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

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center justify-center">
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
          className="text-slate-500 mb-2"
        >
          You&apos;ve been invited to vote on
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-12"
        >
          &ldquo;{topic}&rdquo;
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
            className="w-full h-16 px-6 text-xl text-center rounded-2xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
          />
        </motion.div>

        {/* Join button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={handleJoin}
            disabled={!name.trim()}
            className="w-full h-16 text-xl rounded-2xl"
          >
            Join Vote
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
