'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStorage, useSelf, useUpdateMyPresence } from '../liveblocks.config';
import { JoinRoom } from './JoinRoom';
import { VotingPhase } from './VotingPhase';
import { WaitingRoom } from './WaitingRoom';
import { ResultsView } from './ResultsView';
import { RoomPhase } from '../_types';
import { motion } from 'motion/react';

interface RoomContentProps {
  roomId: string;
  hostName: string | null;
}

export function RoomContent({ roomId, hostName }: RoomContentProps) {
  const config = useStorage((root) => root.config);
  const votes = useStorage((root) => root.votes);
  const self = useSelf();
  const updateMyPresence = useUpdateMyPresence();
  const [hostNameSet, setHostNameSet] = useState(false);

  // Auto-set host name if provided
  useEffect(() => {
    if (hostName && !hostNameSet) {
      updateMyPresence({ name: hostName });
      setHostNameSet(true);
    }
  }, [hostName, hostNameSet, updateMyPresence]);

  // The effective name - either from presence or from hostName prop (before presence syncs)
  const effectiveName = self?.presence?.name || (hostName && hostNameSet ? hostName : null);

  // Derive the current phase based on state
  const phase = useMemo<RoomPhase>(() => {
    // If user hasn't entered their name yet, show join screen
    if (!effectiveName) {
      return 'join';
    }

    // If votes have reached expected count, show results
    if (votes && config && votes.size >= config.expectedVoters) {
      return 'results';
    }

    // If user has already voted, show waiting room
    if (votes && self?.connectionId && votes.has(String(self.connectionId))) {
      return 'waiting';
    }

    // Otherwise, show voting
    return 'voting';
  }, [effectiveName, self?.connectionId, votes, config]);

  // Loading state
  if (!config || votes === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading room...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {phase === 'join' && <JoinRoom roomId={roomId} topic={config.topic} />}
      {phase === 'voting' && (
        <VotingPhase config={config} userId={String(self?.connectionId)} />
      )}
      {phase === 'waiting' && <WaitingRoom config={config} votes={votes} />}
      {phase === 'results' && <ResultsView config={config} votes={votes} />}
    </div>
  );
}
