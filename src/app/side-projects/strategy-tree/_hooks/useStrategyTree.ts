'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { StrategyNode, StrategyEdge, NodeStatus, StrategyNodeData, StrategyNodeType } from '../_types';

// Hierarchy order for node types (lower number = higher in hierarchy)
// Goals are at the top, tasks are at the bottom
const NODE_HIERARCHY: Record<StrategyNodeType, number> = {
  'company-goal': 0,
  'strategy': 1,
  'initiative': 2,
  'task': 3,
};
import {
  getStateFromUrl,
  deserializeToFlow,
  updateUrlWithState,
} from '../_utils/urlState';
import {
  getInitialNodes,
  getInitialEdges,
  generateEdgeId,
  getDescendantIds,
  hasChildren,
  createNode,
} from '../_utils/layoutHelpers';

export function useStrategyTree() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const getInitialState = useCallback(() => {
    const urlState = getStateFromUrl();
    if (urlState) {
      return deserializeToFlow(urlState);
    }
    return {
      nodes: getInitialNodes(),
      edges: getInitialEdges(),
    };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState<StrategyNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<StrategyEdge>([]);
  const [hiddenNodeIds, setHiddenNodeIds] = useState<Set<string>>(new Set());

  // Initialize state from URL or defaults
  useEffect(() => {
    if (!isInitialized) {
      const { nodes: initialNodes, edges: initialEdges } = getInitialState();
      setNodes(initialNodes);
      setEdges(initialEdges);
      setIsInitialized(true);
    }
  }, [isInitialized, getInitialState, setNodes, setEdges]);

  // Update URL when state changes (debounced)
  useEffect(() => {
    if (isInitialized && nodes.length > 0) {
      const timeout = setTimeout(() => {
        updateUrlWithState(nodes, edges);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [nodes, edges, isInitialized]);

  // Update nodes to show collapse button when they have children
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeHasChildren = hasChildren(node.id, edges);
        if (nodeHasChildren && node.data.isCollapsed === undefined) {
          return {
            ...node,
            data: { ...node.data, isCollapsed: false },
          };
        }
        if (!nodeHasChildren && node.data.isCollapsed !== undefined) {
          const { isCollapsed: _, ...restData } = node.data;
          return {
            ...node,
            data: restData as StrategyNodeData,
          };
        }
        return node;
      })
    );
  }, [edges, setNodes]);

  // Visible nodes (filter out hidden ones)
  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => !hiddenNodeIds.has(n.id));
  }, [nodes, hiddenNodeIds]);

  // Visible edges
  const visibleEdges = useMemo(() => {
    return edges.filter(
      (e) => !hiddenNodeIds.has(e.source) && !hiddenNodeIds.has(e.target)
    );
  }, [edges, hiddenNodeIds]);

  // Handle new connections - normalize direction based on node hierarchy
  // Higher level nodes (company-goal) should be sources, lower level nodes (task) should be targets
  // Horizontal connections (left/right handles) create dependency edges
  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return;
      
      // Don't allow self-connections
      if (connection.source === connection.target) return;
      
      // Detect if this is a horizontal (dependency) connection
      const isHorizontalConnection = 
        connection.sourceHandle === 'right' || 
        connection.sourceHandle === 'left' ||
        connection.targetHandle === 'right' || 
        connection.targetHandle === 'left';
      
      if (isHorizontalConnection) {
        // Create dependency edge (horizontal, dotted line)
        const edgeId = `dep-${connection.source}-${connection.target}`;
        
        // Check if a dependency edge already exists between these nodes
        const edgeExists = edges.some(
          (e) => 
            (e.source === connection.source && e.target === connection.target && e.type === 'dependency') ||
            (e.source === connection.target && e.target === connection.source && e.type === 'dependency')
        );
        
        if (edgeExists) return;
        
        const newEdge: StrategyEdge = {
          id: edgeId,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle || 'right',
          targetHandle: connection.targetHandle || 'left',
          type: 'dependency',
        };
        
        setEdges((eds) => {
          if (eds.some(e => e.id === newEdge.id)) return eds;
          return addEdge(newEdge, eds);
        });
        return;
      }
      
      // Hierarchy connection logic (vertical, solid line)
      const sourceHierarchy = NODE_HIERARCHY[sourceNode.data.nodeType];
      const targetHierarchy = NODE_HIERARCHY[targetNode.data.nodeType];
      
      // Determine if we need to swap source and target based on hierarchy
      // Edge should flow from higher level (lower number) to lower level (higher number)
      const shouldSwap = sourceHierarchy > targetHierarchy;
      
      const normalizedSource = shouldSwap ? connection.target! : connection.source!;
      const normalizedTarget = shouldSwap ? connection.source! : connection.target!;
      
      // Check if an edge already exists between these two nodes (in either direction)
      const edgeExists = edges.some(
        (e) => 
          (e.source === normalizedSource && e.target === normalizedTarget && e.type === 'button') ||
          (e.source === normalizedTarget && e.target === normalizedSource && e.type === 'button')
      );
      
      if (edgeExists) return; // Don't create duplicate edges
      
      // When swapped, the arrow should point the right direction:
      // - source uses bottom handle
      // - target uses top handle
      const newEdge: StrategyEdge = {
        id: generateEdgeId(normalizedSource, normalizedTarget),
        source: normalizedSource,
        target: normalizedTarget,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'button',
      };
      
      // Use functional update with duplicate check to handle race conditions
      setEdges((eds) => {
        // Double-check edge doesn't already exist in current state
        if (eds.some(e => e.id === newEdge.id)) return eds;
        return addEdge(newEdge, eds);
      });
    },
    [setEdges, nodes, edges]
  );

  // Handle node changes with selection tracking
  const handleNodesChange = useCallback(
    (changes: NodeChange<StrategyNode>[]) => {
      onNodesChange(changes);
      
      const selectionChange = changes.find(
        (c) => c.type === 'select' && 'selected' in c
      );
      if (selectionChange && 'id' in selectionChange) {
        if ('selected' in selectionChange && selectionChange.selected) {
          setSelectedNodeId(selectionChange.id);
        } else {
          setSelectedNodeId(null);
        }
      }
    },
    [onNodesChange]
  );

  // Handle edge changes
  const handleEdgesChange = useCallback(
    (changes: EdgeChange<StrategyEdge>[]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  // Add a new node with specific type
  const addNode = useCallback(
    (nodeType: StrategyNodeType, position?: { x: number; y: number }) => {
      const pos = position || { x: 300, y: 200 };
      const newNode = createNode(nodeType, pos);
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(newNode.id);
      return newNode.id;
    },
    [setNodes]
  );

  // Add a new node and connect it to a source node
  // Respects hierarchy: higher level nodes are sources, lower level nodes are targets
  const addNodeAndConnect = useCallback(
    (nodeType: StrategyNodeType, position: { x: number; y: number }, sourceNodeId: string) => {
      const newNode = createNode(nodeType, position);
      const existingNode = nodes.find(n => n.id === sourceNodeId);
      
      if (!existingNode) {
        setNodes((nds) => [...nds, newNode]);
        setSelectedNodeId(newNode.id);
        return newNode.id;
      }
      
      const existingHierarchy = NODE_HIERARCHY[existingNode.data.nodeType];
      const newHierarchy = NODE_HIERARCHY[nodeType];
      
      // Determine edge direction based on hierarchy
      // Edge flows from higher level (lower number) to lower level (higher number)
      const edgeSource = existingHierarchy <= newHierarchy ? sourceNodeId : newNode.id;
      const edgeTarget = existingHierarchy <= newHierarchy ? newNode.id : sourceNodeId;
      
      setNodes((nds) => [...nds, newNode]);
      
      const newEdge: StrategyEdge = {
        id: generateEdgeId(edgeSource, edgeTarget),
        source: edgeSource,
        target: edgeTarget,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'button',
      };
      
      // Use functional update with duplicate check
      setEdges((eds) => {
        if (eds.some(e => e.id === newEdge.id)) return eds;
        return [...eds, newEdge];
      });
      setSelectedNodeId(newNode.id);
      return newNode.id;
    },
    [setNodes, setEdges, nodes]
  );

  // Update node data
  const updateNode = useCallback(
    (nodeId: string, data: Partial<StrategyNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Delete a node and its connections
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [setNodes, setEdges, selectedNodeId]
  );

  // Delete an edge
  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  // Change node status
  const changeNodeStatus = useCallback(
    (nodeId: string, status: NodeStatus) => {
      updateNode(nodeId, { status });
    },
    [updateNode]
  );

  // Toggle collapse/expand for a node
  const toggleCollapse = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const isCollapsed = !node.data.isCollapsed;
      const descendants = getDescendantIds(nodeId, edges);

      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, isCollapsed } }
            : n
        )
      );

      setHiddenNodeIds((prev) => {
        const next = new Set(prev);
        if (isCollapsed) {
          descendants.forEach((id) => next.add(id));
        } else {
          descendants.forEach((id) => next.delete(id));
        }
        return next;
      });
    },
    [nodes, edges, setNodes]
  );

  // Get selected node
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Duplicate a node
  const duplicateNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const newNode = createNode(node.data.nodeType, {
        x: node.position.x + 50,
        y: node.position.y + 50,
      });
      newNode.data = {
        ...node.data,
        title: `${node.data.title} (copy)`,
        isCollapsed: undefined,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: false }))
    );
  }, [setNodes]);

  return {
    nodes: visibleNodes,
    edges: visibleEdges,
    allNodes: nodes,
    allEdges: edges,
    selectedNode,
    selectedNodeId,
    isInitialized,

    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onConnect,

    addNode,
    addNodeAndConnect,
    updateNode,
    deleteNode,
    deleteEdge,
    changeNodeStatus,
    toggleCollapse,
    duplicateNode,
    clearSelection,
    setSelectedNodeId,
  };
}
