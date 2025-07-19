'use client';

import { motion } from 'motion/react';
import { Project } from '@/data/teamplan';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onDragStart?: (e: React.DragEvent, projectId: string) => void;
}

export default function ProjectCard({ 
  project, 
  isDragging = false,
  onEdit,
  onDelete,
  onDragStart
}: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`
        relative group cursor-move p-3 rounded-lg ring-1 ring-slate-300/50 text-xs font-medium
        shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${project.color}
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
      draggable
      onDragStart={(e) => {
        if (onDragStart) {
          onDragStart(e, project.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Project: ${project.title}${project.description ? `. ${project.description}` : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold leading-snug truncate">
            {project.title}
          </h4>
          {project.description && (
            <p className="mt-1 text-xs opacity-75 leading-snug line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              title="Edit project"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-1 rounded hover:bg-red-500/20 transition-colors"
              title="Delete project"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
}