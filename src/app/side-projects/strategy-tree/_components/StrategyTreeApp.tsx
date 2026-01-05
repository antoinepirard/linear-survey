'use client';

import { useRef, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowCanvas } from './FlowCanvas';
import { NodeEditorSidebar } from './NodeEditorSidebar';
import { Toolbar } from './Toolbar';
import { useStrategyTree } from '../_hooks/useStrategyTree';

function StrategyTreeContent() {
  const {
    nodes,
    edges,
    allNodes,
    allEdges,
    selectedNode,
    isInitialized,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    deleteEdge,
    changeNodeStatus,
    toggleCollapse,
    duplicateNode,
    clearSelection,
  } = useStrategyTree();

  const fitViewRef = useRef<(() => void) | null>(null);

  // Add node in center of viewport
  const handleAddNodeFromToolbar = useCallback(() => {
    // Add at a default position, will be centered by React Flow
    addNode({ x: 250, y: 200 });
  }, [addNode]);

  const handleFitView = useCallback(() => {
    fitViewRef.current?.();
  }, []);

  if (!isInitialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main canvas */}
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onToggleCollapse={toggleCollapse}
        onDeleteEdge={deleteEdge}
        onAddNode={addNode}
        onChangeStatus={changeNodeStatus}
        onDeleteNode={deleteNode}
        onDuplicateNode={duplicateNode}
        onFitViewRef={fitViewRef}
      />

      {/* Toolbar */}
      <Toolbar
        nodes={allNodes}
        edges={allEdges}
        onAddNode={handleAddNodeFromToolbar}
        onFitView={handleFitView}
      />

      {/* Node editor sidebar */}
      <NodeEditorSidebar
        node={selectedNode}
        onClose={clearSelection}
        onUpdate={updateNode}
        onDelete={deleteNode}
      />
    </div>
  );
}

export function StrategyTreeApp() {
  return (
    <ReactFlowProvider>
      <StrategyTreeContent />
    </ReactFlowProvider>
  );
}

