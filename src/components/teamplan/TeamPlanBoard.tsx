'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TeamPlanData, Project, Person, TimeSlot, DEFAULT_TEAMPLAN_DATA, getProjectsForCell, generateId, getRandomColor, getAllGroups } from '@/data/teamplan';
import ProjectCard from './ProjectCard';
import PersonCell from './PersonCell';
import AddPersonCell from './AddPersonCell';
import TeamPlanContextMenu from './TeamPlanContextMenu';
import TeamPlanHeader from './TeamPlanHeader';
import { Button } from '@/components/ui/button';

interface TeamPlanBoardProps {
  data?: TeamPlanData;
  onChange?: (data: TeamPlanData) => void;
  onDataSyncError?: (originalData: TeamPlanData, errorData: TeamPlanData, error: Error) => void;
  isColorCodingEnabled?: boolean;
  hoveredColumn?: string | null;
  onColumnMouseEnter?: (timeSlotId: string) => void;
  onColumnMouseLeave?: () => void;
  // Header props
  onAddTimeSlot?: (timeSlot: TimeSlot) => void;
  onRemoveTimeSlot?: (timeSlotId: string) => void;
  onUpdateTimeSlot?: (timeSlot: TimeSlot) => void;
  onMoveTimeSlotLeft?: (timeSlotId: string) => void;
  onMoveTimeSlotRight?: (timeSlotId: string) => void;
}

