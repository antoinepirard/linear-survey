'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TeamPlanData, Project, TimeSlot, Person, DEFAULT_TEAMPLAN_DATA, getProjectsForCell, generateId, getRandomColor, getAllGroups } from '@/data/teamplan';
import ProjectCard from './ProjectCard';
import TimelineHeader from './TimelineHeader';
import PersonCell from './PersonCell';
import AddPersonCell from './AddPersonCell';
import TeamPlanContextMenu from './TeamPlanContextMenu';
import { Button } from '@/components/ui/button';

interface TeamPlanBoardProps {
  data?: TeamPlanData;
  onChange?: (data: TeamPlanData) => void;
  isColorCodingEnabled?: boolean;
}

// Utility functions for time slot sequence management
const shouldShiftSubsequentSlots = (originalLabel: string, newLabel: string): boolean => {
  // Only shift if both labels follow a recognizable sequence pattern
  return isSequencePattern(originalLabel) && isSequencePattern(newLabel);
};

const isSequencePattern = (label: string): boolean => {
  const patterns = [
    /^q(\d+)$/i,                    // Q1, Q2, etc.
    /^(quarter)\s+(\d+)$/i,         // Quarter 1, Quarter 2
    /^(week)\s+(\d+)$/i,            // Week 1, Week 2
    /^(month)\s+(\d+)$/i,           // Month 1, Month 2
    /^(\d{4})$/,                    // 2024, 2025
    /^(year)\s+(\d+)$/i,            // Year 2023, Year 2024
    /^([a-zA-Z]+)\s+(\d+)$/i        // Phase 1, Sprint 2, etc.
  ];
  
  return patterns.some(pattern => pattern.test(label.trim()));
};

