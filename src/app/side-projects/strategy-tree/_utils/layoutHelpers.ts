import type { GoalNode, StrategyEdge } from '../_types';

// Generate a unique ID for new nodes
export function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Generate a unique ID for new edges
export function generateEdgeId(source: string, target: string): string {
  return `edge-${source}-${target}`;
}

// Calculate center position for a new node
export function getCenterPosition(viewportWidth: number, viewportHeight: number): { x: number; y: number } {
  return {
    x: viewportWidth / 2 - 100, // Offset by half node width
    y: viewportHeight / 2 - 40, // Offset by half node height
  };
}

// Find all descendant node IDs for a given node (for collapse/expand)
export function getDescendantIds(
  nodeId: string,
  edges: StrategyEdge[],
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);

  const directChildren = edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target);

  const allDescendants: string[] = [...directChildren];

  for (const childId of directChildren) {
    const childDescendants = getDescendantIds(childId, edges, visited);
    allDescendants.push(...childDescendants);
  }

  return allDescendants;
}

// Check if a node has children
export function hasChildren(nodeId: string, edges: StrategyEdge[]): boolean {
  return edges.some((e) => e.source === nodeId);
}

// Get parent node IDs
export function getParentIds(nodeId: string, edges: StrategyEdge[]): string[] {
  return edges.filter((e) => e.target === nodeId).map((e) => e.source);
}

// Create default initial nodes for a new tree
export function getInitialNodes(): GoalNode[] {
  return [
    {
      id: 'company-goal',
      type: 'goal',
      position: { x: 250, y: 50 },
      data: {
        title: 'Company Goal',
        description: 'What is the high-level business objective?',
        status: 'not-started',
      },
    },
    {
      id: 'product-strategy',
      type: 'goal',
      position: { x: 250, y: 200 },
      data: {
        title: 'Product Strategy',
        description: 'How does product contribute to this goal?',
        status: 'not-started',
      },
    },
    {
      id: 'initiative-1',
      type: 'goal',
      position: { x: 100, y: 350 },
      data: {
        title: 'Initiative 1',
        description: 'First key initiative',
        status: 'on-track',
      },
    },
    {
      id: 'initiative-2',
      type: 'goal',
      position: { x: 400, y: 350 },
      data: {
        title: 'Initiative 2',
        description: 'Second key initiative',
        status: 'at-risk',
      },
    },
  ];
}

// Create default initial edges
export function getInitialEdges(): StrategyEdge[] {
  return [
    {
      id: 'edge-company-product',
      source: 'company-goal',
      target: 'product-strategy',
      type: 'button',
    },
    {
      id: 'edge-product-init1',
      source: 'product-strategy',
      target: 'initiative-1',
      type: 'button',
    },
    {
      id: 'edge-product-init2',
      source: 'product-strategy',
      target: 'initiative-2',
      type: 'button',
    },
  ];
}

