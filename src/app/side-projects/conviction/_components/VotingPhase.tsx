"use client";

import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import { TwoOptionSlider } from "./TwoOptionSlider";
import { RadarVote } from "./RadarVote";
import { useMutation } from "../liveblocks.config";
import type { RoomConfig } from "../liveblocks.config";

interface VotingPhaseProps {
  config: RoomConfig;
  userId: string;
  userName: string;
}

// Normalize values to sum to 100
function normalizeToHundred(values: number[]): number[] {
  const sum = values.reduce((acc, v) => acc + v, 0);
  const normalized =
    sum === 0
      ? values.map(() => 100 / values.length) // Equal distribution if all zeros
      : values.map((v) => (v / sum) * 100);

  // Round and adjust to ensure sum is exactly 100
  const rounded = normalized.map((v) => Math.round(v));
  const diff = 100 - rounded.reduce((acc, v) => acc + v, 0);
  if (diff !== 0) {
    // Add/subtract diff from largest value (or first if equal)
    const maxIndex = rounded.indexOf(Math.max(...rounded));
    rounded[maxIndex] += diff;
  }
  return rounded;
}

export function VotingPhase({ config, userId, userName }: VotingPhaseProps) {
  const valuesRef = useRef<number[]>(config.options.map(() => 50));

  const submitVote = useMutation(
    ({ storage }, allocations: number[], name: string) => {
      const votes = storage.get("votes");
      votes.set(userId, {
        name,
        allocations,
        submittedAt: Date.now(),
      });
    },
    [userId]
  );

  const handleTwoOptionChange = useCallback((values: [number, number]) => {
    valuesRef.current = values;
  }, []);

  const handleRadarChange = useCallback((values: number[]) => {
    // Convert 0-1 values to 0-100
    valuesRef.current = values.map((v) => v * 100);
  }, []);

  const handleSubmit = useCallback(() => {
    const normalized = normalizeToHundred(valuesRef.current);
    submitVote(normalized, userName);
  }, [submitVote, userName]);

  const isTwoOptions = config.options.length === 2;

  return (
    <div className="min-h-screen px-6 py-8 pb-32 bg-amber-50">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 pt-8"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Your vote
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {config.topic}
          </h2>
        </motion.div>

        {/* Voting UI */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          {isTwoOptions ? (
            <TwoOptionSlider
              options={config.options as [string, string]}
              onValueChange={handleTwoOptionChange}
            />
          ) : (
            <RadarVote
              options={config.options}
              onValuesChange={handleRadarChange}
            />
          )}
        </motion.div>

        {/* Fixed Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-amber-50 via-amber-50/95 to-transparent"
        >
          <div className="max-w-lg mx-auto">
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 text-lg font-bold rounded-full text-white shadow-lg transition-all"
              style={{ backgroundColor: '#FF6B5B' }}
            >
              Submit Vote
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
