import type { Node, Edge } from '@xyflow/react';

// Node types for the strategy hierarchy
export type StrategyNodeType = 'company-goal' | 'strategy' | 'initiative' | 'task';

// Status types for nodes (updated with in-progress and done)
export type NodeStatus = 'not-started' | 'in-progress' | 'at-risk' | 'blocked' | 'done';

// Period types for timeline
export type PeriodType = 'quarter' | 'half' | 'month' | 'date';

// Period/Timeline model
export interface NodePeriod {
  type: PeriodType;
  year: number;
  value: string; // "Q1", "Q2", "H1", "H2", "Jan", "Feb", etc., or ISO date for 'date' type
}

// Metrics that can be attached to nodes
export interface NodeMetrics {
  // Progress tracking (optional, shown when status is 'in-progress')
  progress?: {
    enabled: boolean;
    current: number;
    target: number;
  };
  // Period/Timeline (required for all nodes)
  period?: NodePeriod;
  // Legacy timeline support (for backward compatibility)
  timeline?: {
    enabled: boolean;
    startDate?: string;
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
  // Index signature for React Flow compatibility
  [key: string]: unknown;
}

// Typed node for our strategy tree
export type StrategyNode = Node<StrategyNodeData, 'strategy'>;

// Edge with optional label
export interface StrategyEdgeData {
  label?: string;
  // Index signature for React Flow compatibility
  [key: string]: unknown;
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

// Status configuration with icons
export const STATUS_CONFIG: Record<NodeStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  lightBg: string;
}> = {
  'not-started': {
    label: 'Not Started',
    color: 'text-slate-500',
    bgColor: 'bg-slate-400',
    borderColor: 'border-slate-300',
    lightBg: 'bg-slate-50',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-300',
    lightBg: 'bg-blue-50',
  },
  'at-risk': {
    label: 'At Risk',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-300',
    lightBg: 'bg-amber-50',
  },
  'blocked': {
    label: 'Blocked',
    color: 'text-rose-600',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-300',
    lightBg: 'bg-rose-50',
  },
  'done': {
    label: 'Done',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-300',
    lightBg: 'bg-emerald-50',
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

// Period type configuration
export const PERIOD_TYPE_CONFIG: Record<PeriodType, {
  label: string;
  options: string[];
}> = {
  'quarter': {
    label: 'Quarter',
    options: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
  'half': {
    label: 'Half',
    options: ['H1', 'H2'],
  },
  'month': {
    label: 'Month',
    options: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  'date': {
    label: 'Specific Date',
    options: [],
  },
};

// Helper to calculate progress percentage
export function calculateProgress(metrics?: NodeMetrics): number | null {
  if (!metrics?.progress?.enabled || metrics.progress.target === 0) {
    return null;
  }
  return Math.round((metrics.progress.current / metrics.progress.target) * 100);
}

// Helper to format period for display
export function formatPeriod(period?: NodePeriod): string {
  if (!period) return '';
  
  if (period.type === 'date') {
    const date = new Date(period.value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  return `${period.value} ${period.year}`;
}

// Helper to format date for display (legacy support)
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper to get current year
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Helper to get default period (current quarter)
export function getDefaultPeriod(): NodePeriod {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return {
    type: 'quarter',
    year: now.getFullYear(),
    value: `Q${quarter}`,
  };
}
