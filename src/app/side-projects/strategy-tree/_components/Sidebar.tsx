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
  ExclamationTriangleIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { StrategyNode, StrategyNodeType, NodeStatus, NodeMetrics, NodePeriod, StrategyEdge } from '../_types';
import { STATUS_CONFIG, NODE_TYPE_CONFIG, calculateProgress, getDefaultPeriod } from '../_types';
import { PeriodSelector } from './PeriodSelector';
import { useBlockingDependencies, type BlockingDependency } from '../_hooks/useBlockingDependencies';

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

// Status icon component
function StatusIcon({ status, className }: { status: NodeStatus; className?: string }) {
  const iconClass = className || 'w-4 h-4';
  
  switch (status) {
    case 'not-started':
      return <PauseIcon className={iconClass} />;
    case 'in-progress':
      return <PlayIcon className={iconClass} />;
    case 'at-risk':
      return <ExclamationTriangleIcon className={iconClass} />;
    case 'blocked':
      return <XCircleIcon className={iconClass} />;
    case 'done':
      return <CheckIcon className={iconClass} />;
    default:
      return <PauseIcon className={iconClass} />;
  }
}

interface SidebarProps {
  selectedNode: StrategyNode | null;
  allNodes: StrategyNode[];
  allEdges: StrategyEdge[];
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

// Status picker component
function StatusPicker({ 
  value, 
  onChange 
}: { 
  value: NodeStatus; 
  onChange: (status: NodeStatus) => void;
}) {
  const statuses: NodeStatus[] = ['not-started', 'in-progress', 'at-risk', 'blocked', 'done'];
  
  return (
    <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-lg">
      {statuses.map((status) => {
        const config = STATUS_CONFIG[status];
        const isActive = value === status;
        
        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={`relative flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-all ${
              isActive 
                ? `bg-white shadow-sm ${config.color}` 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
            title={config.label}
          >
            <StatusIcon status={status} className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none truncate w-full text-center">
              {status === 'not-started' ? 'Not Started' : 
               status === 'in-progress' ? 'Progress' :
               status === 'at-risk' ? 'At Risk' :
               status === 'blocked' ? 'Blocked' : 'Done'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Progress input component
function ProgressInput({ 
  current, 
  target, 
  onChange 
}: { 
  current: number;
  target: number;
  onChange: (current: number, target: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex-1">
        <label className="block text-[10px] font-medium text-blue-600 mb-1">Progress</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={current}
            onChange={(e) => onChange(Number(e.target.value), target)}
            min={0}
            max={target}
            className="w-16 px-2 py-1.5 text-sm border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
          <span className="text-slate-400 text-sm">/</span>
          <input
            type="number"
            value={target}
            onChange={(e) => onChange(current, Number(e.target.value))}
            min={1}
            className="w-16 px-2 py-1.5 text-sm border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-semibold text-blue-600">
          {target > 0 ? Math.round((current / target) * 100) : 0}%
        </div>
      </div>
    </div>
  );
}

// Blocking dependencies display
function BlockingDependenciesDisplay({ 
  dependencies 
}: { 
  dependencies: BlockingDependency[];
}) {
  if (dependencies.length === 0) return null;
  
  return (
    <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
      <div className="flex items-center gap-2 mb-2">
        <XCircleIcon className="w-4 h-4 text-rose-500" />
        <span className="text-xs font-medium text-rose-700">Blocked by</span>
      </div>
      <div className="space-y-1.5">
        {dependencies.map((dep) => (
          <div 
            key={dep.nodeId}
            className="flex items-center justify-between text-xs bg-white rounded px-2 py-1.5 border border-rose-100"
          >
            <span className="font-medium text-slate-700 truncate flex-1">
              {dep.title}
            </span>
            <span className={`ml-2 ${STATUS_CONFIG[dep.status].color}`}>
              {dep.progress !== null ? `${dep.progress}%` : STATUS_CONFIG[dep.status].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Node editor form - all content visible
function NodeEditor({
  node,
  allNodes,
  allEdges,
  onUpdate,
  onDelete,
  onBack,
}: {
  node: StrategyNode;
  allNodes: StrategyNode[];
  allEdges: StrategyEdge[];
  onUpdate: (data: Partial<StrategyNode['data']>) => void;
  onDelete: () => void;
  onBack: () => void;
}) {
  const [title, setTitle] = useState(node.data.title);
  const [description, setDescription] = useState(node.data.description || '');
  const [status, setStatus] = useState<NodeStatus>(node.data.status);
  const [nodeType, setNodeType] = useState<StrategyNodeType>(node.data.nodeType);
  const [metrics, setMetrics] = useState<NodeMetrics>(node.data.metrics || {});

  // Get blocking dependencies
  const blockingDeps = useBlockingDependencies(node.id, allNodes, allEdges);

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

  const updateMetric = useCallback(<K extends keyof NodeMetrics>(
    metricKey: K,
    field: string,
    value: unknown
  ) => {
    const newMetrics = { ...metrics };
    if (!newMetrics[metricKey]) {
      newMetrics[metricKey] = {} as NodeMetrics[K];
    }
    (newMetrics[metricKey] as Record<string, unknown>)[field] = value;
    handleUpdate('metrics', newMetrics);
  }, [metrics, handleUpdate]);

  const handlePeriodChange = useCallback((period: NodePeriod) => {
    const newMetrics = { ...metrics, period };
    handleUpdate('metrics', newMetrics);
  }, [metrics, handleUpdate]);

  const handleProgressChange = useCallback((current: number, target: number) => {
    const newMetrics = {
      ...metrics,
      progress: { enabled: true, current, target }
    };
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
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${nodeTypeConfig.bgColor}`}>
            <NodeTypeIcon nodeType={nodeType} className={`w-4 h-4 ${nodeTypeConfig.iconColor}`} />
          </div>
          <span className="text-sm font-semibold text-slate-900 truncate">{title || 'Untitled'}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto -mr-4 pr-4 space-y-5">
        {/* === DETAILS SECTION === */}
        {/* Node Type */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Type
          </label>
          <select
            value={nodeType}
            onChange={(e) => handleUpdate('nodeType', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* === STATUS SECTION === */}
        {/* Status Picker */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Status
          </label>
          <StatusPicker 
            value={status} 
            onChange={(s) => handleUpdate('status', s)} 
          />
        </div>

        {/* Progress (shown when in-progress) */}
        {status === 'in-progress' && (
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Progress
            </label>
            <ProgressInput
              current={metrics.progress?.current || 0}
              target={metrics.progress?.target || 100}
              onChange={handleProgressChange}
            />
          </div>
        )}

        {/* Blocking Dependencies (shown when blocked or has blockers) */}
        {(status === 'blocked' || blockingDeps.length > 0) && (
          <BlockingDependenciesDisplay dependencies={blockingDeps} />
        )}

        {/* No blockers message */}
        {status === 'blocked' && blockingDeps.length === 0 && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              No dependency connections found.<br />
              Connect nodes with dependency edges to track blockers.
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* === TIMELINE & OWNER SECTION === */}
        {/* Period */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Period / Deadline
          </label>
          <PeriodSelector
            value={metrics.period}
            onChange={handlePeriodChange}
          />
        </div>

        {/* Owner */}
        <div>
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
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          Delete Node
        </button>
        
        {/* Bottom padding for scroll */}
        <div className="h-2" />
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
  allNodes,
  allEdges,
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
              allNodes={allNodes}
              allEdges={allEdges}
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
