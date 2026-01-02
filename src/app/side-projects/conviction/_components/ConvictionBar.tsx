'use client';

import { motion } from 'motion/react';
import { AggregatedResult } from '../_types';

interface ConvictionBarProps {
  result: AggregatedResult;
  rank?: number;
  animate?: boolean;
  delay?: number;
  isWinner?: boolean;
}

export function ConvictionBar({
  result,
  rank,
  animate = true,
  delay = 0,
  isWinner = false,
}: ConvictionBarProps) {
  // Color based on conviction level
  const getBarColor = () => {
    if (result.convictionLevel === 'high') return 'bg-orange-500';
    if (result.convictionLevel === 'medium') return 'bg-blue-500';
    return 'bg-slate-400';
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, type: 'spring', stiffness: 200 }}
      className={`rounded-2xl p-4 ${
        isWinner ? 'bg-orange-50 ring-2 ring-orange-200' : 'bg-slate-50'
      }`}
    >
      {/* Header with rank and option name */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {rank !== undefined && (
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                isWinner
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {rank}
            </span>
          )}
          <span className="text-lg font-semibold text-slate-900">
            {result.option}
          </span>
        </div>
        <span className="text-2xl font-bold tabular-nums text-slate-900">
          {result.averagePoints.toFixed(0)}
        </span>
      </div>

      {/* Big progress bar */}
      <div className="relative h-12 bg-slate-200 rounded-xl overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${getBarColor()} rounded-xl`}
          initial={animate ? { width: 0 } : { width: `${result.percentage}%` }}
          animate={{ width: `${result.percentage}%` }}
          transition={{
            delay: delay + 0.1,
            duration: 0.6,
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-end px-4">
          <span className="text-sm font-medium text-slate-500">
            {result.totalPoints} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
}
