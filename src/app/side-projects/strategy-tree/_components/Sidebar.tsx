'use client';

import { useCallback, useEffect, useState, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrashIcon, 
  ChevronLeftIcon,
  FlagIcon,
  MapIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { StrategyNode, StrategyNodeType, NodeStatus, NodeMetrics } from '../_types';
import { STATUS_CONFIG, NODE_TYPE_CONFIG } from '../_types';

// Get the appropriate icon component for a node type
function NodeTypeIcon({ nodeType, className }: { nodeType: StrategyNodeType; className?: string }) {
  const iconClass = className || 'w-4 h-4';
  
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

interface SidebarProps {
  selectedNode: StrategyNode | null;
  onAddNode: (nodeType: StrategyNodeType, position?: { x: number; y: number }) => void;
  onUpdateNode: (nodeId: string, data: Partial<StrategyNode['data']>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClearSelection: () => void;
}

// Draggable node type card
function NodeTypeCard({ 
  nodeType, 
  onAdd,
  onDragStart,
}: { 
  nodeType: StrategyNodeType; 
  onAdd: () => void;
  onDragStart: (e: DragEvent, nodeType: StrategyNodeType) => void;
}) {
  const config = NODE_TYPE_CONFIG[nodeType];
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, nodeType)}
      onClick={onAdd}
      className="p-4 rounded-lg border border-dashed border-slate-300 bg-white cursor-grab active:cursor-grabbing transition-all hover:border-slate-400 hover:shadow-sm flex flex-col items-center text-center"
    >
      <NodeTypeIcon nodeType={nodeType} className={`w-6 h-6 mb-2 ${config.iconColor}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}

// Node editor form
function NodeEditor({
  node,
  onUpdate,
  onDelete,
  onBack,
}: {
  node: StrategyNode;
  onUpdate: (data: Partial<StrategyNode['data']>) => void;
  onDelete: () => void;
  onBack: () => void;
}) {
  const [title, setTitle] = useState(node.data.title);
  const [description, setDescription] = useState(node.data.description || '');
  const [status, setStatus] = useState<NodeStatus>(node.data.status);
  const [nodeType, setNodeType] = useState<StrategyNodeType>(node.data.nodeType);
  const [metrics, setMetrics] = useState<NodeMetrics>(node.data.metrics || {});

  // Sync with selected node
  useEffect(() => {
    setTitle(node.data.title);
    setDescription(node.data.description || '');
    setStatus(node.data.status);
    setNodeType(node.data.nodeType);
    setMetrics(node.data.metrics || {});
  }, [node]);

  const handleUpdate = useCallback((field: string, value: unknown) => {
    const updates: Partial<StrategyNode['data']> = {};
    
    switch (field) {
      case 'title':
        setTitle(value as string);
        updates.title = value as string;
        break;
      case 'description':
        setDescription(value as string);
        updates.description = value as string;
        break;
      case 'status':
        setStatus(value as NodeStatus);
        updates.status = value as NodeStatus;
        break;
      case 'nodeType':
        setNodeType(value as StrategyNodeType);
        updates.nodeType = value as StrategyNodeType;
        break;
      case 'metrics':
        setMetrics(value as NodeMetrics);
        updates.metrics = value as NodeMetrics;
        break;
    }
    
    onUpdate(updates);
  }, [onUpdate]);

  const updateMetric = useCallback((
    metricKey: keyof NodeMetrics,
    field: string,
    value: unknown
  ) => {
    const newMetrics = { ...metrics };
    if (!newMetrics[metricKey]) {
      newMetrics[metricKey] = { enabled: false } as NodeMetrics[typeof metricKey];
    }
    (newMetrics[metricKey] as Record<string, unknown>)[field] = value;
    handleUpdate('metrics', newMetrics);
  }, [metrics, handleUpdate]);

  const nodeTypeConfig = NODE_TYPE_CONFIG[nodeType];

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Back to node palette"
        >
          <ChevronLeftIcon className="w-5 h-5 text-slate-500" />
        </button>
        <div className="flex items-center gap-2">
          <NodeTypeIcon nodeType={nodeType} className={`w-5 h-5 ${nodeTypeConfig.iconColor}`} />
          <h2 className="text-sm font-semibold text-slate-900">Edit Node</h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 -mr-4 pr-4">
        {/* Node Type */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Type
          </label>
          <select
            value={nodeType}
            onChange={(e) => handleUpdate('nodeType', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(Object.keys(NODE_TYPE_CONFIG) as StrategyNodeType[]).map((type) => (
              <option key={type} value={type}>
                {NODE_TYPE_CONFIG[type].label}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="Enter title..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            placeholder="Add description..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Status
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.entries(STATUS_CONFIG) as [NodeStatus, typeof STATUS_CONFIG[NodeStatus]][]).map(
              ([statusKey, config]) => (
                <button
                  key={statusKey}
                  onClick={() => handleUpdate('status', statusKey)}
                  className={`
                    flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-xs font-medium transition-all
                    ${status === statusKey
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }
                  `}
                >
                  <div className={`w-2 h-2 rounded-full ${config.bgColor}`} />
                  {config.label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Metrics Section */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Metrics
          </h4>

          {/* Progress */}
          <div className="mb-3 p-2.5 rounded-lg bg-slate-50">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={metrics.progress?.enabled || false}
                onChange={(e) => updateMetric('progress', 'enabled', e.target.checked)}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Progress</span>
            </label>
            {metrics.progress?.enabled && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={metrics.progress?.current || 0}
                  onChange={(e) => updateMetric('progress', 'current', Number(e.target.value))}
                  placeholder="Current"
                  className="w-16 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="number"
                  value={metrics.progress?.target || 100}
                  onChange={(e) => updateMetric('progress', 'target', Number(e.target.value))}
                  placeholder="Target"
                  className="w-16 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={metrics.progress?.unit || '%'}
                  onChange={(e) => updateMetric('progress', 'unit', e.target.value)}
                  placeholder="Unit"
                  className="w-12 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="mb-3 p-2.5 rounded-lg bg-slate-50">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={metrics.timeline?.enabled || false}
                onChange={(e) => updateMetric('timeline', 'enabled', e.target.checked)}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Timeline</span>
            </label>
            {metrics.timeline?.enabled && (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Start</label>
                  <input
                    type="date"
                    value={metrics.timeline?.startDate || ''}
                    onChange={(e) => updateMetric('timeline', 'startDate', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Due</label>
                  <input
                    type="date"
                    value={metrics.timeline?.dueDate || ''}
                    onChange={(e) => updateMetric('timeline', 'dueDate', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Owner */}
          <div className="p-2.5 rounded-lg bg-slate-50">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={metrics.owner?.enabled || false}
                onChange={(e) => updateMetric('owner', 'enabled', e.target.checked)}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Owner</span>
            </label>
            {metrics.owner?.enabled && (
              <input
                type="text"
                value={metrics.owner?.name || ''}
                onChange={(e) => updateMetric('owner', 'name', e.target.value)}
                placeholder="Enter owner name..."
                className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </div>
  );
}

// Node palette for adding new nodes
function NodePalette({
  onAddNode,
  onDragStart,
}: {
  onAddNode: (nodeType: StrategyNodeType) => void;
  onDragStart: (e: DragEvent, nodeType: StrategyNodeType) => void;
}) {
  const nodeTypes: StrategyNodeType[] = ['company-goal', 'strategy', 'initiative', 'task'];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold text-slate-900 mb-1">Add Nodes</h2>
      <p className="text-xs text-slate-500 mb-4">Click or drag onto canvas</p>
      
      <div className="grid grid-cols-2 gap-2">
        {nodeTypes.map((type) => (
          <NodeTypeCard
            key={type}
            nodeType={type}
            onAdd={() => onAddNode(type)}
            onDragStart={onDragStart}
          />
        ))}
      </div>
      
      <div className="mt-auto pt-6">
        <p className="text-xs text-slate-400 text-center">
          Click a node on the canvas to edit
        </p>
      </div>
    </div>
  );
}

export function Sidebar({
  selectedNode,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  onClearSelection,
}: SidebarProps) {
  const handleDragStart = useCallback((e: DragEvent, nodeType: StrategyNodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedNode && confirm('Delete this node?')) {
      onDeleteNode(selectedNode.id);
      onClearSelection();
    }
  }, [selectedNode, onDeleteNode, onClearSelection]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 bottom-0 w-72 bg-white border-l border-slate-200 shadow-xl z-40 flex flex-col p-4"
    >
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <NodeEditor
              node={selectedNode}
              onUpdate={(data) => onUpdateNode(selectedNode.id, data)}
              onDelete={handleDelete}
              onBack={onClearSelection}
            />
          </motion.div>
        ) : (
          <motion.div
            key="palette"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col"
          >
            <NodePalette
              onAddNode={onAddNode}
              onDragStart={handleDragStart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
