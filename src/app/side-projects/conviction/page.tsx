'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const ConvictionApp = dynamic(
  () =>
    import('./_components/ConvictionApp').then((mod) => ({
      default: mod.ConvictionApp,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function ConvictionVotingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50"
      >
        <Link
          href="/"
          className="inline-flex items-center text-slate-500 text-sm hover:text-slate-900 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </Link>
      </motion.div>

      <ConvictionApp />
    </div>
  );
}
