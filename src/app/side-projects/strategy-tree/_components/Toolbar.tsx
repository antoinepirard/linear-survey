"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowsPointingOutIcon,
  LinkIcon,
  CheckIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { toPng } from "html-to-image";
import { getViewportForBounds } from "@xyflow/react";
import type { StrategyNode, StrategyEdge } from "../_types";
import { copyShareableUrl } from "../_utils/urlState";

interface ToolbarProps {
  nodes: StrategyNode[];
  edges: StrategyEdge[];
  onFitView: () => void;
  onGetNodesBounds: () => {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "strategy-tree.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

export function Toolbar({
  nodes,
  edges,
  onFitView,
  onGetNodesBounds,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleShare = useCallback(async () => {
    const success = await copyShareableUrl(nodes, edges);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [nodes, edges]);

  const handleDownloadImage = useCallback(async () => {
    const nodesBounds = onGetNodesBounds();
    if (!nodesBounds) return;

    setDownloading(true);

    try {
      // Get the viewport element
      const viewport = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement;
      if (!viewport) return;

      // Calculate the viewport transform to fit all nodes
      const transform = getViewportForBounds(
        nodesBounds,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        0.5,
        2,
        0.2
      );

      const dataUrl = await toPng(viewport, {
        backgroundColor: "#ffffff",
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        style: {
          width: `${IMAGE_WIDTH}px`,
          height: `${IMAGE_HEIGHT}px`,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        },
      });

      downloadImage(dataUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
    } finally {
      setDownloading(false);
    }
  }, [onGetNodesBounds]);

  return (
    <div className="absolute top-4 left-4 z-40">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1 px-1 py-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm ring-1 ring-slate-200/50"
      >
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

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* Download as Image */}
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          title="Download as image"
        >
          <PhotoIcon
            className={`w-4 h-4 ${downloading ? "animate-pulse" : ""}`}
          />
          <span className="hidden sm:inline">
            {downloading ? "Saving..." : "Download"}
          </span>
        </button>
      </motion.div>
    </div>
  );
}
