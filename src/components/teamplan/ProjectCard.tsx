'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Project } from '@/data/teamplan';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
  isEditing?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onDragStart?: (projectId: string) => void;
  onDragEnd?: (projectId: string) => void;
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
      setIsEditingLocal(false);
    } else {
      // Delete project if no content when saving
      if (onDelete) {
        onDelete(project.id);
      } else {
        setIsEditingLocal(false);
      }
    }
  };

  const handleCancel = () => {
    // If project originally had no title (new project), delete it
    if (!project.title.trim() && onDelete) {
      onDelete(project.id);
    } else {
      setEditTitle(project.title);
      setIsEditingLocal(false);
    }
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

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, project.id);
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : 1,
        rotate: isDragging ? 2 : 0
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div
        data-project-card
        className={`
          relative group cursor-move p-3 rounded-lg ring-1 font-regular text-sm
          shadow-sm hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-200
          ${project.color}
          ${isEditingLocal ? 'ring-blue-400' : 'ring-slate-300/50'}
          ${isDragging ? 'scale-105 rotate-1 shadow-lg' : ''}
        `}
        draggable
        onDragStart={handleDragStart}
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
              className="w-full font-medium leading-snug bg-transparent border-none outline-none p-0 m-0 text-inherit h-6 flex items-center"
              autoFocus
            />
          ) : (
            <h4 
              className="font-medium leading-snug truncate cursor-pointer hover:after:opacity-100 transition-all h-6 flex items-center relative after:content-[''] after:absolute after:left-0 after:top-full after:mt-1 after:h-px after:w-full after:bg-slate-300 after:opacity-0 after:transition-opacity"
              onClick={startEditing}
              title="Click to edit project title"
            >
              {project.title || (
                <span className="text-slate-300 italic">Project title...</span>
              )}
            </h4>
          )}
        </div>
        
        {!isEditingLocal && onDelete && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              title="Delete project"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-1"
            >
              <TrashIcon />
            </Button>
          </div>
        )}
      </div>
      </div>
    </motion.div>
  );
}