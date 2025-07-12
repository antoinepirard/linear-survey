import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/data/projects';

interface ProjectPreviewProps {
  project: Project | null;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <div className="sticky top-8 z-10">
      <div className="bg-slate-50 rounded-lg p-6 h-[500px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {project ? (
            <motion.div
              key={project.projectName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-lg font-medium text-slate-900">{project.projectName}</div>
              <p className="text-sm text-slate-500">{project.year}</p>
              {project.category && (
                <p className="text-sm text-slate-400 mt-1">{project.category}</p>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-slate-400">
              <p className="text-sm">Hover over a project to see preview</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
