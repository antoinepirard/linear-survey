'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LandingView } from './LandingView';
import { CreateVoteForm } from './CreateVoteForm';

type Phase = 'landing' | 'create';

export function ConvictionApp() {
  const [phase, setPhase] = useState<Phase>('landing');

  const handleCreateVote = useCallback(() => {
    setPhase('create');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setPhase('landing');
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LandingView onCreateVote={handleCreateVote} />
        </motion.div>
      )}

      {phase === 'create' && (
        <motion.div
          key="create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CreateVoteForm onBack={handleBackToLanding} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
