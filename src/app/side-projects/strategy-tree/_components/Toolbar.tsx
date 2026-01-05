'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlusIcon,
  ArrowsPointingOutIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { GoalNode, StrategyEdge } from '../_types';
import { copyShareableUrl } from '../_utils/urlState';

interface ToolbarProps {
  nodes: GoalNode[];
  edges: StrategyEdge[];
  onAddNode: () => void;
  onFitView: () => void;
}

export function Toolbar({ nodes, edges, onAddNode, onFitView }: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const success = await copyShareableUrl(nodes, edges);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [nodes, edges]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1 px-2 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200"
      >
        {/* Add Node */}
        <button
          onClick={onAddNode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Add new node (or double-click canvas)"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Add Node</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* Fit View */}
        <button
          onClick={onFitView}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Fit view"
        >
          <ArrowsPointingOutIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Fit</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Copy shareable link"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1.5 text-emerald-600"
              >
                <CheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-slate-400 mt-2"
      >
        Double-click to add • Drag handles to connect • Right-click for options
      </motion.p>
    </div>
  );
}

