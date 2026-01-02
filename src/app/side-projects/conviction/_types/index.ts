// Room phase for the multiplayer flow
export type RoomPhase = 'join' | 'voting' | 'waiting' | 'results';

// Config for creating a new vote room (before room is created)
export interface CreateVoteConfig {
  topic: string;
  options: string[];
  expectedVoters: number;
}

// Aggregated results for display
export interface AggregatedResult {
  option: string;
  totalPoints: number;
  averagePoints: number;
  percentage: number;
  convictionLevel: 'low' | 'medium' | 'high';
}
