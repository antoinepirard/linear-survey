'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.setData('text/plain', projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, personId: string, timeSlotId: string) => {
    e.preventDefault();
    
    // Calculate insertion index based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const cellProjects = getProjectsForCell(boardData.projects, personId, timeSlotId);
    
    // Find all project card elements in this cell
    const projectElements = Array.from(e.currentTarget.querySelectorAll('[data-project-card]'));
    
    let insertIndex = 0;
    for (let i = 0; i < projectElements.length; i++) {
      const element = projectElements[i] as HTMLElement;
      const elementRect = element.getBoundingClientRect();
      const elementMiddle = elementRect.top + elementRect.height / 2 - rect.top;
      
      if (mouseY > elementMiddle) {
        insertIndex = i + 1;
      }
    }
    
    // If no projects, insert at 0
    if (cellProjects.length === 0) {
      insertIndex = 0;
    }
    
    setDragOverCell({ personId, timeSlotId, insertIndex });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, personId: string, timeSlotId: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    
    if (projectId && dragOverCell) {
      // Remove the dragged project from its current position
      const otherProjects = boardData.projects.filter(p => p.id !== projectId);
      const draggedProject = boardData.projects.find(p => p.id === projectId);
      
      if (draggedProject) {
        // Get projects in the target cell (excluding the dragged one)
        const cellProjects = otherProjects.filter(p => p.personId === personId && p.timeSlotId === timeSlotId);
        
        // Create updated project with new position
        const updatedProject = { ...draggedProject, personId, timeSlotId };
        
        // Insert at the correct position
        const insertIndex = Math.min(dragOverCell.insertIndex, cellProjects.length);
        cellProjects.splice(insertIndex, 0, updatedProject);
        
        // Combine with projects from other cells
        const otherCellProjects = otherProjects.filter(p => !(p.personId === personId && p.timeSlotId === timeSlotId));
        const allProjects = [...otherCellProjects, ...cellProjects];
        
        const newData = { ...boardData, projects: allProjects };
        setBoardData(newData);
        onChange?.(newData);
      }
    }
    
    setDraggedProject(null);
    setDragOverCell(null);
  };

  const handleAddProject = (personId: string, timeSlotId: string) => {
    const projectId = generateId();
    const newProject: Project = {
      id: projectId,
      title: 'New Project',
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
    onChange?.(newData);
    
    // Clear the new project editing state when editing is complete
    if (newProjectId === updatedProject.id) {
      setNewProjectId(null);
    }
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
              <div key={person.id} className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr))` }}>
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
                      className="min-h-20 p-3 border-b border-slate-200 transition-all duration-200 bg-white relative"
                      onDragOver={(e) => handleDragOver(e, person.id, timeSlot.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, person.id, timeSlot.id)}
                      role="region"
                      aria-label={`Projects for ${person.name} in ${timeSlot.label}`}
                    >
                      <div className="space-y-2">
                        <AnimatePresence>
                          {cellProjects.map((project, index) => (
                            <div key={project.id}>
                              {/* Insertion line above */}
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                  height: isDropping && getInsertionIndex(person.id, timeSlot.id) === index ? '2px' : 0,
                                  opacity: isDropping && getInsertionIndex(person.id, timeSlot.id) === index ? 1 : 0
                                }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-blue-400 rounded-full mx-0"
                                style={{ minHeight: isDropping && getInsertionIndex(person.id, timeSlot.id) === index ? '2px' : 0 }}
                              />
                              
                              <ProjectCard
                                project={project}
                                isDragging={draggedProject === project.id}
                                isEditing={newProjectId === project.id}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                                onDragStart={handleDragStart}
                              />
                            </div>
                          ))}
                          
                          {/* Insertion line for end position */}
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: isDropping && getInsertionIndex(person.id, timeSlot.id) === cellProjects.length ? '2px' : 0,
                              opacity: isDropping && getInsertionIndex(person.id, timeSlot.id) === cellProjects.length ? 1 : 0
                            }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-blue-400 rounded-full mx-0"
                            style={{ minHeight: isDropping && getInsertionIndex(person.id, timeSlot.id) === cellProjects.length ? '2px' : 0 }}
                          />
                        </AnimatePresence>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddProject(person.id, timeSlot.id)}
                          className="w-full border border-dashed border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600 text-xs opacity-0 hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Project
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
            
            {/* Add Person Row */}
            <div className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr))` }}>
              <AddPersonCell onAddPerson={handleAddPerson} />
              {boardData.timeSlots.map(timeSlot => (
                <div key={`add-person-${timeSlot.id}`} className=" bg-white min-h-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}