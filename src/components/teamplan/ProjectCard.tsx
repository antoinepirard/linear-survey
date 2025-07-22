'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Project } from '@/data/teamplan';
import { Button } from '@/components/ui/button';
import TeamPlanContextMenu from './TeamPlanContextMenu';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
  isDuplicating?: boolean;
  isEditing?: boolean;
  availableGroups?: string[];
  allProjects?: Project[];
  isColorCodingEnabled?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onDuplicate?: (projectId: string) => void;
  onDragStart?: (projectId: string, isDuplicating: boolean) => void;
  onDragEnd?: () => void;
  onDrag?: (element: HTMLElement) => void;
}

export default function ProjectCard({ 
  project, 
  isDragging = false,
  isDuplicating = false,
  isEditing = false,
  availableGroups = [],
  allProjects = [],
  isColorCodingEnabled = true,
  onEdit,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragEnd,
  onDrag
}: ProjectCardProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editValue, setEditValue] = useState(project.title + (project.group ? `/${project.group}` : ''));
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Available color groups with subtle shades for distinction
  const colorGroups = [
    { name: 'red', shades: ['border-l-red-200', 'border-l-red-300', 'border-l-red-400', 'border-l-red-500'] },
    { name: 'orange', shades: ['border-l-orange-200', 'border-l-orange-300', 'border-l-orange-400', 'border-l-orange-500'] },
    { name: 'amber', shades: ['border-l-amber-200', 'border-l-amber-300', 'border-l-amber-400', 'border-l-amber-500'] },
    { name: 'yellow', shades: ['border-l-yellow-200', 'border-l-yellow-300', 'border-l-yellow-400', 'border-l-yellow-500'] },
    { name: 'lime', shades: ['border-l-lime-200', 'border-l-lime-300', 'border-l-lime-400', 'border-l-lime-500'] },
    { name: 'green', shades: ['border-l-green-200', 'border-l-green-300', 'border-l-green-400', 'border-l-green-500'] },
    { name: 'emerald', shades: ['border-l-emerald-200', 'border-l-emerald-300', 'border-l-emerald-400', 'border-l-emerald-500'] },
    { name: 'teal', shades: ['border-l-teal-200', 'border-l-teal-300', 'border-l-teal-400', 'border-l-teal-500'] },
    { name: 'cyan', shades: ['border-l-cyan-200', 'border-l-cyan-300', 'border-l-cyan-400', 'border-l-cyan-500'] },
    { name: 'sky', shades: ['border-l-sky-200', 'border-l-sky-300', 'border-l-sky-400', 'border-l-sky-500'] },
    { name: 'blue', shades: ['border-l-blue-200', 'border-l-blue-300', 'border-l-blue-400', 'border-l-blue-500'] },
    { name: 'indigo', shades: ['border-l-indigo-200', 'border-l-indigo-300', 'border-l-indigo-400', 'border-l-indigo-500'] },
    { name: 'violet', shades: ['border-l-violet-200', 'border-l-violet-300', 'border-l-violet-400', 'border-l-violet-500'] },
    { name: 'purple', shades: ['border-l-purple-200', 'border-l-purple-300', 'border-l-purple-400', 'border-l-purple-500'] },
    { name: 'fuchsia', shades: ['border-l-fuchsia-200', 'border-l-fuchsia-300', 'border-l-fuchsia-400', 'border-l-fuchsia-500'] },
    { name: 'pink', shades: ['border-l-pink-200', 'border-l-pink-300', 'border-l-pink-400', 'border-l-pink-500'] },
    { name: 'rose', shades: ['border-l-rose-200', 'border-l-rose-300', 'border-l-rose-400', 'border-l-rose-500'] }
  ];

  // Check if this card's content/value appears more than once
  const shouldShowColorCoding = () => {
    if (!isColorCodingEnabled || !project.title.trim()) return false;
    const sameValueCount = allProjects.filter(p => 
      p.title.trim().toLowerCase() === project.title.trim().toLowerCase()
    ).length;
    return sameValueCount >= 2;
  };

  // Get color for duplicate values - respects group colors but uses different shades
  const getColorForDuplicateValue = () => {
    if (!shouldShowColorCoding()) return 'border-l-slate-200';
    
    // Get all unique duplicate values (titles that appear 2+ times)
    const duplicateValues = allProjects
      .filter(p => p.title.trim())
      .reduce((acc, p) => {
        const title = p.title.trim().toLowerCase();
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const duplicateKeys = Object.keys(duplicateValues)
      .filter(key => duplicateValues[key] >= 2)
      .sort(); // Sort for consistency
    
    const currentTitle = project.title.trim().toLowerCase();
    const duplicateIndex = duplicateKeys.indexOf(currentTitle);
    
    if (duplicateIndex === -1) return 'border-l-slate-200';
    
    // If project has a group, use that group's color family
    if (project.group) {
      const groupColorData = getGroupColor(project.group);
      // Extract color name from the border class (e.g., "border-l-red-400" -> "red")
      const colorMatch = groupColorData.border.match(/border-l-(\w+)-/);
      if (colorMatch) {
        const colorName = colorMatch[1];
        const colorGroup = colorGroups.find(cg => cg.name === colorName);
        if (colorGroup) {
          // Use different shades within the same color family for distinction
          const shadeIndex = duplicateIndex % colorGroup.shades.length;
          return colorGroup.shades[shadeIndex];
        }
      }
    }
    
    // Fallback: use different color groups if no group or color not found
    const colorGroupIndex = duplicateIndex % colorGroups.length;
    const selectedColorGroup = colorGroups[colorGroupIndex];
    return selectedColorGroup.shades[0]; // Use first shade (200)
  };

  // Legacy function for group colors (keeping for tag display)
  const getGroupColor = (group: string) => {
    const colors = [
      { bg: 'bg-red-100', text: 'text-red-800', border: 'border-l-red-400' },
      { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-l-orange-400' },
      { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-l-amber-400' },
      { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-l-yellow-400' },
      { bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-l-lime-400' },
      { bg: 'bg-green-100', text: 'text-green-800', border: 'border-l-green-400' },
      { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-l-emerald-400' },
      { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-l-teal-400' },
      { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-l-cyan-400' },
      { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-l-sky-400' },
      { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-l-blue-400' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-l-indigo-400' },
      { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-l-violet-400' },
      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-l-purple-400' },
      { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-l-fuchsia-400' },
      { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-l-pink-400' },
      { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-l-rose-400' },
    ];
    
    // Simple hash function to get consistent color for same group
    let hash = 0;
    for (let i = 0; i < group.length; i++) {
      hash = ((hash << 5) - hash + group.charCodeAt(i)) & 0xffffffff;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (isEditing) {
      setIsEditingLocal(true);
      setEditValue(project.title + (project.group ? `/${project.group}` : ''));
    }
  }, [isEditing, project.title, project.group]);

  // Position cursor correctly when entering edit mode
  useEffect(() => {
    if (isEditingLocal && inputRef.current) {
      const input = inputRef.current;
      const value = input.value;
      const slashIndex = value.indexOf('/');
      
      if (slashIndex !== -1) {
        // Position cursor before the slash to edit the text, not the tag
        input.setSelectionRange(slashIndex, slashIndex);
      } else {
        // No slash found, position at the end
        input.setSelectionRange(value.length, value.length);
      }
    }
  }, [isEditingLocal]);


  const parseValue = (value: string) => {
    const slashIndex = value.indexOf('/');
    if (slashIndex !== -1) {
      const beforeSlash = value.slice(0, slashIndex).trim();
      const afterSlash = value.slice(slashIndex + 1).trim();
      
      // Check if we have group-first format: "/group project name"
      if (slashIndex === 0 && afterSlash.includes(' ')) {
        const spaceIndex = afterSlash.indexOf(' ');
        const group = afterSlash.slice(0, spaceIndex).trim();
        const title = afterSlash.slice(spaceIndex + 1).trim();
        return { title, group: group || undefined };
      }
      
      // Standard format: "project name/group"
      return {
        title: beforeSlash,
        group: afterSlash || undefined
      };
    }
    return { title: value.trim(), group: undefined };
  };

  const handleSave = () => {
    const { title, group } = parseValue(editValue);
    if (title && onEdit) {
      onEdit({
        ...project,
        title,
        group
      });
      setIsEditingLocal(false);
      setShowAutocomplete(false);
    } else {
      // Delete project if no content when saving
      if (onDelete) {
        onDelete(project.id);
      } else {
        setIsEditingLocal(false);
        setShowAutocomplete(false);
      }
    }
  };

  const handleCancel = () => {
    // If project originally had no title (new project), delete it
    if (!project.title.trim() && !project.group && onDelete) {
      onDelete(project.id);
    } else {
      setEditValue(project.title + (project.group ? `/${project.group}` : ''));
      setIsEditingLocal(false);
      setShowAutocomplete(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditValue(value);
    
    // Show autocomplete logic
    const slashIndex = value.lastIndexOf('/');
    if (slashIndex !== -1) {
      const afterSlash = value.slice(slashIndex + 1);
      // Hide autocomplete if we're in group-first mode and already typed a space
      if (slashIndex === 0 && afterSlash.includes(' ')) {
        setShowAutocomplete(false);
      } else {
        setShowAutocomplete(true);
      }
    } else {
      setShowAutocomplete(false);
    }
    setSelectedIndex(0); // Reset selection when typing
  };

  const handleSelectGroup = (group: string) => {
    const slashIndex = editValue.lastIndexOf('/');
    if (slashIndex !== -1) {
      const beforeSlash = editValue.slice(0, slashIndex + 1);
      setEditValue(beforeSlash + group);
    } else {
      setEditValue(editValue + '/' + group);
    }
    setShowAutocomplete(false);
    setSelectedIndex(0);
    // Small delay to ensure the selection is processed before refocusing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const getFilteredGroups = () => {
    const slashIndex = editValue.lastIndexOf('/');
    if (slashIndex === -1) return availableGroups;
    
    const afterSlash = editValue.slice(slashIndex + 1);
    // Don't filter if we're in project name mode (after space)
    if (slashIndex === 0 && afterSlash.includes(' ')) {
      return [];
    }
    
    const searchTerm = afterSlash.toLowerCase();
    return availableGroups.filter(group => 
      group.toLowerCase().includes(searchTerm)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showAutocomplete) {
      const filteredGroups = getFilteredGroups();
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredGroups.length);
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? filteredGroups.length - 1 : prev - 1);
        return;
      } else if (e.key === 'Enter' && filteredGroups.length > 0) {
        e.preventDefault();
        handleSelectGroup(filteredGroups[selectedIndex]);
        return;
      } else if (e.key === 'Escape') {
        setShowAutocomplete(false);
        setSelectedIndex(0);
        return;
      }
    }
    
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const startEditing = () => {
    setIsEditingLocal(true);
    setEditValue(project.title + (project.group ? `/${project.group}` : ''));
    setShowAutocomplete(false);
  };

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    setIsDraggingLocal(true);
    if (onDragStart) {
      let isAltPressed = false;
      if (event instanceof MouseEvent || event instanceof PointerEvent) {
        isAltPressed = event.altKey;
      }
      onDragStart(project.id, isAltPressed);
    }
  };

  const handleDragEnd = () => {
    setIsDraggingLocal(false);
    setIsHovered(false); // Reset hover state on drag end
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
    <div className="relative">
      {/* Static placeholder that stays in original position when dragging */}
      {isDragging && (
        <div
          className={`
            absolute inset-0 p-2 py-2.5 rounded-lg ring-1 font-regular text-sm
            shadow-sm opacity-30 pointer-events-none
            ${project.color}
            ring-slate-300/50
            ${isColorCodingEnabled ? `border-l-2 ${getColorForDuplicateValue()}` : ''}
          `}
          aria-hidden="true"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium leading-snug truncate h-6 flex items-center">
                {project.title || (
                  <span className="text-slate-300 italic">Project title...</span>
                )}
              </h4>
            </div>
          </div>
        </div>
      )}
      
      {/* Draggable element */}
      <TeamPlanContextMenu
        type="project"
        canDelete={true}
        onDelete={() => onDelete?.(project.id)}
        onDuplicate={() => onDuplicate?.(project.id)}
        label={project.title}
      >
        <motion.div
        ref={dragRef}
        initial={{ opacity: 0.9, scale: 0.98 }}
        animate={{ 
          opacity: 1,
          scale: 1
        }}
        exit={{ opacity: 0.9, scale: 0.98 }}
        whileDrag={{ 
          scale: 1.02,
          rotate: 1,
          zIndex: 1000,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)"
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragSnapToOrigin={true}
        dragTransition={{ 
          bounceStiffness: 1000,
          bounceDamping: 50
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 40,
          duration: 0.1
        }}
        data-project-card
        data-project-id={project.id}
        className={`
          relative cursor-move p-2 py-2.5 rounded-lg ring-1 font-regular text-sm
          transition-shadow duration-200
          ${isDraggingLocal ? '' : isHovered ? 'shadow-md' : 'shadow-none'}
          ${project.color}
          ${isEditingLocal ? 'ring-blue-400' : 'ring-slate-200/65'}
          ${isColorCodingEnabled ? `border-l-2 ${getColorForDuplicateValue()}` : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(false)}
        onTouchEnd={() => setIsHovered(false)}
        aria-label={`Project: ${project.title}`}
      >
        {isDuplicating && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md z-10 pointer-events-none">
            <PlusIcon className="w-3 h-3" />
          </div>
        )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditingLocal ? (
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                placeholder="Project title"
                className="w-full font-medium leading-snug bg-transparent border-none outline-none p-0 m-0 text-inherit h-5"
                autoFocus
              />
              {showAutocomplete && availableGroups.length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-32">
                  <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100">
                    Select a group:
                  </div>
                  {getFilteredGroups().map((group, index) => (
                    <div
                      key={group}
                      className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                        index === selectedIndex 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      onMouseDown={(e) => {
                        // Prevent the input from losing focus when clicking
                        e.preventDefault();
                        handleSelectGroup(group);
                      }}
                      onClick={(e) => {
                        // Fallback for touch devices
                        e.preventDefault();
                        handleSelectGroup(group);
                      }}
                    >
                      {group}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <h4 
              className="font-medium leading-snug truncate cursor-pointer hover:after:opacity-100 transition-all h-5 flex items-center relative after:content-[''] after:absolute after:left-0 after:top-full after:mt-1 after:h-px after:w-full after:bg-slate-300 after:opacity-0 after:transition-opacity flex-1"
              onClick={startEditing}
              title="Click to edit project title"
            >
              {project.title || (
                <span className="text-slate-300 italic">Project title...</span>
              )}
            </h4>
          )}
        </div>
        
        {!isEditingLocal && (
          <div className="relative flex items-center justify-end min-w-0 flex-shrink-0">
            {/* Show tag by default, trash icon on hover */}
            {project.group && (
              <span className={`transition-opacity duration-200 text-[10px] px-1.5 py-0.5 rounded-full font-mono max-w-16 truncate ${getGroupColor(project.group).bg} ${getGroupColor(project.group).text} ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                {project.group}
              </span>
            )}
            {onDelete && (
              <div className={`absolute right-0 transition-opacity duration-200 flex items-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  title="Delete project"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-5 w-5 p-0.5"
                >
                  <TrashIcon />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
        </motion.div>
      </TeamPlanContextMenu>
    </div>
  );
}