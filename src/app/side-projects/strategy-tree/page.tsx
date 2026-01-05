'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const StrategyTreeApp = dynamic(
  () =>
    import('./_components/StrategyTreeApp').then((mod) => ({
      default: mod.StrategyTreeApp,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div className="w-5 h-5 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
);

export default function StrategyTreePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 left-4 z-50"
      >
        <Link
          href="/side-projects"
          className="inline-flex items-center text-white/60 text-sm hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </Link>
      </motion.div>

      <StrategyTreeApp />
    </div>
  );
}

