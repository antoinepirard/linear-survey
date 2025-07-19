'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/data/teamplan';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
  isEditing?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onDragStart?: (e: React.DragEvent, projectId: string) => void;
}

export default function ProjectCard({ 
  project, 
  isDragging = false,
  isEditing = false,
  onEdit,
  onDelete,
  onDragStart
}: ProjectCardProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editTitle, setEditTitle] = useState(project.title);

  useEffect(() => {
    if (isEditing) {
      setIsEditingLocal(true);
      setEditTitle(project.title);
    }
  }, [isEditing, project.title]);

  const handleSave = () => {
    if (editTitle.trim() && onEdit) {
      onEdit({
        ...project,
        title: editTitle.trim()
      });
    }
    setIsEditingLocal(false);
  };

  const handleCancel = () => {
    setEditTitle(project.title);
    setIsEditingLocal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const startEditing = () => {
    setIsEditingLocal(true);
    setEditTitle(project.title);
  };
  return (
    <div>
      <div
        data-project-card
        className={`
        relative group cursor-move p-3 rounded-lg ring-1 ring-slate-300/50 text-xs font-medium
        shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-400
        ${project.color}
        ${isDragging ? 'opacity-30 scale-95 rotate-1 shadow-lg cursor-grabbing' : 'cursor-grab'}
      `}
      draggable
      onDragStart={(e) => {
        if (onDragStart) {
          onDragStart(e, project.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Project: ${project.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditingLocal ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder="Project title"
              className="w-full font-semibold leading-snug bg-transparent border-none outline-none p-0 m-0 text-inherit min-h-[1.375rem]"
              autoFocus
            />
          ) : (
            <h4 
              className="font-semibold leading-snug truncate cursor-pointer hover:text-blue-600 transition-colors"
              onClick={startEditing}
              title="Click to edit project title"
            >
              {project.title}
            </h4>
          )}
        </div>
        
        {!isEditingLocal && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing();
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
        )}
      </div>
      </div>
    </div>
  );
}