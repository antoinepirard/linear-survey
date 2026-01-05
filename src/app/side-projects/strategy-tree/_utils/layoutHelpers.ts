import type { StrategyNode, StrategyEdge, StrategyNodeType } from '../_types';

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
    x: viewportWidth / 2 - 100,
    y: viewportHeight / 2 - 40,
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

// Create a new node with given type
export function createNode(
  nodeType: StrategyNodeType,
  position: { x: number; y: number }
): StrategyNode {
  const titles: Record<StrategyNodeType, string> = {
    'company-goal': 'New Company Goal',
    'strategy': 'New Strategy',
    'initiative': 'New Initiative',
    'task': 'New Task',
  };

  return {
    id: generateNodeId(),
    type: 'strategy',
    position,
    data: {
      title: titles[nodeType],
      description: '',
      nodeType,
      status: 'not-started',
      metrics: {},
    },
  };
}

// Create default initial nodes for a new tree
export function getInitialNodes(): StrategyNode[] {
  return [
    {
      id: 'company-goal-1',
      type: 'strategy',
      position: { x: 300, y: 50 },
      data: {
        title: 'Increase Revenue by 30%',
        description: 'Annual revenue growth target for FY2026',
        nodeType: 'company-goal',
        status: 'on-track',
        metrics: {
          progress: { enabled: true, current: 15, target: 30, unit: '%' },
          timeline: { enabled: true, dueDate: '2026-12-31' },
        },
      },
    },
    {
      id: 'strategy-1',
      type: 'strategy',
      position: { x: 300, y: 220 },
      data: {
        title: 'Expand Enterprise Segment',
        description: 'Focus on enterprise customers with ARR > $100k',
        nodeType: 'strategy',
        status: 'on-track',
        metrics: {
          owner: { enabled: true, name: 'Sarah Chen' },
        },
      },
    },
    {
      id: 'initiative-1',
      type: 'strategy',
      position: { x: 120, y: 400 },
      data: {
        title: 'Enterprise Onboarding',
        description: 'Dedicated onboarding flow for enterprise',
        nodeType: 'initiative',
        status: 'on-track',
        metrics: {
          progress: { enabled: true, current: 60, target: 100, unit: '%' },
          timeline: { enabled: true, startDate: '2026-01-01', dueDate: '2026-03-31' },
        },
      },
    },
    {
      id: 'initiative-2',
      type: 'strategy',
      position: { x: 480, y: 400 },
      data: {
        title: 'SOC2 Compliance',
        description: 'Security certification for enterprise sales',
        nodeType: 'initiative',
        status: 'at-risk',
        metrics: {
          progress: { enabled: true, current: 25, target: 100, unit: '%' },
          owner: { enabled: true, name: 'Mike Johnson' },
        },
      },
    },
  ];
}

// Create default initial edges
export function getInitialEdges(): StrategyEdge[] {
  return [
    {
      id: 'edge-goal-strategy',
      source: 'company-goal-1',
      target: 'strategy-1',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'button',
    },
    {
      id: 'edge-strategy-init1',
      source: 'strategy-1',
      target: 'initiative-1',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'button',
    },
    {
      id: 'edge-strategy-init2',
      source: 'strategy-1',
      target: 'initiative-2',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'button',
    },
  ];
}
