import { AggregatedResult } from '../_types';
import type { Vote } from '../liveblocks.config';

export function aggregateVotes(
  votes: Vote[],
  options: string[]
): AggregatedResult[] {
  if (votes.length === 0) {
    return options.map((option) => ({
      option,
      totalPoints: 0,
      averagePoints: 0,
      percentage: 0,
      convictionLevel: 'low' as const,
    }));
  }

  const results = options.map((option, index) => {
    const totalPoints = votes.reduce(
      (sum, vote) => sum + (vote.allocations[index] || 0),
      0
    );
    const averagePoints = totalPoints / votes.length;
    // Fixed scale: average out of 100 (not relative to other options)
    const percentage = averagePoints;

    return {
      option,
      totalPoints,
      averagePoints,
      percentage,
      convictionLevel: getConvictionLevel(averagePoints),
    };
  });

  // Sort by total points descending
  return results.sort((a, b) => b.totalPoints - a.totalPoints);
}

export function getConvictionLevel(
  averagePoints: number
): 'low' | 'medium' | 'high' {
  if (averagePoints >= 50) return 'high';
  if (averagePoints >= 25) return 'medium';
  return 'low';
}

export function getConvictionColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-blue-500';
    case 'low':
      return 'bg-slate-400';
  }
}

export function getConvictionTextColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-blue-500';
    case 'low':
      return 'text-slate-400';
  }
}

export function validateAllocations(allocations: number[]): boolean {
  const sum = allocations.reduce((a, b) => a + b, 0);
  return sum === 100 && allocations.every((a) => a >= 0 && a <= 100);
}

export function getRemainingPoints(allocations: number[]): number {
  return 100 - allocations.reduce((a, b) => a + b, 0);
}

export function generateRoomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}
