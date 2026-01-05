'use client';

import { useMemo } from 'react';
import type { StrategyNode, StrategyEdge } from '../_types';

export interface BlockingDependency {
  nodeId: string;
  title: string;
  status: StrategyNode['data']['status'];
  progress: number | null;
}

/**
 * Hook to find blocking dependencies for a given node.
 * A blocking dependency is a node connected via a dependency edge
 * whose status is not 'done'.
 */
export function useBlockingDependencies(
  nodeId: string,
  nodes: StrategyNode[],
  edges: StrategyEdge[]
): BlockingDependency[] {
  return useMemo(() => {
    // Find all incoming dependency edges to this node
    // In dependency edges: source "depends on" target (source is blocked by target)
    // So we need edges where this node is the SOURCE (this node depends on others)
    const dependencyEdges = edges.filter(
      (edge) => edge.type === 'dependency' && edge.source === nodeId
    );

    // Get the target nodes (the ones this node depends on)
    const blockingNodes: BlockingDependency[] = [];
    
    for (const edge of dependencyEdges) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      
      if (targetNode && targetNode.data.status !== 'done') {
        // Calculate progress if available
        let progress: number | null = null;
        if (targetNode.data.metrics?.progress?.enabled) {
          const { current, target } = targetNode.data.metrics.progress;
          if (target > 0) {
            progress = Math.round((current / target) * 100);
          }
        }

        blockingNodes.push({
          nodeId: targetNode.id,
          title: targetNode.data.title,
          status: targetNode.data.status,
          progress,
        });
      }
    }

    return blockingNodes;
  }, [nodeId, nodes, edges]);
}

/**
 * Hook to check if a node has any blocking dependencies
 */
export function useHasBlockingDependencies(
  nodeId: string,
  nodes: StrategyNode[],
  edges: StrategyEdge[]
): boolean {
  const blockingDeps = useBlockingDependencies(nodeId, nodes, edges);
  return blockingDeps.length > 0;
}

