'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { RectangleGroupIcon, PlusIcon, ChevronDownIcon, ChevronRightIcon, FolderIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import Image from 'next/image';
import { Project, Person, TimeSlot, getRandomColor, getProjectsByGroup, getAllGroups, ProjectImpact } from '@/data/teamplan';
import { calculateProjectColorMappings, validateGroupName } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import ProjectCard from './ProjectCard';

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

// Get group color with override support to preserve colors during renames
const getGroupColorWithOverrides = (group: string, overrides: Record<string, ReturnType<typeof getGroupColor>>) => {
  return overrides[group] || getGroupColor(group);
};

// Impact level ordering for sorting (highest to lowest impact)
const IMPACT_ORDER: Record<ProjectImpact, number> = {
  'urgent': 0,
  'high': 1,
  'medium': 2,
  'low': 3,
};

// Impact level display names
const IMPACT_DISPLAY: Record<ProjectImpact, string> = {
  'urgent': 'Urgent',
  'high': 'High',
  'medium': 'Medium',
  'low': 'Low',
};

// Sort options
type SortOrder = 'impact-desc' | 'impact-asc' | 'none';
type GroupingMode = 'group' | 'priority';

// Utility function to sort projects by impact
const sortProjectsByImpact = (projects: Project[], order: SortOrder): Project[] => {
  if (order === 'none') return projects;
  
  return [...projects].sort((a, b) => {
    const aImpact = a.impact || 'low';
    const bImpact = b.impact || 'low';
    const aOrder = IMPACT_ORDER[aImpact];
    const bOrder = IMPACT_ORDER[bImpact];
    
    if (order === 'impact-desc') {
      return aOrder - bOrder; // Highest impact first
    } else {
      return bOrder - aOrder; // Lowest impact first
    }
  });
};

