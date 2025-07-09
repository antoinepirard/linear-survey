import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '@/data/projects';

export default function ProjectsTable() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [previewPosition, setPreviewPosition] = useState(0);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Sort all projects by year (newest first)
  const sortedProjects = [...projects].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  return (
    <div className="relative">
      <div className="max-w-4xl flex">
        {/* Timeline */}
        <div className="py-8 px-4 max-w-md flex-shrink-0">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200"></div>
            
            {sortedProjects.map((project, index) => {
              const isNewYear = index === 0 || project.year !== sortedProjects[index - 1].year;
              
              return (
                <div key={`${project.year}-${index}`} className="relative">
                  {/* Year marker */}
                  {isNewYear && (
                    <div className="relative flex items-center mb-4">
                      <div className="absolute left-8 top-1/2 w-2 h-2 bg-blue-500 ring-3 ring-blue-50 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                      <div className="ml-16 bg-slate-100 rounded-full px-3 py-1">
                        <span className="text-sm font-semibold text-slate-700">{project.year}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Project item */}
                  <div className="relative flex items-center mb-1">
                    <div className="absolute left-8 w-3 h-3 bg-white border-1 border-slate-200 rounded-full transform -translate-x-1/2 z-10"></div>
                    <div className="ml-12 flex-1">
                      <div 
                        ref={(el) => { itemRefs.current[project.projectName] = el; }}
                        className="py-4 px-4 hover:bg-slate-50 transition-colors duration-200 rounded cursor-pointer relative"
                        onMouseEnter={(e) => {
                          setHoveredProject(project);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const timelineContainer = e.currentTarget.closest('.py-8');
                          const previewContainer = timelineContainer?.parentElement?.querySelector('.py-8.px-6');
                          
                          if (timelineContainer && previewContainer) {
                            const timelineRect = timelineContainer.getBoundingClientRect();
                            const previewRect = previewContainer.getBoundingClientRect();
                            // Calculate position relative to timeline, then adjust for preview container offset
                            const relativePosition = rect.top - timelineRect.top;
                            const containerOffset = timelineRect.top - previewRect.top;
                            setPreviewPosition(relativePosition + containerOffset);
                          }
                        }}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <div className="text-sm font-medium text-slate-900">
                          {project.projectName}
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Tracking Preview Container */}
        <div className="py-8 px-6 flex-1 relative">
          <motion.div 
            className="absolute left-6 w-[400px]"
            animate={{ 
              opacity: hoveredProject ? 1 : 0,
              y: previewPosition
            }}
            transition={{ 
              opacity: { duration: 0.15, ease: "easeOut" },
              y: { duration: 0.2, ease: "easeOut" }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4">
              <AnimatePresence mode="wait">
                {hoveredProject && hoveredProject.image && (
                  <motion.div
                    key={hoveredProject.projectName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                  >
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <Image
                        src={hoveredProject.image}
                        alt={`${hoveredProject.projectName} preview`}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    <div className="mt-3">
                      <div className="text-base font-medium text-slate-900">{hoveredProject.projectName}</div>
                      <p className="text-sm text-slate-500">{hoveredProject.year}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}