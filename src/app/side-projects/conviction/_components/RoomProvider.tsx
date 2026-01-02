'use client';

import { ReactNode } from 'react';
import { LiveMap } from '@liveblocks/client';
import { RoomProvider as LiveblocksRoomProvider } from '../liveblocks.config';
import type { RoomConfig, Vote } from '../liveblocks.config';

interface ConvictionRoomProviderProps {
  roomId: string;
  initialConfig?: RoomConfig;
  children: ReactNode;
}

export function ConvictionRoomProvider({
  roomId,
  initialConfig,
  children,
}: ConvictionRoomProviderProps) {
  return (
    <LiveblocksRoomProvider
      id={roomId}
      initialPresence={{ name: null }}
      initialStorage={
        initialConfig
          ? {
              config: initialConfig,
              votes: new LiveMap<string, Vote>(),
            }
          : {
              // Default empty storage for joining users
              // The room creator will set the actual config
              config: {
                topic: '',
                options: [],
                expectedVoters: 0,
                createdAt: 0,
              },
              votes: new LiveMap<string, Vote>(),
            }
      }
    >
      {children}
    </LiveblocksRoomProvider>
  );
}
