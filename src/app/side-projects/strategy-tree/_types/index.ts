import type { Node, Edge } from '@xyflow/react';

// Status types for nodes
export type NodeStatus = 'not-started' | 'on-track' | 'at-risk' | 'blocked';

// Custom data for goal nodes
export interface GoalNodeData {
  title: string;
  description?: string;
  status: NodeStatus;
  isCollapsed?: boolean;
  level?: number; // Visual hierarchy level
}

// Typed node for our strategy tree
export type GoalNode = Node<GoalNodeData, 'goal'>;

// Edge with optional label
export interface StrategyEdgeData {
  label?: string;
}

export type StrategyEdge = Edge<StrategyEdgeData>;

// Serializable state for URL encoding
export interface SerializedState {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    data: GoalNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data?: StrategyEdgeData;
  }>;
}

// Status configuration
export const STATUS_CONFIG: Record<NodeStatus, { label: string; color: string; bgColor: string }> = {
  'not-started': {
    label: 'Not Started',
    color: 'text-slate-400',
    bgColor: 'bg-slate-400',
  },
  'on-track': {
    label: 'On Track',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
  },
  'at-risk': {
    label: 'At Risk',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
  },
  'blocked': {
    label: 'Blocked',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500',
  },
};

