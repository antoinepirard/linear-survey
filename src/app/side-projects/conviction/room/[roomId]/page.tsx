'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ConvictionRoomProvider } from '../../_components/RoomProvider';
import { RoomContent } from '../../_components/RoomContent';
import type { RoomConfig } from '../../liveblocks.config';
import type { CreateVoteConfig } from '../../_types';

interface StoredRoomData {
  config: CreateVoteConfig;
  hostName: string;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [initialConfig, setInitialConfig] = useState<RoomConfig | undefined>(undefined);
  const [hostName, setHostName] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we're the host (config stored in sessionStorage)
    const storedData = sessionStorage.getItem(`conviction-room-${roomId}`);

    if (storedData) {
      try {
        const parsed: StoredRoomData = JSON.parse(storedData);
        setInitialConfig({
          topic: parsed.config.topic,
          options: parsed.config.options,
          expectedVoters: parsed.config.expectedVoters,
          createdAt: Date.now(),
        });
        setHostName(parsed.hostName);
        // Clear sessionStorage after reading
        sessionStorage.removeItem(`conviction-room-${roomId}`);
      } catch {
        // Invalid data, ignore
      }
    }

    setIsReady(true);
  }, [roomId]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ConvictionRoomProvider roomId={roomId} initialConfig={initialConfig}>
      <RoomContent hostName={hostName} />
    </ConvictionRoomProvider>
  );
}
