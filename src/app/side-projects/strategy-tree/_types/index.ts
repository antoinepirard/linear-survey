import type { Node, Edge } from '@xyflow/react';

// Node types for the strategy hierarchy
export type StrategyNodeType = 'company-goal' | 'strategy' | 'initiative' | 'task';

// Status types for nodes
export type NodeStatus = 'not-started' | 'on-track' | 'at-risk' | 'blocked';

// Metrics that can be attached to nodes
export interface NodeMetrics {
  // Progress tracking
  progress?: {
    enabled: boolean;
    current: number;
    target: number;
    unit?: string; // e.g., "%", "users", "$"
  };
  // Timeline
  timeline?: {
    enabled: boolean;
    startDate?: string; // ISO date string
    dueDate?: string;
  };
  // Owner
  owner?: {
    enabled: boolean;
    name?: string;
  };
}

// Custom data for strategy nodes
export interface StrategyNodeData {
  title: string;
  description?: string;
  nodeType: StrategyNodeType;
  status: NodeStatus;
  metrics?: NodeMetrics;
  isCollapsed?: boolean;
}

// Typed node for our strategy tree
export type StrategyNode = Node<StrategyNodeData, 'strategy'>;

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
    data: StrategyNodeData;
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

// Node type configuration
export const NODE_TYPE_CONFIG: Record<StrategyNodeType, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}> = {
  'company-goal': {
    label: 'Company Goal',
    description: 'High-level business objective',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-500',
  },
  'strategy': {
    label: 'Strategy',
    description: 'How to achieve the goal',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
  'initiative': {
    label: 'Initiative',
    description: 'Projects and efforts',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconColor: 'text-teal-500',
  },
  'task': {
    label: 'Task',
    description: 'Specific work items',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    iconColor: 'text-slate-500',
  },
};

// Helper to calculate progress percentage
export function calculateProgress(metrics?: NodeMetrics): number | null {
  if (!metrics?.progress?.enabled || metrics.progress.target === 0) {
    return null;
  }
  return Math.round((metrics.progress.current / metrics.progress.target) * 100);
}

// Helper to format date for display
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
