'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { LandingView } from './LandingView';
import { CreateVoteForm } from './CreateVoteForm';

export function ConvictionApp() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateVote = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowCreateDialog(false);
  }, []);

  return (
    <>
      <LandingView onCreateVote={handleCreateVote} />

      <AnimatePresence>
        {showCreateDialog && (
          <CreateVoteForm onClose={handleCloseDialog} />
        )}
      </AnimatePresence>
    </>
  );
}
