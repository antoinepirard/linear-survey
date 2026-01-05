'use client';

import { useRef, useCallback } from 'react';
import { ReactFlowProvider, useReactFlow, getNodesBounds } from '@xyflow/react';
import { FlowCanvas } from './FlowCanvas';
import { Sidebar } from './Sidebar';
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
    addNodeAndConnect,
    updateNode,
    deleteNode,
    deleteEdge,
    changeNodeStatus,
    toggleCollapse,
    duplicateNode,
    clearSelection,
  } = useStrategyTree();

  const fitViewRef = useRef<(() => void) | null>(null);
  const { getNodes } = useReactFlow();

  const handleFitView = useCallback(() => {
    fitViewRef.current?.();
  }, []);

  const handleGetNodesBounds = useCallback(() => {
    const flowNodes = getNodes();
    if (flowNodes.length === 0) return null;
    return getNodesBounds(flowNodes);
  }, [getNodes]);

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
      {/* Main canvas - account for sidebar width */}
      <div className="absolute inset-0 right-72">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          allEdges={allEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onToggleCollapse={toggleCollapse}
          onDeleteEdge={deleteEdge}
          onAddNode={addNode}
          onAddNodeAndConnect={addNodeAndConnect}
          onChangeStatus={changeNodeStatus}
          onDeleteNode={deleteNode}
          onDuplicateNode={duplicateNode}
          onFitViewRef={fitViewRef}
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        nodes={allNodes}
        edges={allEdges}
        onFitView={handleFitView}
        onGetNodesBounds={handleGetNodesBounds}
      />

      {/* Sidebar with node palette and editor */}
      <Sidebar
        selectedNode={selectedNode}
        allNodes={allNodes}
        allEdges={allEdges}
        onAddNode={addNode}
        onUpdateNode={updateNode}
        onDeleteNode={deleteNode}
        onClearSelection={clearSelection}
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
