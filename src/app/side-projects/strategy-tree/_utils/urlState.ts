import type { SerializedState, StrategyNode, StrategyEdge, NodeStatus, StrategyNodeData } from '../_types';

// Map old status values to new ones for backward compatibility
function migrateStatus(status: string): NodeStatus {
  // 'on-track' was renamed to 'in-progress'
  if (status === 'on-track') {
    return 'in-progress';
  }
  // Validate it's a valid status
  const validStatuses: NodeStatus[] = ['not-started', 'in-progress', 'at-risk', 'blocked', 'done'];
  if (validStatuses.includes(status as NodeStatus)) {
    return status as NodeStatus;
  }
  // Default to not-started if invalid
  return 'not-started';
}

// Migrate old timeline format to new period format
function migrateNodeData(data: StrategyNodeData): StrategyNodeData {
  const migratedData = { ...data };
  
  // Migrate status
  migratedData.status = migrateStatus(data.status);
  
  // Migrate timeline to period if period doesn't exist but timeline does
  if (migratedData.metrics?.timeline?.enabled && migratedData.metrics.timeline.dueDate && !migratedData.metrics.period) {
    const dueDate = new Date(migratedData.metrics.timeline.dueDate);
    const year = dueDate.getFullYear();
    const quarter = Math.ceil((dueDate.getMonth() + 1) / 3);
    
    migratedData.metrics = {
      ...migratedData.metrics,
      period: {
        type: 'quarter',
        year,
        value: `Q${quarter}`,
      },
    };
  }
  
  // Remove 'unit' from progress if it exists (simplified model)
  if (migratedData.metrics?.progress && 'unit' in migratedData.metrics.progress) {
    const { current, target, enabled } = migratedData.metrics.progress;
    migratedData.metrics.progress = { enabled, current, target };
  }
  
  return migratedData;
}

// Compress and encode state to URL-safe string
export function encodeState(nodes: StrategyNode[], edges: StrategyEdge[]): string {
  const state: SerializedState = {
    nodes: nodes.map((n) => ({
      id: n.id,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      data: e.data,
    })),
  };

  try {
    const json = JSON.stringify(state);
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch {
    console.error('Failed to encode state');
    return '';
  }
}

// Decode state from URL-safe string
export function decodeState(encoded: string): SerializedState | null {
  if (!encoded) return null;

  try {
    const json = decodeURIComponent(atob(encoded));
    const state = JSON.parse(json) as SerializedState;
    
    if (!state.nodes || !state.edges) {
      return null;
    }
    
    return state;
  } catch {
    console.error('Failed to decode state');
    return null;
  }
}

// Convert serialized state back to React Flow format
export function deserializeToFlow(state: SerializedState): {
  nodes: StrategyNode[];
  edges: StrategyEdge[];
} {
  const nodes: StrategyNode[] = state.nodes.map((n) => ({
    id: n.id,
    type: 'strategy',
    position: n.position,
    // Migrate data to new format
    data: migrateNodeData(n.data),
  }));

  const edges: StrategyEdge[] = state.edges.map((e) => {
    // Determine edge type from id prefix or default to button
    const isDependency = e.id.startsWith('dep-');
    
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      // Set appropriate type and handles based on edge type
      type: isDependency ? 'dependency' : 'button',
      // Ensure proper handle IDs for hierarchy edges (top/bottom)
      sourceHandle: isDependency ? 'right' : 'bottom',
      targetHandle: isDependency ? 'left' : 'top',
      data: e.data,
    };
  });

  return { nodes, edges };
}

// Get state from URL hash
export function getStateFromUrl(): SerializedState | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  
  const params = new URLSearchParams(hash);
  const stateParam = params.get('s');
  
  if (!stateParam) return null;
  
  return decodeState(stateParam);
}

// Update URL with state (without page reload)
export function updateUrlWithState(nodes: StrategyNode[], edges: StrategyEdge[]): void {
  if (typeof window === 'undefined') return;
  
  const encoded = encodeState(nodes, edges);
  if (!encoded) return;
  
  const newHash = `#s=${encoded}`;
  window.history.replaceState(null, '', newHash);
}

// Generate shareable URL
export function getShareableUrl(nodes: StrategyNode[], edges: StrategyEdge[]): string {
  if (typeof window === 'undefined') return '';
  
  const encoded = encodeState(nodes, edges);
  const baseUrl = window.location.origin + window.location.pathname;
  
  return `${baseUrl}#s=${encoded}`;
}

// Copy URL to clipboard
export async function copyShareableUrl(nodes: StrategyNode[], edges: StrategyEdge[]): Promise<boolean> {
  const url = getShareableUrl(nodes, edges);
  
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    console.error('Failed to copy to clipboard');
    return false;
  }
}
