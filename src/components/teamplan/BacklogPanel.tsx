'use client';

import { useState, useRef, useEffect } from 'react';
import { RectangleGroupIcon, PlusIcon, ChevronDownIcon, ChevronRightIcon, FolderIcon } from '@heroicons/react/24/solid';
import { Project, getRandomColor, getProjectsByGroup } from '@/data/teamplan';
import { Button } from '@/components/ui/button';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'motion/react';

// Group color function for visual consistency
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
  
  let hash = 0;
  for (let i = 0; i < group.length; i++) {
    hash = ((hash << 5) - hash + group.charCodeAt(i)) & 0xffffffff;
  }
  return colors[Math.abs(hash) % colors.length];
};

interface BacklogPanelProps {
  width: number;
  backlogProjects: Project[];
  availableGroups: string[];
  onCreateProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function BacklogPanel({ 
  width, 
  backlogProjects, 
  availableGroups, 
  onCreateProject, 
  onUpdateProject, 
  onDeleteProject
}: BacklogPanelProps) {
  // Track which project should start in edit mode
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [hoveredGroupHeader, setHoveredGroupHeader] = useState<string | null>(null);
  const hasInitializedGroups = useRef(false);

  // ProjectCard handles the parsing - we just pass through the updates

  const handleCreateProject = () => {
    const newProject: Omit<Project, 'id'> = {
      title: '', // Empty title triggers edit mode
      color: getRandomColor(),
      // No personId/timeSlotId = backlog project
    };
    
    onCreateProject(newProject);
  };

  const handleCreateProjectInGroup = (groupName: string) => {
    const newProject: Omit<Project, 'id'> = {
      title: '', // Empty title triggers edit mode
      color: getRandomColor(),
      group: groupName, // Pre-assign to specific group
      // No personId/timeSlotId = backlog project
    };
    
    onCreateProject(newProject);
  };

  const handleCreateUngroupedProject = () => {
    const newProject: Omit<Project, 'id'> = {
      title: '', // Empty title triggers edit mode
      color: getRandomColor(),
      // No group = ungrouped project
      // No personId/timeSlotId = backlog project
    };
    
    onCreateProject(newProject);
  };

  const handleUpdateProject = (project: Project) => {
    // ProjectCard already handles parsing - just pass through the update
    onUpdateProject(project);
  };

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  // Get organized project data
  const { grouped, ungrouped } = getProjectsByGroup(backlogProjects);
  const groupNames = Object.keys(grouped).sort();

  // Initialize expanded groups when groups change
  useEffect(() => {
    if (groupNames.length > 0 && !hasInitializedGroups.current) {
      setExpandedGroups(new Set(groupNames)); // Start with all groups expanded
      hasInitializedGroups.current = true;
    }
  }, [groupNames]);

  return (
    <div 
      className="flex flex-col h-full"
      style={{ width }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200/65">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RectangleGroupIcon className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-medium text-slate-900">Project Backlog</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {backlogProjects.length}
            </span>
          </div>
          <Button
            onClick={handleCreateProject}
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
          >
            <PlusIcon className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-6 space-y-3">
          {/* Grouped Projects */}
          {groupNames.map((groupName) => {
            const groupProjects = grouped[groupName];
            const isExpanded = expandedGroups.has(groupName);
            const groupColor = getGroupColor(groupName);
            
            return (
              <div key={groupName} className={`mb-4 rounded-lg ${groupColor.bg}`}>
                {/* Group Header */}
                <div 
                  className="flex items-center gap-2 p-2 cursor-pointer transition-colors hover:opacity-80"
                  onClick={() => toggleGroup(groupName)}
                  onMouseEnter={() => setHoveredGroupHeader(groupName)}
                  onMouseLeave={() => setHoveredGroupHeader(null)}
                >
                  <FolderIcon className={`w-4 h-4 ${groupColor.text}`} />
                  <span className={`text-sm font-medium ${groupColor.text} flex-1`}>{groupName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded bg-white/50 ${groupColor.text}`}>
                    {groupProjects.length}
                  </span>
                  
                  {/* Add Project Button - appears on hover */}
                  {hoveredGroupHeader === groupName && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling group
                        handleCreateProjectInGroup(groupName);
                      }}
                      variant="ghost"
                      size="sm"
                      className={`h-5 w-5 p-0 ${groupColor.text} hover:${groupColor.bg} hover:opacity-100 transition-all duration-200`}
                      title={`Add project to ${groupName}`}
                    >
                      <PlusIcon className="w-3 h-3" />
                    </Button>
                  )}
                  
                  {isExpanded ? (
                    <ChevronDownIcon className={`w-4 h-4 ${groupColor.text}`} />
                  ) : (
                    <ChevronRightIcon className={`w-4 h-4 ${groupColor.text}`} />
                  )}
                </div>
                
                {/* Group Projects */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-visible"
                    >
                      <div className="pl-4 pr-2 pt-0 pb-2 space-y-2">
                        {groupProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            availableGroups={availableGroups}
                            allProjects={backlogProjects}
                            isColorCodingEnabled={false}
                            onEdit={handleUpdateProject}
                            onDelete={onDeleteProject}
                            isBacklogMode={true}
                            isEditing={!project.title.trim()}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          
          {/* Ungrouped Projects - always show header for easy access */}
          {(ungrouped.length > 0 || groupNames.length > 0) && (
            <div className="mb-4">
              <div 
                className="flex items-center gap-2 p-2 mb-2 bg-slate-100 rounded-lg hover:bg-slate-200/50 transition-colors"
                onMouseEnter={() => setHoveredGroupHeader('ungrouped')}
                onMouseLeave={() => setHoveredGroupHeader(null)}
              >
                <div className="w-4 h-4" /> {/* Spacer for alignment */}
                <span className="text-sm font-medium text-slate-600 flex-1">Other Projects</span>
                <span className="text-xs text-slate-500 bg-white/70 px-1.5 py-0.5 rounded">
                  {ungrouped.length}
                </span>
                
                {/* Add Ungrouped Project Button - appears on hover */}
                {hoveredGroupHeader === 'ungrouped' && (
                  <Button
                    onClick={handleCreateUngroupedProject}
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all duration-200"
                    title="Add ungrouped project"
                  >
                    <PlusIcon className="w-3 h-3" />
                  </Button>
                )}
              </div>
              {ungrouped.length > 0 && (
                <div className="pl-4 pr-2 space-y-2">
                  {ungrouped.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      availableGroups={availableGroups}
                      allProjects={backlogProjects}
                      isColorCodingEnabled={false}
                      onEdit={handleUpdateProject}
                      onDelete={onDeleteProject}
                      isBacklogMode={true}
                      isEditing={!project.title.trim()}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {backlogProjects.length === 0 && groupNames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <RectangleGroupIcon className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                No backlog projects
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-3">
                Create projects here before assigning them to people and time slots.
              </p>
              <Button
                onClick={handleCreateProject}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Create your first project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}