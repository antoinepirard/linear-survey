'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ConvictionBar } from './ConvictionBar';
import { aggregateVotes } from '../_utils/calculations';
import type { RoomConfig, Vote } from '../liveblocks.config';

interface ResultsViewProps {
  config: RoomConfig;
  votes: ReadonlyMap<string, Vote>;
}

export function ResultsView({ config, votes }: ResultsViewProps) {
  const votesList = useMemo(() => {
    const list: Vote[] = [];
    votes.forEach((vote) => list.push(vote));
    return list;
  }, [votes]);

  const voterNames = useMemo(() => {
    return votesList.map((v) => v.name);
  }, [votesList]);

  const results = useMemo(
    () => aggregateVotes(votesList, config.options),
    [votesList, config.options]
  );

  const winner = results[0];

  const handleNewVote = () => {
    window.location.href = '/side-projects/conviction';
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-amber-50">
      <div className="max-w-lg mx-auto pt-8">
        {/* Winner announcement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center mb-12"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
          >
            The winner is
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
          >
            {winner?.option}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 text-lg"
          >
            <span className="text-slate-600">
              <span className="font-bold text-slate-900 text-2xl">
                {winner?.averagePoints.toFixed(0)}
              </span>
              <span className="text-sm ml-1">avg</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              <span className="font-bold text-slate-900 text-2xl">
                {winner?.totalPoints}
              </span>
              <span className="text-sm ml-1">total</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Topic and voters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-slate-500 mb-3">
            {config.topic}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {voterNames.map((name, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* All Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-12"
        >
          {results.map((result, index) => (
            <ConvictionBar
              key={result.option}
              result={result}
              rank={index + 1}
              delay={0.5 + index * 0.1}
              isWinner={index === 0}
            />
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleNewVote}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 text-lg font-bold rounded-full text-white shadow-lg transition-all"
            style={{ backgroundColor: '#FF6B5B' }}
          >
            Start a new vote
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
