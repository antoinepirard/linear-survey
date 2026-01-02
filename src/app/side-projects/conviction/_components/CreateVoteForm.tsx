'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { generateRoomId } from '../_utils/calculations';
import { CreateVoteConfig } from '../_types';

interface CreateVoteFormProps {
  onBack: () => void;
}

export function CreateVoteForm({ onBack }: CreateVoteFormProps) {
  const [topic, setTopic] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [expectedVoters, setExpectedVoters] = useState(2);
  const [hostName, setHostName] = useState('');

  const addOption = useCallback(() => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  }, [options]);

  const removeOption = useCallback(
    (index: number) => {
      if (options.length > 2) {
        setOptions(options.filter((_, i) => i !== index));
      }
    },
    [options]
  );

  const updateOption = useCallback(
    (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    },
    [options]
  );

  const isValid =
    topic.trim() !== '' &&
    options.every((o) => o.trim() !== '') &&
    hostName.trim() !== '';

  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    const config: CreateVoteConfig = {
      topic: topic.trim(),
      options: options.map((o) => o.trim()),
      expectedVoters,
    };

    // Generate room ID and store config in URL params
    const roomId = generateRoomId();

    // Store config in sessionStorage so the room page can initialize with it
    sessionStorage.setItem(
      `conviction-room-${roomId}`,
      JSON.stringify({
        config,
        hostName: hostName.trim(),
      })
    );

    // Redirect to room
    window.location.href = `/side-projects/conviction/room/${roomId}`;
  }, [isValid, topic, options, expectedVoters, hostName]);

  return (
    <div className="min-h-screen px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg mx-auto pt-8"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8">Set it up</h2>

        <div className="space-y-8">
          {/* Your Name */}
          <div>
            <label className="block text-lg font-medium text-slate-900 mb-3">
              Your name
            </label>
            <input
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-lg font-medium text-slate-900 mb-3">
              What are you deciding?
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Where should we eat?"
              className="w-full h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-lg font-medium text-slate-900 mb-3">
              Options
            </label>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-2"
                  >
                    <input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors"
                    />
                    {options.length > 2 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeOption(index)}
                        className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5 text-slate-500" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {options.length < 6 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addOption}
                className="mt-3 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add option
              </motion.button>
            )}
          </div>

          {/* Expected Voters */}
          <div>
            <label className="block text-lg font-medium text-slate-900 mb-3">
              How many people are voting?
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpectedVoters(num)}
                  className={`w-14 h-14 rounded-xl text-xl font-bold transition-all ${
                    expectedVoters === num
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Create Room Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full h-16 text-lg rounded-2xl"
            >
              Create Room
            </Button>
            <p className="mt-3 text-center text-sm text-slate-500">
              You&apos;ll get a link to share with your friends
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
