'use client';

import { useState, useEffect, useRef } from 'react';
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
  onDragEnd?: () => void;
  onDrag?: (element: HTMLElement) => void;
}

export default function ProjectCard({ 
  project, 
  isDragging = false,
  isEditing = false,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDrag
}: ProjectCardProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editTitle, setEditTitle] = useState(project.title);
  const dragRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = () => {
    if (onDragStart) {
      onDragStart(project.id);
    }
  };

  const handleDragEnd = () => {
    // Reset drag position to prevent bad positioning
    if (dragRef.current) {
      dragRef.current.style.transform = '';
    }
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (onDrag) {
      const element = (event.target as HTMLElement).closest('[data-project-card]') as HTMLElement;
      if (element) {
        onDrag(element);
      }
    }
  };
  return (
    <motion.div
      ref={dragRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1,
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileDrag={{ 
        scale: 1.02,
        rotate: 1,
        zIndex: 1000,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)"
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragSnapToOrigin={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 }
      }}
      data-project-card
      data-project-id={project.id}
      className={`
        relative group cursor-move p-3 rounded-lg ring-1 font-regular text-sm
        shadow-sm hover:shadow-md
        ${project.color}
        ${isEditingLocal ? 'ring-blue-400' : 'ring-slate-300/50'}
      `}
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
    </motion.div>
  );
}