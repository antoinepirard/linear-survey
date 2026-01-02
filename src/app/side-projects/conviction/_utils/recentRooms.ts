const STORAGE_KEY = "conviction-recent-rooms";
const MAX_ROOMS = 10;

export interface RecentRoom {
  roomId: string;
  topic: string;
  createdAt: number;
  role: "host" | "participant";
}

export function getRecentRooms(): RecentRoom[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const rooms: RecentRoom[] = JSON.parse(stored);
    // Sort by most recent first
    return rooms.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function addRecentRoom(room: RecentRoom): void {
  if (typeof window === "undefined") return;

  try {
    const rooms = getRecentRooms();

    // Remove existing entry for this room if it exists
    const filtered = rooms.filter((r) => r.roomId !== room.roomId);

    // Add new room at the beginning
    const updated = [room, ...filtered].slice(0, MAX_ROOMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be unavailable
  }
}

export function removeRecentRoom(roomId: string): void {
  if (typeof window === "undefined") return;

  try {
    const rooms = getRecentRooms();
    const filtered = rooms.filter((r) => r.roomId !== roomId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // localStorage might be unavailable
  }
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}
