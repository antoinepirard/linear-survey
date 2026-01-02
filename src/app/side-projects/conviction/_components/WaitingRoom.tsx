'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { RoomConfig, Vote } from '../liveblocks.config';

interface WaitingRoomProps {
  config: RoomConfig;
  votes: ReadonlyMap<string, Vote>;
}

export function WaitingRoom({ config, votes }: WaitingRoomProps) {
  const voterNames = useMemo(() => {
    const names: string[] = [];
    votes.forEach((vote) => {
      names.push(vote.name);
    });
    return names;
  }, [votes]);

  const votesRemaining = config.expectedVoters - votes.size;

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center"
      >
        {/* Waiting animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full"
            />
          </div>
        </div>

        {/* Status */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-slate-900 mb-4"
        >
          Vote submitted!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-500 mb-8"
        >
          Waiting for {votesRemaining} more vote{votesRemaining !== 1 ? 's' : ''}...
        </motion.p>

        {/* Who has voted */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-50 rounded-2xl p-6"
        >
          <p className="text-sm font-medium text-slate-500 mb-4">
            {votes.size} of {config.expectedVoters} have voted
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {voterNames.map((name, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {name}
              </motion.div>
            ))}

            {/* Placeholder dots for remaining voters */}
            {Array.from({ length: votesRemaining }).map((_, index) => (
              <motion.div
                key={`pending-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5 + voterNames.length * 0.1 + index * 0.1,
                  type: 'spring',
                }}
                className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"
              >
                <span className="text-slate-400">?</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Topic reminder */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-slate-400"
        >
          Voting on: &ldquo;{config.topic}&rdquo;
        </motion.p>
      </motion.div>
    </div>
  );
}
