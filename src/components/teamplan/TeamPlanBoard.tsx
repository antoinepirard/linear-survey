'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TeamPlanData, Project, TimeSlot, Person, DEFAULT_TEAMPLAN_DATA, getProjectsForCell, generateId, getRandomColor, getAllGroups } from '@/data/teamplan';
import ProjectCard from './ProjectCard';
import TimelineHeader from './TimelineHeader';
import PersonCell from './PersonCell';
import AddPersonCell from './AddPersonCell';
import { Button } from '@/components/ui/button';

interface TeamPlanBoardProps {
  data?: TeamPlanData;
  onChange?: (data: TeamPlanData) => void;
}

export default function TeamPlanBoard({ 
  data = DEFAULT_TEAMPLAN_DATA, 
  onChange 
}: TeamPlanBoardProps) {
  const [boardData, setBoardData] = useState<TeamPlanData>(data);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [dragOverCell, setDragOverCell] = useState<{ personId: string; timeSlotId: string; insertIndex: number } | null>(null);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [draggedProjectData, setDraggedProjectData] = useState<Project | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Get all unique groups from existing projects
  const getAvailableGroups = () => getAllGroups(boardData.projects);

  const handleDragStart = (projectId: string, isDuplicate: boolean) => {
    const project = boardData.projects.find(p => p.id === projectId);
    if (!project) {
      console.warn(`Project with id ${projectId} not found`);
      return;
    }
    setDraggedProject(projectId);
    setDraggedProjectData(project);
    setIsDuplicating(isDuplicate);
  };

  const handleDragEnd = () => {
    console.log('🎯 TeamPlanBoard: handleDragEnd called');
    // Keep a reference to the drag state to use after clearing
    const currentDragOverCell = dragOverCell;
    const currentDraggedProjectData = draggedProjectData;
    
    // Check if we have a valid drop target and dragged project data
    if (currentDragOverCell && currentDraggedProjectData) {
      const { personId, timeSlotId } = currentDragOverCell;
      console.log('🚚 TeamPlanBoard: Moving project', currentDraggedProjectData.id, 'to', personId, timeSlotId);

      if (isDuplicating) {
        const newProject = {
          ...currentDraggedProjectData,
          id: generateId(),
          personId,
          timeSlotId,
        };
        const newData = {
          ...boardData,
          projects: [...boardData.projects, newProject],
        };
        setBoardData(newData);
        onChange?.(newData);
      } else {
        // Only allow drops to different cells (no reordering within same cell)
        if (personId !== currentDraggedProjectData.personId || timeSlotId !== currentDraggedProjectData.timeSlotId) {
          // Create updated project with new position
          const updatedProject = { ...currentDraggedProjectData, personId, timeSlotId };
          
          // Update the projects array
          const newData = {
            ...boardData,
            projects: boardData.projects.map(p => 
              p.id === currentDraggedProjectData.id ? updatedProject : p
            )
          };
          setBoardData(newData);
          console.log('📤 TeamPlanBoard: Calling onChange with updated data (drag end)');
          onChange?.(newData);
        } else {
          console.log('🚫 TeamPlanBoard: No position change detected, skipping onChange');
        }
      }
    } else {
      console.log('🚫 TeamPlanBoard: No valid drop target, skipping onChange');
    }
    
    // Clear drag state after data updates to prevent animation glitches
    setDraggedProject(null);
    setDraggedProjectData(null);
    setDragOverCell(null);
    setIsDuplicating(false);
  };

  // Position-based drop detection for Framer Motion drag
  const updateDropTarget = (draggedElement: HTMLElement) => {
    if (!draggedProject || !draggedElement) return;

    try {
      const draggedRect = draggedElement.getBoundingClientRect();
      const draggedCenter = {
        x: draggedRect.left + draggedRect.width / 2,
        y: draggedRect.top + draggedRect.height / 2
      };

      // Find all drop zone cells
      const cells = document.querySelectorAll('[data-drop-zone]');
      let bestMatch: { personId: string; timeSlotId: string; insertIndex: number } | null = null;
      let bestDistance = Infinity;

      cells.forEach(cell => {
        const cellElement = cell as HTMLElement;
        const cellRect = cellElement.getBoundingClientRect();
        
        // Check if drag center is over this cell
        if (
          draggedCenter.x >= cellRect.left &&
          draggedCenter.x <= cellRect.right &&
          draggedCenter.y >= cellRect.top &&
          draggedCenter.y <= cellRect.bottom
        ) {
          const personId = cellElement.getAttribute('data-person-id');
          const timeSlotId = cellElement.getAttribute('data-timeslot-id');
          
          if (!personId || !timeSlotId) {
            console.warn('Drop zone missing required data attributes');
            return;
          }
          
          // Get the dragged project data to check if this is a different cell
          const draggedProjectData = boardData.projects.find(p => p.id === draggedProject);
          
          // Only allow drops to different cells
          if (draggedProjectData && (personId !== draggedProjectData.personId || timeSlotId !== draggedProjectData.timeSlotId)) {
            const distance = Math.abs(draggedCenter.y - (cellRect.top + cellRect.height / 2));
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

  const handleAddProject = (personId: string, timeSlotId: string) => {
    console.log('➕ TeamPlanBoard: handleAddProject called for person:', personId, 'timeSlot:', timeSlotId);
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
    setBoardData(newData);
    console.log('📤 TeamPlanBoard: Calling onChange with updated data (add project)');
    onChange?.(newData);
    
    // Set this project as the one being edited
    setNewProjectId(projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    const newData = {
      ...boardData,
      projects: boardData.projects.filter(p => p.id !== projectId)
    };
    setBoardData(newData);
    onChange?.(newData);
  };

  const handleEditProject = (updatedProject: Project) => {
    console.log('🎯 TeamPlanBoard: handleEditProject called for project:', updatedProject.id, updatedProject.title);
    const newData = {
      ...boardData,
      projects: boardData.projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      )
    };
    setBoardData(newData);
    
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
    console.log('📤 TeamPlanBoard: Calling onChange with updated data (edit project)');
    onChange?.(newData);
  };

  const handleAddTimeSlot = (timeSlot: TimeSlot) => {
    const newData = {
      ...boardData,
      timeSlots: [...boardData.timeSlots, timeSlot]
    };
    setBoardData(newData);
    onChange?.(newData);
  };

  const handleRemoveTimeSlot = (timeSlotId: string) => {
    const newData = {
      ...boardData,
      timeSlots: boardData.timeSlots.filter(ts => ts.id !== timeSlotId),
      projects: boardData.projects.filter(p => p.timeSlotId !== timeSlotId)
    };
    setBoardData(newData);
    onChange?.(newData);
  };

  const handleUpdateTimeSlot = (updatedTimeSlot: TimeSlot) => {
    const newData = {
      ...boardData,
      timeSlots: boardData.timeSlots.map(ts => 
        ts.id === updatedTimeSlot.id ? updatedTimeSlot : ts
      )
    };
    setBoardData(newData);
    onChange?.(newData);
  };

  const handleAddPerson = (person: Person) => {
    const newData = {
      ...boardData,
      people: [...boardData.people, person]
    };
    setBoardData(newData);
    onChange?.(newData);
  };

  const handleRemovePerson = (personId: string) => {
    const newData = {
      ...boardData,
      people: boardData.people.filter(p => p.id !== personId),
      projects: boardData.projects.filter(p => p.personId !== personId)
    };
    setBoardData(newData);
    onChange?.(newData);
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    const newData = {
      ...boardData,
      people: boardData.people.map(p => 
        p.id === updatedPerson.id ? updatedPerson : p
      )
    };
    setBoardData(newData);
    onChange?.(newData);
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

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
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
        className="flex-1 overflow-auto p-6">
        <div className="min-w-fit h-full">
          {/* Header */}
          <TimelineHeader
            timeSlots={boardData.timeSlots}
            onAddTimeSlot={handleAddTimeSlot}
            onRemoveTimeSlot={handleRemoveTimeSlot}
            onUpdateTimeSlot={handleUpdateTimeSlot}
          />

          {/* Board Grid */}
          <div className="space-y-0">
            {boardData.people.map((person) => (
              <div key={person.id} className="grid gap-0 bg-slate-50 rounded-lg my-1 p-1.5" style={{ gridTemplateColumns: `130px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
                {/* Person Column with Inline Editing */}
                <PersonCell
                  person={person}
                  onUpdatePerson={handleUpdatePerson}
                  onRemovePerson={handleRemovePerson}
                  canRemove={boardData.people.length > 1}
                />
              
                {/* Project Cells */}
                {boardData.timeSlots.map(timeSlot => {
                  const cellProjects = getProjectsForCell(boardData.projects, person.id, timeSlot.id);
                  const isDropping = isDropTarget(person.id, timeSlot.id);
                  
                  return (
                    <motion.div
                      key={`${person.id}-${timeSlot.id}`}
                      className="min-h-12 p-1.5 pt-2 pb-2 transition-all duration-20 relative overflow-visible group"
                      data-drop-zone
                      data-person-id={person.id}
                      data-timeslot-id={timeSlot.id}
                      role="region"
                      aria-label={`Projects for ${person.name} in ${timeSlot.label}`}
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
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
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
                  );
                })}
                
                {/* Empty cell for the add column */}
                <div className="min-h-12" />
              </div>
            ))}
            
            {/* Add Person Row */}
            <div className="grid gap-0" style={{ gridTemplateColumns: `130px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
              <AddPersonCell onAddPerson={handleAddPerson} />
              {boardData.timeSlots.map(timeSlot => (
                <div key={`add-person-${timeSlot.id}`} className="min-h-12" />
              ))}
              
              {/* Empty cell for the add column */}
              <div className="min-h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}