// Utility function to group projects by priority/impact
const getProjectsByPriority = (projects: Project[]) => {
  const backlogProjects = projects.filter((p) => !p.personId || !p.timeSlotId);
  const grouped: Record<string, Project[]> = {};
  const ungrouped: Project[] = [];

  backlogProjects.forEach((project) => {
    if (project.impact) {
      const impactKey = project.impact;
      if (!grouped[impactKey]) {
        grouped[impactKey] = [];
      }
      grouped[impactKey].push(project);
    } else {
      ungrouped.push(project);
    }
  });

  // Sort projects within each priority group by order
  Object.keys(grouped).forEach((priority) => {
    grouped[priority].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  ungrouped.sort((a, b) => (a.order || 0) - (b.order || 0));

  return { grouped, ungrouped };
};

// Get priority color for visual consistency
const getPriorityColor = (priority: ProjectImpact) => {
  switch (priority) {
    case 'urgent':
      return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-l-orange-400' };
    case 'high':
      return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-l-slate-400' };
    case 'medium':
      return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-l-slate-400' };
    case 'low':
      return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-l-slate-400' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-l-slate-400' };
  }
};

interface BacklogPanelProps {
  width: number;
  backlogProjects: Project[];
  availableGroups: string[];
  people: Person[];
  timeSlots: TimeSlot[];
  onCreateProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onMoveToBoard: (projectId: string, personId?: string, timeSlotId?: string) => void;
  onRenameGroup?: (oldGroupName: string, newGroupName: string) => void;
  groupColorOverrides?: Record<string, ReturnType<typeof getGroupColor>>;
  onUpdateGroupColorOverrides?: (overrides: Record<string, ReturnType<typeof getGroupColor>>) => void;
}

export default function BacklogPanel({ 
  width, 
  backlogProjects, 
  availableGroups, 
  people, // eslint-disable-line @typescript-eslint/no-unused-vars
  timeSlots, // eslint-disable-line @typescript-eslint/no-unused-vars
  onCreateProject, 
  onUpdateProject, 
  onDeleteProject,
  onMoveToBoard,
  onRenameGroup,
  groupColorOverrides = {},
  onUpdateGroupColorOverrides
}: BacklogPanelProps) {
  // Track which project should start in edit mode
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [hoveredGroupHeader, setHoveredGroupHeader] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState<string>('');
  const hasInitializedGroups = useRef(false);

  // New state for sorting and grouping
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('group');

  // Calculate color mappings once per render for performance
  const colorMappings = useMemo(() => 
    calculateProjectColorMappings(backlogProjects), 
    [backlogProjects]
  );

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

  const handleMoveProjectToGroup = (projectId: string, groupName: string) => {
    const project = backlogProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedProject = {
      ...project,
      group: groupName || undefined, // Empty string becomes undefined (ungrouped)
    };
    
    onUpdateProject(updatedProject);
    
    if (groupName) {
      toast.success(`Project moved to "${groupName}" group`);
    } else {
      toast.success('Project removed from group');
    }
  };

  const handleStartGroupEdit = (groupName: string) => {
    setEditingGroupName(groupName);
    setEditingGroupValue(groupName);
  };

  const handleCancelGroupEdit = () => {
    setEditingGroupName(null);
    setEditingGroupValue('');
  };

  const handleSaveGroupEdit = () => {
    if (!editingGroupName || !editingGroupValue.trim()) {
      handleCancelGroupEdit();
      return;
    }

    const oldGroupName = editingGroupName;
    const newGroupName = editingGroupValue.trim();
    
    // Validate the new group name
    const validation = validateGroupName(newGroupName);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // If name hasn't changed, just cancel
    if (oldGroupName === newGroupName) {
      handleCancelGroupEdit();
      return;
    }

    // Check if new group name already exists (case-insensitive)
    const existingGroups = getAllGroups(backlogProjects);
    const groupExists = existingGroups.some(group => 
      group.toLowerCase() === newGroupName.toLowerCase() && group !== oldGroupName
    );

    if (groupExists) {
      toast.error('A group with this name already exists');
      handleCancelGroupEdit();
      return;
    }

    // Batch all updates into a single operation
    const projectsToUpdate = backlogProjects.filter(project => project.group === oldGroupName);
    
    // Call a new prop function that handles batched group rename
    if (projectsToUpdate.length > 0 && onRenameGroup) {
      onRenameGroup(oldGroupName, newGroupName);
      
      // Preserve the original group color by creating an override
      if (onUpdateGroupColorOverrides) {
        const originalColor = getGroupColorWithOverrides(oldGroupName, groupColorOverrides);
        const newOverrides = { ...groupColorOverrides };
        
        // Set the new group name to use the original color
        newOverrides[newGroupName] = originalColor;
        
        // Remove the old group name from overrides if it exists
        delete newOverrides[oldGroupName];
        
        onUpdateGroupColorOverrides(newOverrides);
      }
    }

    toast.success(`Group renamed from "${oldGroupName}" to "${newGroupName}"`);
    handleCancelGroupEdit();
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

  // Get organized project data based on grouping mode
  const { grouped, ungrouped } = useMemo(() => {
    const data = groupingMode === 'group' 
      ? getProjectsByGroup(backlogProjects)
      : getProjectsByPriority(backlogProjects);
    
    // Apply sorting to projects within each group
    const sortedGrouped: Record<string, Project[]> = {};
    Object.keys(data.grouped).forEach(key => {
      sortedGrouped[key] = sortProjectsByImpact(data.grouped[key], sortOrder);
    });
    
    return {
      grouped: sortedGrouped,
      ungrouped: sortProjectsByImpact(data.ungrouped, sortOrder)
    };
  }, [backlogProjects, groupingMode, sortOrder]);

  const groupNames = useMemo(() => {
    if (groupingMode === 'priority') {
      // Sort priority groups by impact order (urgent first)
      return Object.keys(grouped).sort((a, b) => {
        const aOrder = IMPACT_ORDER[a as ProjectImpact] ?? 999;
        const bOrder = IMPACT_ORDER[b as ProjectImpact] ?? 999;
        return aOrder - bOrder;
      });
    } else {
      return Object.keys(grouped).sort();
    }
  }, [grouped, groupingMode]);

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
      <div className="flex-shrink-0 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-slate-700">Project Backlog</h2>
            <span className="text-xs font-mono text-slate-500">
              [{backlogProjects.length}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Grouping Mode Button Group */}
            <div className="flex rounded-md border border-slate-200 overflow-hidden">
              <button
                onClick={() => setGroupingMode('group')}
                className={`px-2 py-1 text-xs font-medium transition-colors ${
                  groupingMode === 'group' 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Group
              </button>
              <button
                onClick={() => setGroupingMode('priority')}
                className={`px-2 py-1 text-xs font-medium border-l border-slate-200 transition-colors ${
                  groupingMode === 'priority' 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Priority
              </button>
            </div>
            
            {/* Sorting Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                >
                  <ChevronUpDownIcon className="w-3 h-3" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => setSortOrder('none')}
                  className={sortOrder === 'none' ? 'bg-slate-100' : ''}
                >
                  <span className="text-sm">Default order</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOrder('impact-desc')}
                  className={sortOrder === 'impact-desc' ? 'bg-slate-100' : ''}
                >
                  <span className="text-sm">Highest impact first</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOrder('impact-asc')}
                  className={sortOrder === 'impact-asc' ? 'bg-slate-100' : ''}
                >
                  <span className="text-sm">Lowest impact first</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-6 space-y-3">
          {/* Grouped Projects */}
          {groupNames.map((groupName) => {
            const groupProjects = grouped[groupName];
            const isExpanded = expandedGroups.has(groupName);
            const groupColor = groupingMode === 'priority' 
              ? getPriorityColor(groupName as ProjectImpact)
              : getGroupColorWithOverrides(groupName, groupColorOverrides);
            const displayName = groupingMode === 'priority' 
              ? IMPACT_DISPLAY[groupName as ProjectImpact] || groupName
              : groupName;
            
            return (
              <div key={groupName} className={`mb-4 rounded-lg ${groupColor.bg}`}>
                {/* Group Header */}
                <div 
                  className={`flex items-center gap-2 p-2 transition-colors ${
                    editingGroupName === groupName 
                      ? 'cursor-default' 
                      : 'cursor-pointer hover:opacity-80'
                  }`}
                  onClick={(e) => {
                    if (editingGroupName === groupName) {
                      e.preventDefault();
                      return;
                    }
                    // Only toggle if the click wasn't on the editable group name
                    if (groupingMode === 'group' && (e.target as HTMLElement).closest('.group-name-edit')) {
                      return;
                    }
                    toggleGroup(groupName);
                  }}
                  onMouseEnter={() => setHoveredGroupHeader(groupName)}
                  onMouseLeave={() => setHoveredGroupHeader(null)}
                >
                  {groupingMode === 'priority' ? (
                    <Image 
                      src={`/Assets/TeamPlan-Ravell/priority-${groupName}.svg`} 
                      alt={`${displayName} priority`}
                      width={16}
                      height={16}
                      className={`w-4 h-4 ${groupName === 'urgent' ? 'text-orange-500' : 'text-slate-500'}`}
                      style={{ filter: groupName === 'urgent' ? 'brightness(0) saturate(100%) invert(51%) sepia(96%) saturate(2073%) hue-rotate(8deg) brightness(100%) contrast(107%)' : 'brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(729%) hue-rotate(185deg) brightness(94%) contrast(84%)' }}
                    />
                  ) : (
                    <FolderIcon className={`w-4 h-4 ${groupColor.text}`} />
                  )}
                  
                  {/* Group Name - Editable only in group mode */}
                  {editingGroupName === groupName && groupingMode === 'group' ? (
                    <input
                      type="text"
                      value={editingGroupValue}
                      onChange={(e) => setEditingGroupValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveGroupEdit();
                        } else if (e.key === 'Escape') {
                          handleCancelGroupEdit();
                        }
                      }}
                      onBlur={handleSaveGroupEdit}
                      className={`text-sm font-medium ${groupColor.text} bg-white/80 border border-white/50 rounded px-2 py-0.5 flex-1 outline-none focus:border-blue-400`}
                      autoFocus
                      onFocus={(e) => e.target.select()}
                    />
                  ) : (
                    <div className="flex-1">
                      <span 
                        className={`text-sm font-medium ${groupColor.text} cursor-pointer hover:underline inline-block group-name-edit`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (groupingMode === 'group') {
                            handleStartGroupEdit(groupName);
                          }
                        }}
                        title={groupingMode === 'group' ? "Click to rename group" : undefined}
                      >
                        {displayName}
                      </span>
                    </div>
                  )}
                  <span className={`text-xs px-1.5 py-0.5 rounded bg-white/50 ${groupColor.text}`}>
                    {groupProjects.length}
                  </span>
                  
                  {/* Add Project Button - appears on hover (but not when editing group name) */}
                  {hoveredGroupHeader === groupName && editingGroupName !== groupName && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling group
                        if (groupingMode === 'priority') {
                          // Create project with specific priority/impact
                          const newProject: Omit<Project, 'id'> = {
                            title: '',
                            color: getRandomColor(),
                            impact: groupName as ProjectImpact,
                          };
                          onCreateProject(newProject);
                        } else {
                          handleCreateProjectInGroup(groupName);
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      className={`h-5 w-5 p-0 ${groupColor.text} hover:${groupColor.bg} hover:opacity-100 transition-all duration-200`}
                      title={groupingMode === 'priority' ? `Add ${displayName} priority project` : `Add project to ${groupName}`}
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
                {isExpanded && (
                  <div className="overflow-visible">
                    <div className="pl-4 pr-2 pt-0 pb-2 space-y-2">
                      {groupProjects.map((project) => (
                                                    <ProjectCard
                            key={project.id}
                            project={project}
                            availableGroups={availableGroups}
                            colorMappings={colorMappings}
                            isColorCodingEnabled={false}
                            onEdit={handleUpdateProject}
                            onDelete={(projectId) => onDeleteProject(projectId)}
                            onMoveToBoard={() => onMoveToBoard(project.id)}
                            onMoveToGroup={handleMoveProjectToGroup}
                            onSetImpact={(projectId, impact) => {
                              const updatedProject = { ...project, impact: impact || undefined };
                              handleUpdateProject(updatedProject);
                            }}
                            isBacklogMode={true}
                            isEditing={!project.title.trim()}
                          />
                      ))}
                    </div>
                  </div>
                )}
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
                {groupingMode === 'priority' ? (
                  <Image 
                    src="/Assets/TeamPlan-Ravell/priority-unset.svg" 
                    alt="No Priority Set"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                ) : (
                  <div className="w-4 h-4" />
                )}
                <span className="text-sm font-medium text-slate-600 flex-1">
                  {groupingMode === 'priority' ? 'No Priority Set' : 'Other Projects'}
                </span>
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
                      colorMappings={colorMappings}
                      isColorCodingEnabled={false}
                      onEdit={handleUpdateProject}
                      onDelete={(projectId) => onDeleteProject(projectId)}
                      onMoveToBoard={() => onMoveToBoard(project.id)}
                      onMoveToGroup={handleMoveProjectToGroup}
                      onSetImpact={(projectId, impact) => {
                        const updatedProject = { ...project, impact: impact || undefined };
                        handleUpdateProject(updatedProject);
                      }}
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