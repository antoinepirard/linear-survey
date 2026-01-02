import { createClient } from '@liveblocks/client';
import { createRoomContext, createLiveblocksContext } from '@liveblocks/react';
import type { LiveMap } from '@liveblocks/client';

// Room config stored in Liveblocks storage
export type RoomConfig = {
  topic: string;
  options: string[];
  expectedVoters: number;
  createdAt: number;
};

// Individual vote stored in the votes LiveMap
export type Vote = {
  name: string;
  allocations: number[];
  submittedAt: number;
};

// Liveblocks storage structure
type Storage = {
  config: RoomConfig;
  votes: LiveMap<string, Vote>;
};

// User presence
type Presence = {
  name: string | null;
};

// User metadata (empty for now)
type UserMeta = Record<string, never>;

// Room events (empty for now)
type RoomEvent = Record<string, never>;

// Thread metadata (not using threads)
type ThreadMetadata = Record<string, never>;

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useErrorListener,
  useStorage,
  useMutation,
  useStatus,
  useLostConnectionListener,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);

export const {
  LiveblocksProvider,
  useClient,
} = createLiveblocksContext(client);
