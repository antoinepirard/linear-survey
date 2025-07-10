import React from 'react';
import { projects, Project } from '@/data/projects';

interface ProjectsTableProps {
  onProjectHover?: (project: Project | null) => void;
}

export default function ProjectsTable({ onProjectHover }: ProjectsTableProps) {
  // Sort all projects by year (newest first)
  const sortedProjects = [...projects].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  return (
    <div className="space-y-1">
      {sortedProjects.map((project, index) => (
        <div 
          key={`${project.year}-${index}`}
          className="py-3 px-1 border-b border-slate-100 transition-colors duration-200 hover:border-slate-200 cursor-pointer"
          onMouseEnter={() => onProjectHover?.(project)}
          onMouseLeave={() => onProjectHover?.(null)}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              {project.projectName}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {project.year}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}