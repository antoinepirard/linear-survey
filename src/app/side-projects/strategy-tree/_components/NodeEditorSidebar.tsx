'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { GoalNode, NodeStatus } from '../_types';
import { STATUS_CONFIG } from '../_types';

interface NodeEditorSidebarProps {
  node: GoalNode | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: { title?: string; description?: string; status?: NodeStatus }) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeEditorSidebar({
  node,
  onClose,
  onUpdate,
  onDelete,
}: NodeEditorSidebarProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<NodeStatus>('not-started');

  // Sync local state with selected node
  useEffect(() => {
    if (node) {
      setTitle(node.data.title);
      setDescription(node.data.description || '');
      setStatus(node.data.status);
    }
  }, [node]);

  // Update node when form changes
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      if (node) {
        onUpdate(node.id, { title: newTitle });
      }
    },
    [node, onUpdate]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDescription = e.target.value;
      setDescription(newDescription);
      if (node) {
        onUpdate(node.id, { description: newDescription });
      }
    },
    [node, onUpdate]
  );

  const handleStatusChange = useCallback(
    (newStatus: NodeStatus) => {
      setStatus(newStatus);
      if (node) {
        onUpdate(node.id, { status: newStatus });
      }
    },
    [node, onUpdate]
  );

  const handleDelete = useCallback(() => {
    if (node && confirm('Are you sure you want to delete this node?')) {
      onDelete(node.id);
      onClose();
    }
  }, [node, onDelete, onClose]);

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Edit Node</h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter goal title..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add a description..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(STATUS_CONFIG) as [NodeStatus, typeof STATUS_CONFIG[NodeStatus]][]).map(
                  ([statusKey, config]) => (
                    <button
                      key={statusKey}
                      onClick={() => handleStatusChange(statusKey)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
                        ${
                          status === statusKey
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }
                      `}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${config.bgColor}`} />
                      <span>{config.label}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Footer with delete */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Delete Node
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

