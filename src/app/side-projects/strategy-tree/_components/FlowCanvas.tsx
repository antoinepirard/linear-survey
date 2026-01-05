'use client';

import { useCallback, useRef, useEffect, DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type ReactFlowInstance,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { StrategyNode } from './StrategyNode';
import { ButtonEdge } from './ButtonEdge';
import type { StrategyNode as StrategyNodeType, StrategyEdge, NodeStatus, StrategyNodeType as NodeType } from '../_types';
import { STATUS_CONFIG } from '../_types';

// Register custom node types
const nodeTypes: NodeTypes = {
  strategy: StrategyNode,
};

// Register custom edge types
const edgeTypes: EdgeTypes = {
  button: ButtonEdge,
};

interface FlowCanvasProps {
  nodes: StrategyNodeType[];
  edges: StrategyEdge[];
  onNodesChange: (changes: unknown) => void;
  onEdgesChange: (changes: unknown) => void;
  onConnect: (connection: unknown) => void;
  onToggleCollapse: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddNode: (nodeType: NodeType, position?: { x: number; y: number }) => void;
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
  onChangeStatus,
  onDeleteNode,
  onDuplicateNode,
  onFitViewRef,
}: FlowCanvasProps) {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
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
          btn.textContent = item.label;
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
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 2 }}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#cbd5e1"
        />
        <Controls 
          className="!bg-white !border-slate-200 !shadow-md [&>button]:!bg-white [&>button]:!border-slate-200 [&>button]:!text-slate-600 [&>button:hover]:!bg-slate-50"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
