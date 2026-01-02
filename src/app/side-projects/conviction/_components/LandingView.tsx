'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface LandingViewProps {
  onCreateVote: () => void;
}

export function LandingView({ onCreateVote }: LandingViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
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

        {/* Visual demo of the concept */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-12 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 bg-orange-500 rounded-xl flex-[60]" />
            <span className="text-2xl font-bold text-slate-900 w-12">60</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 bg-blue-500 rounded-xl flex-[30]" />
            <span className="text-2xl font-bold text-slate-900 w-12">30</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 bg-slate-300 rounded-xl flex-[10]" />
            <span className="text-2xl font-bold text-slate-900 w-12">10</span>
          </div>
        </motion.div>

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
      </motion.div>
    </div>
  );
}
