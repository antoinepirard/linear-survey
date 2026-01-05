'use client';

import { useCallback, useRef, useEffect, useState, DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  type ReactFlowInstance,
  type NodeTypes,
  type EdgeTypes,
  type OnConnectEnd,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  FlagIcon,
  MapIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import { StrategyNode } from './StrategyNode';
import { ButtonEdge } from './ButtonEdge';
import { DependencyEdge } from './DependencyEdge';
import type { StrategyNode as StrategyNodeType, StrategyEdge, NodeStatus, StrategyNodeType as NodeType } from '../_types';
import { STATUS_CONFIG, NODE_TYPE_CONFIG } from '../_types';

// Register custom node types
const nodeTypes: NodeTypes = {
  strategy: StrategyNode,
};

// Register custom edge types
const edgeTypes: EdgeTypes = {
  button: ButtonEdge,
  dependency: DependencyEdge,
};

// Icon component for node types
function NodeTypeIcon({ nodeType, className }: { nodeType: NodeType; className?: string }) {
  const iconClass = className || 'w-5 h-5';
  switch (nodeType) {
    case 'company-goal':
      return <FlagIcon className={iconClass} />;
    case 'strategy':
      return <MapIcon className={iconClass} />;
    case 'initiative':
      return <RocketLaunchIcon className={iconClass} />;
    case 'task':
      return <CheckCircleIcon className={iconClass} />;
    default:
      return <FlagIcon className={iconClass} />;
  }
}

// Connection drop menu for creating new nodes
function ConnectionMenu({
  position,
  onSelect,
  onClose,
}: {
  position: { x: number; y: number };
  onSelect: (nodeType: NodeType) => void;
  onClose: () => void;
}) {
  const nodeTypes: NodeType[] = ['company-goal', 'strategy', 'initiative', 'task'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.connection-menu')) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="connection-menu fixed z-[9999] bg-white rounded-md shadow-md border border-slate-200 py-1 min-w-[160px]"
      style={{ left: position.x, top: position.y }}
    >
      {nodeTypes.map((type) => {
        const config = NODE_TYPE_CONFIG[type];
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <NodeTypeIcon nodeType={type} className={`w-4 h-4 ${config.iconColor}`} />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

interface FlowCanvasProps {
  nodes: StrategyNodeType[];
  edges: StrategyEdge[];
  onNodesChange: (changes: unknown) => void;
  onEdgesChange: (changes: unknown) => void;
  onConnect: (connection: unknown) => void;
  onToggleCollapse: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddNode: (nodeType: NodeType, position?: { x: number; y: number }) => void;
  onAddNodeAndConnect: (nodeType: NodeType, position: { x: number; y: number }, sourceNodeId: string) => void;
  onChangeStatus: (nodeId: string, status: NodeStatus) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onFitViewRef?: React.MutableRefObject<(() => void) | null>;
}

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onToggleCollapse,
  onDeleteEdge,
  onAddNode,
  onAddNodeAndConnect,
  onChangeStatus,
  onDeleteNode,
  onDuplicateNode,
  onFitViewRef,
}: FlowCanvasProps) {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  // State for connection drop menu
  const [connectionMenu, setConnectionMenu] = useState<{
    position: { x: number; y: number };
    flowPosition: { x: number; y: number };
    sourceNodeId: string;
  } | null>(null);
  const connectingNodeId = useRef<string | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance<StrategyNodeType, StrategyEdge>) => {
    reactFlowInstance.current = instance as ReactFlowInstance;
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 100);
  }, []);

  useEffect(() => {
    if (onFitViewRef) {
      onFitViewRef.current = () => {
        reactFlowInstance.current?.fitView({ padding: 0.2, duration: 300 });
      };
    }
  }, [onFitViewRef]);

  // Listen for custom events from nodes/edges
  useEffect(() => {
    const handleToggleCollapse = (e: CustomEvent<{ nodeId: string }>) => {
      onToggleCollapse(e.detail.nodeId);
    };

    const handleDeleteEdge = (e: CustomEvent<{ edgeId: string }>) => {
      onDeleteEdge(e.detail.edgeId);
    };

    window.addEventListener('toggleCollapse', handleToggleCollapse as EventListener);
    window.addEventListener('deleteEdge', handleDeleteEdge as EventListener);

    return () => {
      window.removeEventListener('toggleCollapse', handleToggleCollapse as EventListener);
      window.removeEventListener('deleteEdge', handleDeleteEdge as EventListener);
    };
  }, [onToggleCollapse, onDeleteEdge]);

  // Track connection start
  const onConnectStart = useCallback((_: unknown, { nodeId }: { nodeId: string | null }) => {
    connectingNodeId.current = nodeId;
  }, []);

  // Handle connection end - show menu if dropped on empty space
  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as HTMLElement).classList.contains('react-flow__pane');
      
      if (targetIsPane && connectingNodeId.current) {
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        
        // Get flow position for the new node
        const flowPosition = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });
        
        setConnectionMenu({
          position: { x: clientX, y: clientY },
          flowPosition: { x: flowPosition.x - 120, y: flowPosition.y - 20 }, // Center the node on cursor
          sourceNodeId: connectingNodeId.current,
        });
      }
      connectingNodeId.current = null;
    },
    [screenToFlowPosition]
  );

  // Handle node type selection from connection menu
  const handleConnectionMenuSelect = useCallback(
    (nodeType: NodeType) => {
      if (connectionMenu) {
        onAddNodeAndConnect(nodeType, connectionMenu.flowPosition, connectionMenu.sourceNodeId);
        setConnectionMenu(null);
      }
    },
    [connectionMenu, onAddNodeAndConnect]
  );

  // Handle drag over for drop zone
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!nodeType || !reactFlowInstance.current || !containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      onAddNode(nodeType, position);
    },
    [onAddNode]
  );

  // Context menu for nodes
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: StrategyNodeType) => {
      event.preventDefault();

      const menu = document.createElement('div');
      menu.className = 'fixed z-[9999] bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[160px]';
      menu.style.left = `${event.clientX}px`;
      menu.style.top = `${event.clientY}px`;

      const menuItems = [
        { 
          label: 'Change Status', 
          submenu: Object.entries(STATUS_CONFIG).map(([status, config]) => ({
            label: config.label,
            onClick: () => onChangeStatus(node.id, status as NodeStatus),
          })),
        },
        { label: 'Duplicate', onClick: () => onDuplicateNode(node.id) },
        { type: 'separator' },
        { label: 'Delete', onClick: () => onDeleteNode(node.id), danger: true },
      ];

      menuItems.forEach((item) => {
        if (item.type === 'separator') {
          const sep = document.createElement('div');
          sep.className = 'my-1 border-t border-slate-100';
          menu.appendChild(sep);
        } else if (item.submenu) {
          const parentItem = document.createElement('div');
          parentItem.className = 'relative group';
          
          const trigger = document.createElement('button');
          trigger.className = 'w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between';
          trigger.textContent = item.label;
          trigger.innerHTML += '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
          
          const submenu = document.createElement('div');
          submenu.className = 'hidden group-hover:block absolute left-full top-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[120px]';
          
          item.submenu.forEach((subItem) => {
            const btn = document.createElement('button');
            btn.className = 'w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50';
            btn.textContent = subItem.label;
            btn.onclick = () => {
              subItem.onClick();
              menu.remove();
            };
            submenu.appendChild(btn);
          });
          
          parentItem.appendChild(trigger);
          parentItem.appendChild(submenu);
          menu.appendChild(parentItem);
        } else {
          const btn = document.createElement('button');
          btn.className = `w-full px-3 py-1.5 text-left text-sm ${
            item.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50'
          }`;
          btn.textContent = item.label ?? '';
          btn.onclick = () => {
            item.onClick?.();
            menu.remove();
          };
          menu.appendChild(btn);
        }
      });

      document.body.appendChild(menu);

      const removeMenu = (e: MouseEvent) => {
        if (!menu.contains(e.target as Node)) {
          menu.remove();
          document.removeEventListener('click', removeMenu);
        }
      };
      setTimeout(() => document.addEventListener('click', removeMenu), 0);
    },
    [onChangeStatus, onDeleteNode, onDuplicateNode]
  );

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onInit={onInit}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          type: 'button',
          animated: false,
        }}
        connectionLineStyle={{ stroke: '#d4d4d8', strokeWidth: 1 }}
        connectionMode="loose"
        proOptions={{ hideAttribution: true }}
        className="bg-white"
      >
        {/* Arrow markers for edges */}
        <svg>
          <defs>
            {/* Hierarchy edge arrows */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4d4d8" />
            </marker>
            <marker
              id="arrow-selected"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            {/* Dependency edge arrows */}
            <marker
              id="arrow-dependency"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker
              id="arrow-dependency-selected"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1} 
          color="#e2e8f0"
        />
        <Controls 
          className="!bg-white !border-slate-200 !shadow-sm [&>button]:!bg-white [&>button]:!border-slate-200 [&>button]:!text-slate-500 [&>button:hover]:!bg-slate-50"
          showInteractive={false}
        />
      </ReactFlow>
      
      {/* Connection drop menu */}
      {connectionMenu && (
        <ConnectionMenu
          position={connectionMenu.position}
          onSelect={handleConnectionMenuSelect}
          onClose={() => setConnectionMenu(null)}
        />
      )}
    </div>
  );
}
