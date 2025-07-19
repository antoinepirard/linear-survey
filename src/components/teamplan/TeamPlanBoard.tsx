'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TeamPlanData, Project, TimeSlot, Person, DEFAULT_TEAMPLAN_DATA, getProjectsForCell, generateId, getRandomColor } from '@/data/teamplan';
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
  const [dragOverCell, setDragOverCell] = useState<{ personId: string; timeSlotId: string; insertIndex: number } | null>(null);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [draggedProjectData, setDraggedProjectData] = useState<Project | null>(null);

  const handleDragStart = (projectId: string) => {
    const project = boardData.projects.find(p => p.id === projectId);
    setDraggedProject(projectId);
    setDraggedProjectData(project || null);
  };

  const handleDragEnd = () => {
    // Use a timeout to ensure the drag animation completes before updating
    setTimeout(() => {
      // Check if we have a valid drop target
      if (dragOverCell && draggedProjectData) {
        const { personId, timeSlotId, insertIndex } = dragOverCell;
        
        // Remove the dragged project from its current position
        const otherProjects = boardData.projects.filter(p => p.id !== draggedProjectData.id);
        
        // Get projects in the target cell (excluding the dragged one)
        const cellProjects = otherProjects.filter(p => p.personId === personId && p.timeSlotId === timeSlotId);
        
        // Create updated project with new position
        const updatedProject = { ...draggedProjectData, personId, timeSlotId };
        
        // Insert at the correct position
        const finalInsertIndex = Math.min(insertIndex, cellProjects.length);
        cellProjects.splice(finalInsertIndex, 0, updatedProject);
        
        // Combine with projects from other cells
        const otherCellProjects = otherProjects.filter(p => !(p.personId === personId && p.timeSlotId === timeSlotId));
        const allProjects = [...otherCellProjects, ...cellProjects];
        
        const newData = { ...boardData, projects: allProjects };
        setBoardData(newData);
        onChange?.(newData);
      }
      
      // Clear drag state
      setDraggedProject(null);
      setDraggedProjectData(null);
      setDragOverCell(null);
    }, 0);
  };

  // Position-based drop detection for Framer Motion drag
  const updateDropTarget = (draggedElement: HTMLElement) => {
    if (!draggedProject) return;

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
        const personId = cellElement.getAttribute('data-person-id')!;
        const timeSlotId = cellElement.getAttribute('data-timeslot-id')!;
        
        // Calculate insertion index based on vertical position        
        const projectElements = Array.from(cellElement.querySelectorAll('[data-project-card]'));
        let insertIndex = 0;
        
        for (let i = 0; i < projectElements.length; i++) {
          const element = projectElements[i] as HTMLElement;
          const elementRect = element.getBoundingClientRect();
          const elementMiddle = elementRect.top + elementRect.height / 2;
          
          if (draggedCenter.y > elementMiddle) {
            insertIndex = i + 1;
          }
        }
        
        const distance = Math.abs(draggedCenter.y - (cellRect.top + cellRect.height / 2));
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = { personId, timeSlotId, insertIndex };
        }
      }
    });

    setDragOverCell(bestMatch);
  };

  const handleAddProject = (personId: string, timeSlotId: string) => {
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
    return dragOverCell?.personId === personId && dragOverCell?.timeSlotId === timeSlotId;
  };

  const getInsertionIndex = (personId: string, timeSlotId: string) => {
    if (dragOverCell?.personId === personId && dragOverCell?.timeSlotId === timeSlotId) {
      return dragOverCell.insertIndex;
    }
    return -1;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
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
              <div key={person.id} className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
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
                      className="min-h-20 p-3 pt-4 pb-4 border-b border-dashed border-slate-200 transition-all duration-200 bg-white relative overflow-visible group"
                      data-drop-zone
                      data-person-id={person.id}
                      data-timeslot-id={timeSlot.id}
                      role="region"
                      aria-label={`Projects for ${person.name} in ${timeSlot.label}`}
                    >
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {/* Fixed insertion placeholder at the top */}
                          <motion.div 
                            className="h-1 flex items-center justify-center"
                            layout
                          >
                            <motion.div
                              initial={{ opacity: 0, scaleX: 0 }}
                              animate={{ 
                                opacity: isDropping && getInsertionIndex(person.id, timeSlot.id) === 0 ? 0.7 : 0,
                                scaleX: isDropping && getInsertionIndex(person.id, timeSlot.id) === 0 ? 1 : 0
                              }}
                              exit={{ opacity: 0, scaleX: 0 }}
                              transition={{ 
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                duration: 0.15 
                              }}
                              className="w-8 h-0.5 bg-blue-400 rounded-full"
                            />
                          </motion.div>
                          
                          {cellProjects.map((project, index) => (
                            <motion.div 
                              key={project.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                              }}
                            >
                              <ProjectCard
                                project={project}
                                isDragging={draggedProject === project.id}
                                isEditing={newProjectId === project.id}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDrag={updateDropTarget}
                              />
                              
                              {/* Fixed insertion placeholder after each card */}
                              <motion.div 
                                className="h-1 flex items-center justify-center"
                                layout
                              >
                                <motion.div
                                  initial={{ opacity: 0, scaleX: 0 }}
                                  animate={{ 
                                    opacity: isDropping && getInsertionIndex(person.id, timeSlot.id) === index + 1 ? 0.7 : 0,
                                    scaleX: isDropping && getInsertionIndex(person.id, timeSlot.id) === index + 1 ? 1 : 0
                                  }}
                                  exit={{ opacity: 0, scaleX: 0 }}
                                  transition={{ 
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.15 
                                  }}
                                  className="w-8 h-0.5 bg-blue-400 rounded-full"
                                />
                              </motion.div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        <Button
                          id={`add-project-${person.id}-${timeSlot.id}`}
                          variant="ghost"
                          onClick={() => handleAddProject(person.id, timeSlot.id)}
                          className="w-full p-3 rounded-lg text-xs text-slate-600 hover:text-slate-800 font-medium bg-slate-50 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-200 min-h-[3.25rem] flex items-center justify-center"
                        >
                          <PlusIcon className="w-3 h-3 mr-1" />
                          Add Project
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Empty cell for the add column */}
                <div className="min-h-20 border-b border-dashed border-slate-200 bg-white" />
              </div>
            ))}
            
            {/* Add Person Row */}
            <div className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
              <AddPersonCell onAddPerson={handleAddPerson} />
              {boardData.timeSlots.map(timeSlot => (
                <div key={`add-person-${timeSlot.id}`} className=" bg-white min-h-16" />
              ))}
              
              {/* Empty cell for the add column */}
              <div className="bg-white min-h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}