const generateSequenceLabels = (startLabel: string, count: number): string[] => {
  const labels = [startLabel];
  
  if (count <= 0) return labels;
  
  // Handle different sequence patterns
  const quarterMatch = startLabel.match(/^q(\d+)$/i);
  if (quarterMatch) {
    const startNumber = parseInt(quarterMatch[1]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Q${startNumber + i}`);
    }
    return labels;
  }

  const quarterFullMatch = startLabel.match(/^(quarter)\s+(\d+)$/i);
  if (quarterFullMatch) {
    const startNumber = parseInt(quarterFullMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Quarter ${startNumber + i}`);
    }
    return labels;
  }

  const weekMatch = startLabel.match(/^(week)\s+(\d+)$/i);
  if (weekMatch) {
    const startNumber = parseInt(weekMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Week ${startNumber + i}`);
    }
    return labels;
  }

  const monthMatch = startLabel.match(/^(month)\s+(\d+)$/i);
  if (monthMatch) {
    const startNumber = parseInt(monthMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Month ${startNumber + i}`);
    }
    return labels;
  }

  const yearMatch = startLabel.match(/^(\d{4})$/);
  if (yearMatch) {
    const startNumber = parseInt(yearMatch[1]);
    for (let i = 1; i <= count; i++) {
      labels.push(`${startNumber + i}`);
    }
    return labels;
  }

  const yearFullMatch = startLabel.match(/^(year)\s+(\d+)$/i);
  if (yearFullMatch) {
    const startNumber = parseInt(yearFullMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Year ${startNumber + i}`);
    }
    return labels;
  }

  const genericMatch = startLabel.match(/^([a-zA-Z]+)\s+(\d+)$/i);
  if (genericMatch) {
    const prefix = genericMatch[1];
    const startNumber = parseInt(genericMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`${prefix} ${startNumber + i}`);
    }
    return labels;
  }
  
  return labels;
};

export default function TeamPlanBoard({ 
  data = DEFAULT_TEAMPLAN_DATA, 
  onChange,
  isColorCodingEnabled = true
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
      setBoardData(newData);
      if (newProjectForFocus) {
        setNewProjectId(newProjectForFocus.id);
      }

      try {
        onChange?.(newData);
      } catch (error) {
        console.error("Failed to update after drag and drop:", error);
        setBoardData(originalData);
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

      // Check if dragging over add person zone first
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
    const originalData = boardData;
    const projectId = generateId();
    const newProject: Project = {
      id: projectId,
      title: '',
      color: getRandomColor(),
      personId,
      timeSlotId,
    };
    
    const newData = {
      ...originalData,
      projects: [...originalData.projects, newProject]
    };

    setBoardData(newData);
    setNewProjectId(projectId);

    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to add project:", error);
      setBoardData(originalData); // Rollback on failure
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      projects: originalData.projects.filter(p => p.id !== projectId)
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setBoardData(originalData);
    }
  };

  const handleEditProject = (updatedProject: Project) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      projects: originalData.projects.map(p => 
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
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to edit project:", error);
      setBoardData(originalData);
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const originalData = boardData;
    const originalProject = originalData.projects.find(p => p.id === projectId);
    if (!originalProject) return;

    const duplicatedProject: Project = {
      ...originalProject,
      id: generateId(),
      title: `${originalProject.title} (Copy)`
    };

    const newData = {
      ...originalData,
      projects: [...originalData.projects, duplicatedProject]
    };
    setBoardData(newData);
    setNewProjectId(duplicatedProject.id); // Trigger editing mode for duplicated card
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to duplicate project:", error);
      setBoardData(originalData);
    }
  };

  const handleAddTimeSlot = (timeSlot: TimeSlot) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      timeSlots: [...originalData.timeSlots, timeSlot]
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to add time slot:", error);
      setBoardData(originalData);
    }
  };


  const handleUpdateTimeSlot = (updatedTimeSlot: TimeSlot) => {
    const originalData = boardData;
    const timeSlotIndex = originalData.timeSlots.findIndex(ts => ts.id === updatedTimeSlot.id);
    if (timeSlotIndex === -1) return;

    const updatedTimeSlots = [...originalData.timeSlots];
    const originalLabel = updatedTimeSlots[timeSlotIndex].label;
    updatedTimeSlots[timeSlotIndex] = updatedTimeSlot;

    // Auto-shift subsequent time slots if the pattern changed
    const shouldShift = shouldShiftSubsequentSlots(originalLabel, updatedTimeSlot.label);
    if (shouldShift) {
      const nextSequenceLabels = generateSequenceLabels(updatedTimeSlot.label, updatedTimeSlots.length - timeSlotIndex - 1);
      for (let i = 1; i < nextSequenceLabels.length; i++) {
        const targetIndex = timeSlotIndex + i;
        if (targetIndex < updatedTimeSlots.length) {
          updatedTimeSlots[targetIndex] = {
            ...updatedTimeSlots[targetIndex],
            label: nextSequenceLabels[i]
          };
        }
      }
    }

    const newData = {
      ...originalData,
      timeSlots: updatedTimeSlots
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to update time slot:", error);
      setBoardData(originalData);
    }
  };

  const handleAddPerson = (person: Person) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      people: [...originalData.people, person]
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to add person:", error);
      setBoardData(originalData);
    }
  };

  const handleRemovePerson = (personId: string) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      people: originalData.people.filter(p => p.id !== personId),
      projects: originalData.projects.filter(p => p.personId !== personId)
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to remove person:", error);
      setBoardData(originalData);
    }
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      people: originalData.people.map(p => 
        p.id === updatedPerson.id ? updatedPerson : p
      )
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to update person:", error);
      setBoardData(originalData);
    }
  };

  const handleMovePersonUp = (personId: string) => {
    const originalData = boardData;
    const currentIndex = originalData.people.findIndex(p => p.id === personId);
    if (currentIndex <= 0) return;

    const newPeople = [...originalData.people];
    [newPeople[currentIndex - 1], newPeople[currentIndex]] = [newPeople[currentIndex], newPeople[currentIndex - 1]];

    const newData = {
      ...originalData,
      people: newPeople
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to move person up:", error);
      setBoardData(originalData);
    }
  };

  const handleMovePersonDown = (personId: string) => {
    const originalData = boardData;
    const currentIndex = originalData.people.findIndex(p => p.id === personId);
    if (currentIndex >= originalData.people.length - 1) return;

    const newPeople = [...originalData.people];
    [newPeople[currentIndex], newPeople[currentIndex + 1]] = [newPeople[currentIndex + 1], newPeople[currentIndex]];

    const newData = {
      ...originalData,
      people: newPeople
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to move person down:", error);
      setBoardData(originalData);
    }
  };

  const handleMoveTimeSlotLeft = (timeSlotId: string) => {
    const originalData = boardData;
    const currentIndex = originalData.timeSlots.findIndex(t => t.id === timeSlotId);
    if (currentIndex <= 0) return;

    const newTimeSlots = [...originalData.timeSlots];
    [newTimeSlots[currentIndex - 1], newTimeSlots[currentIndex]] = [newTimeSlots[currentIndex], newTimeSlots[currentIndex - 1]];

    const newData = {
      ...originalData,
      timeSlots: newTimeSlots
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to move time slot left:", error);
      setBoardData(originalData);
    }
  };

  const handleMoveTimeSlotRight = (timeSlotId: string) => {
    const originalData = boardData;
    const currentIndex = originalData.timeSlots.findIndex(t => t.id === timeSlotId);
    if (currentIndex >= originalData.timeSlots.length - 1) return;

    const newTimeSlots = [...originalData.timeSlots];
    [newTimeSlots[currentIndex], newTimeSlots[currentIndex + 1]] = [newTimeSlots[currentIndex + 1], newTimeSlots[currentIndex]];

    const newData = {
      ...originalData,
      timeSlots: newTimeSlots
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to move time slot right:", error);
      setBoardData(originalData);
    }
  };

  const handleDeleteTimeSlot = (timeSlotId: string) => {
    const originalData = boardData;
    const newData = {
      ...originalData,
      timeSlots: originalData.timeSlots.filter(t => t.id !== timeSlotId),
      projects: originalData.projects.filter(p => p.timeSlotId !== timeSlotId)
    };
    setBoardData(newData);
    try {
      onChange?.(newData);
    } catch (error) {
      console.error("Failed to delete time slot:", error);
      setBoardData(originalData);
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
        className="flex-1 overflow-auto p-6">
        <div className="min-w-fit h-full">
          {/* Header */}
          <TimelineHeader
            timeSlots={boardData.timeSlots}
            onAddTimeSlot={handleAddTimeSlot}
            onRemoveTimeSlot={handleDeleteTimeSlot}
            onUpdateTimeSlot={handleUpdateTimeSlot}
            onMoveTimeSlotLeft={handleMoveTimeSlotLeft}
            onMoveTimeSlotRight={handleMoveTimeSlotRight}
          />

          {/* Board Grid */}
          <div className="space-y-0">
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
                <div className="grid gap-0 bg-slate-100/60 rounded-lg my-1 p-1.5 group/row" style={{ gridTemplateColumns: `130px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
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
                      className="opacity-0 group-hover/row:opacity-100 transition-opacity size-7"
                      title="Remove person"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500 hover:text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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