function TeamPlanBoard({ 
  data = DEFAULT_TEAMPLAN_DATA, 
  onChange,
  onDataSyncError,
  isColorCodingEnabled = true,
  hoveredColumn: externalHoveredColumn,
  onColumnMouseEnter: externalOnColumnMouseEnter,
  onColumnMouseLeave: externalOnColumnMouseLeave,
  // Header props
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot,
  onMoveTimeSlotLeft,
  onMoveTimeSlotRight
}: TeamPlanBoardProps) {
  const [boardData, setBoardData] = useState<TeamPlanData>(data);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [dragOverCell, setDragOverCell] = useState<{ personId: string; timeSlotId: string; insertIndex: number } | null>(null);
  const [dragOverAddPerson, setDragOverAddPerson] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [draggedProjectData, setDraggedProjectData] = useState<Project | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cachedDropZones = useRef<Array<{
    element: HTMLElement;
    rect: DOMRect;
    personId: string;
    timeSlotId: string;
  }>>([]);

  // Sync internal state with prop changes (e.g., when data is loaded from localStorage)
  useEffect(() => {
    console.log('🔄 TeamPlanBoard: Prop data changed, updating internal state');
    console.log('🔄 TeamPlanBoard: New prop data projects count:', data.projects?.length || 0);
    setBoardData(data);
  }, [data]);

  // Handle scroll events to show/hide fade overlays
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(scrollLeft < maxScroll - 10);
  };

  // Set up scroll listener and initial fade state
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    handleScroll(); // Check initial state
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also check on resize
    const handleResize = () => setTimeout(handleScroll, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Use external hover state if provided, otherwise use internal state
  const currentHoveredColumn = externalHoveredColumn !== undefined ? externalHoveredColumn : hoveredColumn;
  
  // Column hover handlers
  const handleColumnMouseEnter = (timeSlotId: string) => {
    if (externalOnColumnMouseEnter) {
      externalOnColumnMouseEnter(timeSlotId);
    } else {
      setHoveredColumn(timeSlotId);
    }
  };

  const handleColumnMouseLeave = () => {
    if (externalOnColumnMouseLeave) {
      externalOnColumnMouseLeave();
    } else {
      setHoveredColumn(null);
    }
  };

  // Get all unique groups from existing projects
  const getAvailableGroups = () => getAllGroups(boardData.projects);

  // Helper function for optimistic updates with error handling
  const performOptimisticUpdate = async (newData: TeamPlanData, operation: string) => {
    const originalData = boardData;
    setBoardData(newData);
    
    try {
      onChange?.(newData);
    } catch (error) {
      console.error(`Failed to ${operation}:`, error);
      setBoardData(originalData);
      onDataSyncError?.(originalData, newData, error as Error);
      throw error;
    }
  };

  const handleDragStart = (projectId: string, isDuplicate: boolean) => {
    const project = boardData.projects.find(p => p.id === projectId);
    if (!project) {
      console.warn(`Project with id ${projectId} not found`);
      return;
    }
    setDraggedProject(projectId);
    setDraggedProjectData(project);
    setIsDuplicating(isDuplicate);
    
    // Cache drop zone positions for better drag performance
    const dropZones = document.querySelectorAll('[data-drop-zone]');
    cachedDropZones.current = Array.from(dropZones).map(element => {
      const htmlElement = element as HTMLElement;
      return {
        element: htmlElement,
        rect: htmlElement.getBoundingClientRect(),
        personId: htmlElement.getAttribute('data-person-id') || '',
        timeSlotId: htmlElement.getAttribute('data-timeslot-id') || ''
      };
    });
  };

  const handleDragEnd = async () => {
    const originalData = boardData;
    // Keep a reference to the drag state to use after clearing
    const currentDragOverCell = dragOverCell;
    const currentDraggedProjectData = draggedProjectData;
    const currentDragOverAddPerson = dragOverAddPerson;

    let newData = null;
    let newProjectForFocus: Project | null = null;
    
    // Check if dropped on add person area
    if (currentDragOverAddPerson && currentDraggedProjectData) {
      const newPersonId = generateId();
      const newPerson: Person = {
        id: newPersonId,
        name: 'Unknown'
      };
      
      // Get first time slot for the new assignment
      const firstTimeSlot = boardData.timeSlots[0];
      if (firstTimeSlot) {
        let updatedProject: Project;
        let newProjects: Project[];
        
        if (isDuplicating) {
          const duplicateProjectId = generateId();
          updatedProject = {
            ...currentDraggedProjectData,
            id: duplicateProjectId,
            personId: newPersonId,
            timeSlotId: firstTimeSlot.id,
          };
          newProjects = [...originalData.projects, updatedProject];
          newProjectForFocus = updatedProject;
        } else {
          updatedProject = {
            ...currentDraggedProjectData,
            personId: newPersonId,
            timeSlotId: firstTimeSlot.id,
          };
          newProjects = originalData.projects.map(p => 
            p.id === currentDraggedProjectData.id ? updatedProject : p
          );
        }
        
        newData = {
          ...originalData,
          people: [...originalData.people, newPerson],
          projects: newProjects
        };
      }
    }
    // Check if we have a valid drop target and dragged project data
    else if (currentDragOverCell && currentDraggedProjectData) {
      const { personId, timeSlotId } = currentDragOverCell;

      if (isDuplicating) {
        const newProjectId = generateId();
        const newProject = {
          ...currentDraggedProjectData,
          id: newProjectId,
          personId,
          timeSlotId,
        };
        newData = {
          ...originalData,
          projects: [...originalData.projects, newProject],
        };
        newProjectForFocus = newProject;
      } else {
        if (personId !== currentDraggedProjectData.personId || timeSlotId !== currentDraggedProjectData.timeSlotId) {
          const updatedProject = { ...currentDraggedProjectData, personId, timeSlotId };
          newData = {
            ...originalData,
            projects: originalData.projects.map(p => 
              p.id === currentDraggedProjectData.id ? updatedProject : p
            )
          };
        }
      }
    }

    if (newData) {
      if (newProjectForFocus) {
        setNewProjectId(newProjectForFocus.id);
      }

      try {
        await performOptimisticUpdate(newData, 'drag and drop');
      } catch {
        // performOptimisticUpdate already handles rollback and error reporting
        if (newProjectForFocus) {
          setNewProjectId(null);
        }
      }
    }
    
    // Clear drag state after data updates to prevent animation glitches
    setDraggedProject(null);
    setDraggedProjectData(null);
    setDragOverCell(null);
    setDragOverAddPerson(false);
    setIsDuplicating(false);
    // Clear cached drop zones
    cachedDropZones.current = [];
  };

  // Position-based drop detection for Framer Motion drag with cached layout data
  const updateDropTarget = (draggedElement: HTMLElement) => {
    if (!draggedProject || !draggedElement) return;

    try {
      const draggedRect = draggedElement.getBoundingClientRect();
      const draggedCenter = {
        x: draggedRect.left + draggedRect.width / 2,
        y: draggedRect.top + draggedRect.height / 2
      };

      // Check if dragging over add person zone first (still need to query this dynamically)
      const addPersonZone = document.querySelector('[data-add-person-zone]');
      if (addPersonZone) {
        const addPersonRect = addPersonZone.getBoundingClientRect();
        if (
          draggedCenter.x >= addPersonRect.left &&
          draggedCenter.x <= addPersonRect.right &&
          draggedCenter.y >= addPersonRect.top &&
          draggedCenter.y <= addPersonRect.bottom
        ) {
          setDragOverCell(null);
          setDragOverAddPerson(true);
          return;
        }
      }

      // Clear add person drag over state if not over add person zone
      setDragOverAddPerson(false);

      // Use cached drop zone data for better performance
      let bestMatch: { personId: string; timeSlotId: string; insertIndex: number } | null = null;
      let bestDistance = Infinity;

      cachedDropZones.current.forEach(({ rect, personId, timeSlotId }) => {
        // Check if drag center is over this cell using cached rect data
        if (
          draggedCenter.x >= rect.left &&
          draggedCenter.x <= rect.right &&
          draggedCenter.y >= rect.top &&
          draggedCenter.y <= rect.bottom
        ) {
          if (!personId || !timeSlotId) {
            console.warn('Drop zone missing required data attributes');
            return;
          }
          
          // Get the dragged project data to check if this is a different cell
          const draggedProjectData = boardData.projects.find(p => p.id === draggedProject);
          
          // Only allow drops to different cells
          if (draggedProjectData && (personId !== draggedProjectData.personId || timeSlotId !== draggedProjectData.timeSlotId)) {
            const distance = Math.abs(draggedCenter.y - (rect.top + rect.height / 2));
            if (distance < bestDistance) {
              bestDistance = distance;
              // For cross-cell drops, always append to the end
              bestMatch = { personId, timeSlotId, insertIndex: 0 };
            }
          }
        }
      });

      setDragOverCell(bestMatch);
    } catch (error) {
      console.error('Error updating drop target:', error);
    }
  };

  const handleAddProject = async (personId: string, timeSlotId: string) => {
    const projectId = generateId();
    const newProject: Project = {
      id: projectId,
      title: '',
      color: getRandomColor(),
      personId,
      timeSlotId,
    };
    
    const newData = {
      ...boardData,
      projects: [...boardData.projects, newProject]
    };

    setNewProjectId(projectId);

    try {
      await performOptimisticUpdate(newData, 'add project');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
      setNewProjectId(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const newData = {
      ...boardData,
      projects: boardData.projects.filter(p => p.id !== projectId)
    };
    
    try {
      await performOptimisticUpdate(newData, 'delete project');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const handleEditProject = async (updatedProject: Project) => {
    const newData = {
      ...boardData,
      projects: boardData.projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      )
    };
    
    // If this was a newly created project, focus the Add Project button
    if (newProjectId === updatedProject.id) {
      const buttonId = `add-project-${updatedProject.personId}-${updatedProject.timeSlotId}`;
      setTimeout(() => {
        const button = document.getElementById(buttonId);
        if (button) {
          button.focus();
        }
      }, 0);
    }
    
    setNewProjectId(null);
    
    try {
      await performOptimisticUpdate(newData, 'edit project');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    const originalProject = boardData.projects.find(p => p.id === projectId);
    if (!originalProject) return;

    const duplicatedProject: Project = {
      ...originalProject,
      id: generateId(),
      title: `${originalProject.title} (Copy)`
    };

    const newData = {
      ...boardData,
      projects: [...boardData.projects, duplicatedProject]
    };
    
    setNewProjectId(duplicatedProject.id); // Trigger editing mode for duplicated card
    
    try {
      await performOptimisticUpdate(newData, 'duplicate project');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
      setNewProjectId(null);
    }
  };

  const handleAddPerson = async (person: Person) => {
    const newData = {
      ...boardData,
      people: [...boardData.people, person]
    };
    
    try {
      await performOptimisticUpdate(newData, 'add person');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const handleRemovePerson = async (personId: string) => {
    const newData = {
      ...boardData,
      people: boardData.people.filter(p => p.id !== personId),
      projects: boardData.projects.filter(p => p.personId !== personId)
    };
    
    try {
      await performOptimisticUpdate(newData, 'remove person');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const handleUpdatePerson = async (updatedPerson: Person) => {
    const newData = {
      ...boardData,
      people: boardData.people.map(p => 
        p.id === updatedPerson.id ? updatedPerson : p
      )
    };
    
    try {
      await performOptimisticUpdate(newData, 'update person');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const handleMovePersonUp = async (personId: string) => {
    const currentIndex = boardData.people.findIndex(p => p.id === personId);
    if (currentIndex <= 0) return;

    const newPeople = [...boardData.people];
    [newPeople[currentIndex - 1], newPeople[currentIndex]] = [newPeople[currentIndex], newPeople[currentIndex - 1]];

    const newData = {
      ...boardData,
      people: newPeople
    };
    
    try {
      await performOptimisticUpdate(newData, 'move person up');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const handleMovePersonDown = async (personId: string) => {
    const currentIndex = boardData.people.findIndex(p => p.id === personId);
    if (currentIndex >= boardData.people.length - 1) return;

    const newPeople = [...boardData.people];
    [newPeople[currentIndex], newPeople[currentIndex + 1]] = [newPeople[currentIndex + 1], newPeople[currentIndex]];

    const newData = {
      ...boardData,
      people: newPeople
    };
    
    try {
      await performOptimisticUpdate(newData, 'move person down');
    } catch {
      // performOptimisticUpdate already handles rollback and error reporting
    }
  };

  const isDropTarget = (personId: string, timeSlotId: string) => {
    if (!draggedProject || !dragOverCell) return false;
    
    // Get the dragged project data
    const draggedProjectData = boardData.projects.find(p => p.id === draggedProject);
    if (!draggedProjectData) return false;
    
    // Only show drop indicators for different cells
    const isDifferentCell = personId !== draggedProjectData.personId || timeSlotId !== draggedProjectData.timeSlotId;
    return isDifferentCell && dragOverCell.personId === personId && dragOverCell.timeSlotId === timeSlotId;
  };

  const getInsertionIndex = (personId: string, timeSlotId: string) => {
    if (isDropTarget(personId, timeSlotId)) {
      return dragOverCell!.insertIndex;
    }
    return -1;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Check if the target or any parent has a context menu trigger
    const target = e.target as HTMLElement;
    const hasContextMenu = target.closest('[data-radix-context-menu-trigger]');
    
    // If not a context menu trigger, prevent the default context menu
    if (!hasContextMenu) {
      e.preventDefault();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative" onContextMenu={handleContextMenu}>
      {/* Left fade overlay */}
      <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
        showLeftFade ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Right fade overlay */}
      <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
        showRightFade ? 'opacity-100' : 'opacity-0'
      }`} />
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto">
        <div className="min-w-fit h-full">
          {/* Header - now inside scroll container */}
          <TeamPlanHeader
            timeSlots={boardData.timeSlots}
            onAddTimeSlot={onAddTimeSlot}
            onRemoveTimeSlot={onRemoveTimeSlot}
            onUpdateTimeSlot={onUpdateTimeSlot}
            onMoveTimeSlotLeft={onMoveTimeSlotLeft}
            onMoveTimeSlotRight={onMoveTimeSlotRight}
            hoveredColumn={currentHoveredColumn}
            onColumnMouseEnter={handleColumnMouseEnter}
            onColumnMouseLeave={handleColumnMouseLeave}
          />
          
          {/* Board Grid */}
          <div className="space-y-0 px-6 pb-6">
            {boardData.people.map((person, personIndex) => (
              <TeamPlanContextMenu
                key={person.id}
                type="person"
                canMoveUp={personIndex > 0}
                canMoveDown={personIndex < boardData.people.length - 1}
                canDelete={boardData.people.length > 1}
                onMoveUp={() => handleMovePersonUp(person.id)}
                onMoveDown={() => handleMovePersonDown(person.id)}
                onDelete={() => handleRemovePerson(person.id)}
                label={person.name}
              >
                <div className="grid gap-0 my-1" style={{ gridTemplateColumns: `130px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
                  {/* Person Column with Inline Editing */}
                  <PersonCell
                    person={person}
                    onUpdatePerson={handleUpdatePerson}
                  />
              
                {/* Project Cells */}
                {boardData.timeSlots.map(timeSlot => {
                  const cellProjects = getProjectsForCell(boardData.projects, person.id, timeSlot.id);
                  const isDropping = isDropTarget(person.id, timeSlot.id);
                  
                  return (
                    <TeamPlanContextMenu
                      key={`${person.id}-${timeSlot.id}`}
                      type="cell"
                      canMoveUp={personIndex > 0}
                      canMoveDown={personIndex < boardData.people.length - 1}
                      canDelete={boardData.people.length > 1}
                      onMoveUp={() => handleMovePersonUp(person.id)}
                      onMoveDown={() => handleMovePersonDown(person.id)}
                      onDelete={() => handleRemovePerson(person.id)}
                      onAddProject={() => handleAddProject(person.id, timeSlot.id)}
                      personName={person.name}
                    >
                      <motion.div
                        className={`min-h-12 p-1.5 pt-2 pb-2 transition-all duration-200 relative overflow-visible group ${
                          currentHoveredColumn === timeSlot.id ? 'bg-slate-100/70' : ''
                        }`}
                        data-drop-zone
                        data-person-id={person.id}
                        data-timeslot-id={timeSlot.id}
                        data-column-id={timeSlot.id}
                        role="region"
                        aria-label={`Projects for ${person.name} in ${timeSlot.label}`}
                        onMouseEnter={() => handleColumnMouseEnter(timeSlot.id)}
                        onMouseLeave={handleColumnMouseLeave}
                      >
                      {/* Inner drop target with glow effect */}
                      <div className={`absolute inset-2 rounded-lg transition-all duration-200 pointer-events-none ${
                        isDropping 
                          ? 'bg-gradient-to-b from-blue-200/20 via-blue-100/10 to-transparent transition-all duration-200' 
                          : ''
                      }`} />
                      
                      <div className="space-y-1.5 relative">
                          {/* Fixed insertion placeholder at the top */}
                          <div className="h-1 flex items-center justify-center">
                            <div
                              className={`w-8 h-0.5 bg-blue-400 rounded-full transition-all duration-150 ${
                                isDropping && getInsertionIndex(person.id, timeSlot.id) === 0 
                                  ? 'opacity-70 scale-x-100' 
                                  : 'opacity-0 scale-x-0'
                              }`}
                            />
                          </div>
                          
                          {cellProjects.map((project, index) => (
                            <motion.div 
                              key={project.id}
                              layout={!draggedProject}
                              initial={{ opacity: 0.8, y: 2 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 600,
                                damping: 50,
                                duration: 0.05
                              }}
                            >
                              <ProjectCard
                                project={project}
                                isDragging={draggedProject === project.id}
                                isDuplicating={isDuplicating && draggedProject === project.id}
                                isEditing={newProjectId === project.id}
                                availableGroups={getAvailableGroups()}
                                allProjects={boardData.projects}
                                isColorCodingEnabled={isColorCodingEnabled}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                                onDuplicate={handleDuplicateProject}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDrag={updateDropTarget}
                              />
                              
                              {/* Fixed insertion placeholder after each card */}
                              <div className="h-1 flex items-center justify-center">
                                <div
                                  className={`w-8 h-0.5 bg-blue-400 rounded-full transition-all duration-150 ${
                                    isDropping && getInsertionIndex(person.id, timeSlot.id) === index + 1
                                      ? 'opacity-70 scale-x-100'
                                      : 'opacity-0 scale-x-0'
                                  }`}
                                />
                              </div>
                            </motion.div>
                          ))}
                        
                        <Button
                          id={`add-project-${person.id}-${timeSlot.id}`}
                          variant="ghost"
                          onClick={() => handleAddProject(person.id, timeSlot.id)}
                          className="w-full p-2 rounded-lg text-xs text-slate-600 hover:text-slate-800 font-medium bg-transparent hover:bg-transparent border border-dashed border-slate-200 hover:border-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200 min-h-[2.5rem] flex items-center justify-center select-none"
                        >
                          <PlusIcon className="w-3 h-3 mr-1" />
                          Add Project
                        </Button>
                      </div>
                      </motion.div>
                    </TeamPlanContextMenu>
                  );
                })}
                
                {/* Delete Person Button */}
                <div className="min-h-12 flex items-start justify-center pt-5">
                  {boardData.people.length > 1 && (
                    <Button
                      onClick={() => handleRemovePerson(person.id)}
                      variant="ghost"
                      size="icon"
                      className="opacity-0 hover:opacity-100 transition-opacity size-7"
                      title="Remove person"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500 hover:text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244 2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  )}
                </div>
                </div>
              </TeamPlanContextMenu>
            ))}
            
            {/* Add Person Row */}
            <div className="grid gap-0" style={{ gridTemplateColumns: `130px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
              <AddPersonCell 
                onAddPerson={handleAddPerson}
                isDraggedOver={dragOverAddPerson}
                numTimeSlots={boardData.timeSlots.length}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (prevProps: TeamPlanBoardProps, nextProps: TeamPlanBoardProps) => {
  // Check if data reference changed
  if (prevProps.data !== nextProps.data) return false;
  
  // Check if callback functions changed
  if (prevProps.onChange !== nextProps.onChange) return false;
  if (prevProps.onDataSyncError !== nextProps.onDataSyncError) return false;
  
  // Check if color coding setting changed
  if (prevProps.isColorCodingEnabled !== nextProps.isColorCodingEnabled) return false;
  
  return true;
};

export default memo(TeamPlanBoard, arePropsEqual);