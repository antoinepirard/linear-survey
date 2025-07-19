'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamPlanData, Project, TimeSlot, Person, DEFAULT_TEAMPLAN_DATA, getProjectsForCell, generateId, getRandomColor } from '@/data/teamplan';
import ProjectCard from './ProjectCard';
import TimelineHeader from './TimelineHeader';
import PersonManagement from './PersonManagement';
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
  const [dragOverCell, setDragOverCell] = useState<{ personId: string; timeSlotId: string } | null>(null);

  const handleDragStart = (projectId: string) => {
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent, personId: string, timeSlotId: string) => {
    e.preventDefault();
    setDragOverCell({ personId, timeSlotId });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, personId: string, timeSlotId: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    
    if (projectId && draggedProject) {
      const updatedProjects = boardData.projects.map(project =>
        project.id === projectId
          ? { ...project, personId, timeSlotId }
          : project
      );
      
      const newData = { ...boardData, projects: updatedProjects };
      setBoardData(newData);
      onChange?.(newData);
    }
    
    setDraggedProject(null);
    setDragOverCell(null);
  };

  const handleAddProject = (personId: string, timeSlotId: string) => {
    const newProject: Project = {
      id: generateId(),
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
  };

  const handleDeleteProject = (projectId: string) => {
    const newData = {
      ...boardData,
      projects: boardData.projects.filter(p => p.id !== projectId)
    };
    setBoardData(newData);
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

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Person Management Sidebar */}
      <div className="w-full lg:w-80 lg:flex-shrink-0">
        <h3 className="font-semibold text-slate-700 mb-4">Team Members</h3>
        <PersonManagement
          people={boardData.people}
          onAddPerson={handleAddPerson}
          onRemovePerson={handleRemovePerson}
          onUpdatePerson={handleUpdatePerson}
        />
      </div>

      {/* Main Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-fit">
          {/* Header */}
          <TimelineHeader
            timeSlots={boardData.timeSlots}
            onAddTimeSlot={handleAddTimeSlot}
            onRemoveTimeSlot={handleRemoveTimeSlot}
            onUpdateTimeSlot={handleUpdateTimeSlot}
          />

          {/* Board Grid */}
          <div className="space-y-2">
            {boardData.people.map(person => (
              <div key={person.id} className="grid gap-2" style={{ gridTemplateColumns: `180px repeat(${boardData.timeSlots.length}, minmax(200px, 1fr))` }}>
                {/* Person Column */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-center min-h-20">
                  <h4 className="font-medium text-slate-900 text-sm">{person.name}</h4>
                  {person.role && (
                    <p className="text-xs text-slate-500">{person.role}</p>
                  )}
                </div>
              
              {/* Project Cells */}
              {boardData.timeSlots.map(timeSlot => {
                const cellProjects = getProjectsForCell(boardData.projects, person.id, timeSlot.id);
                const isDropping = isDropTarget(person.id, timeSlot.id);
                
                return (
                  <motion.div
                    key={`${person.id}-${timeSlot.id}`}
                    className={`
                      min-h-32 p-3 border-2 border-dashed rounded-lg transition-all duration-200
                      ${isDropping 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }
                    `}
                    onDragOver={(e) => handleDragOver(e, person.id, timeSlot.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, person.id, timeSlot.id)}
                    role="region"
                    aria-label={`Projects for ${person.name} in ${timeSlot.label}`}
                  >
                    <div className="space-y-2">
                      <AnimatePresence>
                        {cellProjects.map(project => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            isDragging={draggedProject === project.id}
                            onDelete={handleDeleteProject}
                          />
                        ))}
                      </AnimatePresence>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddProject(person.id, timeSlot.id)}
                        className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </div>
        </div>
      </div>
    </div>
  );
}