import React from 'react';
import { projects } from '@/data/projects';

export default function ProjectsTable() {
  // Group projects by year for sticky year headers
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = [];
    }
    acc[project.year].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 sticky top-0 z-20 border-b border-slate-200">
        <div className="flex">
          <div className="w-20 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Year</div>
          <div className="flex-1 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project Name</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-white">
        {years.map((year) => (
          <div key={year}>
            {/* Sticky Year Header */}
            <div className="sticky top-12 z-10 bg-white border-b border-slate-100">
              <div className="flex">
                <div className="w-20 px-6 py-3 text-sm font-semibold text-slate-900">{year}</div>
                <div className="flex-1 px-6 py-3"></div>
              </div>
            </div>
            
            {/* Projects for this year */}
            {projectsByYear[year].map((project, index) => (
              <div key={`${year}-${index}`} className="flex border-b border-slate-50 hover:bg-slate-25">
                <div className="w-20 px-6 py-4"></div>
                <div className="flex-1 px-6 py-4 text-sm text-slate-900 truncate" title={project.projectName}>
                  {project.projectName}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}