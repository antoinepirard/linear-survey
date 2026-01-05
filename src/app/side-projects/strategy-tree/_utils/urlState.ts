import type { SerializedState, GoalNode, StrategyEdge } from '../_types';

// Compress and encode state to URL-safe string
export function encodeState(nodes: GoalNode[], edges: StrategyEdge[]): string {
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
    // Use base64 encoding (works in browser)
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
    
    // Basic validation
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
  nodes: GoalNode[];
  edges: StrategyEdge[];
} {
  const nodes: GoalNode[] = state.nodes.map((n) => ({
    id: n.id,
    type: 'goal',
    position: n.position,
    data: n.data,
  }));

  const edges: StrategyEdge[] = state.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'button',
    data: e.data,
  }));

  return { nodes, edges };
}

// Get state from URL hash
export function getStateFromUrl(): SerializedState | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) return null;
  
  const params = new URLSearchParams(hash);
  const stateParam = params.get('s');
  
  if (!stateParam) return null;
  
  return decodeState(stateParam);
}

// Update URL with state (without page reload)
export function updateUrlWithState(nodes: GoalNode[], edges: StrategyEdge[]): void {
  if (typeof window === 'undefined') return;
  
  const encoded = encodeState(nodes, edges);
  if (!encoded) return;
  
  const newHash = `#s=${encoded}`;
  
  // Update URL without triggering navigation
  window.history.replaceState(null, '', newHash);
}

// Generate shareable URL
export function getShareableUrl(nodes: GoalNode[], edges: StrategyEdge[]): string {
  if (typeof window === 'undefined') return '';
  
  const encoded = encodeState(nodes, edges);
  const baseUrl = window.location.origin + window.location.pathname;
  
  return `${baseUrl}#s=${encoded}`;
}

// Copy URL to clipboard
export async function copyShareableUrl(nodes: GoalNode[], edges: StrategyEdge[]): Promise<boolean> {
  const url = getShareableUrl(nodes, edges);
  
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    console.error('Failed to copy to clipboard');
    return false;
  }
}

