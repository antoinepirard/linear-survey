import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects, Project } from '@/data/projects';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';


interface ProjectsTableProps {
  onProjectHover?: (project: Project | null) => void;
}

export default function ProjectsTable({ onProjectHover }: ProjectsTableProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mediaDimensions, setMediaDimensions] = useState<{ width: number; height: number } | null>(null);
  
  // Sort all projects by year (newest first)
  const sortedProjects = [...projects].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    // Set default 16:9 aspect ratio immediately to prevent height scaling
    setMediaDimensions({ width: 16, height: 9 });
  };

  const handleVideoLoad = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    setMediaDimensions({
      width: video.videoWidth,
      height: video.videoHeight
    });
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setMediaDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const navigateToProject = (direction: 'up' | 'down') => {
    if (!selectedProject) return;
    
    const currentIndex = sortedProjects.findIndex(
      project => project.projectName === selectedProject.projectName && 
                project.year === selectedProject.year
    );
    
    let nextIndex;
    if (direction === 'up') {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : sortedProjects.length - 1;
    } else {
      nextIndex = currentIndex < sortedProjects.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedProject(sortedProjects[nextIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedProject) return;

      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        
        const currentIndex = sortedProjects.findIndex(
          project => project.projectName === selectedProject.projectName && 
                    project.year === selectedProject.year
        );
        
        let nextIndex;
        if (event.key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : sortedProjects.length - 1;
        } else {
          nextIndex = currentIndex < sortedProjects.length - 1 ? currentIndex + 1 : 0;
        }
        
        setSelectedProject(sortedProjects[nextIndex]);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, sortedProjects]);

  return (
    <>
      <div className="space-y-1">
        {sortedProjects.map((project, index) => {
          // Check if this is the first project of a new year
          const isFirstOfYear = index === 0 || sortedProjects[index - 1].year !== project.year;
          
          return (
            <React.Fragment key={`${project.year}-${index}`}>
              {isFirstOfYear && (
                <h3 
                  id={`year-${project.year}`}
                  className="sr-only"
                >
                  {project.year}
                </h3>
              )}
              <div 
                className="py-3 px-1 border-b border-slate-100 transition-colors duration-200 hover:border-slate-200 cursor-pointer"
                onMouseEnter={() => onProjectHover?.(project)}
                onMouseLeave={() => onProjectHover?.(null)}
                onClick={() => handleProjectClick(project)}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900 truncate pr-4">
                    {project.projectName}
                    {project.category && (
                      <span className="text-slate-400 font-normal"> / {project.category}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono flex-shrink-0">
                    {project.year}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-"
            onClick={closeModal}
          >
            {/* ESC hint tag */}
            <motion.div
              className="absolute top-4 right-4 bg-white text-slate-900 text-xs px-2 py-1 rounded-md font-mono"
            >
              ESC to close
            </motion.div>
            
            <motion.div
              key={`modal-${selectedProject.projectName}-${selectedProject.year}`}
              className="bg-white rounded-md shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-7">
                <div>
                  <h3 className="text-base font-medium text-slate-900">
                    {selectedProject.projectName}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono">
                    {selectedProject.year}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateToProject('up')}
                    className="bg-white border border-slate-200 shadow-xs p-1.5 rounded-md hover:border-slate-300 transition-colors duration-150 cursor-pointer"
                    title="Previous project (↑)"
                  >
                    <ChevronUpIcon className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => navigateToProject('down')}
                    className="bg-white border border-slate-200 shadow-xs p-1.5 rounded-md hover:border-slate-300 transition-colors duration-150 cursor-pointer"
                    title="Next project (↓)"
                  >
                    <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                  </button>

                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                {/* Media Preview Section */}
                {(selectedProject.previewImage || selectedProject.previewVideo) && (
                  <div 
                    className="mb-6 bg-slate-50 rounded-lg overflow-hidden"
                    style={{
                      aspectRatio: `${mediaDimensions?.width} / ${mediaDimensions?.height}`
                    }}
                  >
                    {selectedProject.previewVideo ? (
                      <video 
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        poster={selectedProject.previewImage}
                        onLoadedMetadata={handleVideoLoad}
                      >
                        <source src={selectedProject.previewVideo} type="video/mp4" />
                        <source src={selectedProject.previewVideo} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    ) : selectedProject.previewImage ? (
                      <div className="relative w-full" style={{
                        aspectRatio: mediaDimensions ? `${mediaDimensions.width} / ${mediaDimensions.height}` : '16 / 9'
                      }}>
                        <Image 
                          src={selectedProject.previewImage} 
                          alt={`Preview of ${selectedProject.projectName}`}
                          fill
                          className="object-contain"
                          onLoad={handleImageLoad}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
                
                {selectedProject.description && (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                )}
                
                {!selectedProject.description && (
                  <p className="text-slate-500 italic">
                    No description available for this project.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}