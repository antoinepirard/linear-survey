import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { projects, Project } from '@/data/projects';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

function OptimizedVideo({ src, poster, className = '' }: OptimizedVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!videoRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(videoRef);

    return () => observer.disconnect();
  }, [videoRef]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Use provided poster or create from video path
  const posterPath = poster || src.replace('.webm', '.jpg');

  return (
    <div className={`relative ${className}`}>
      <video
        ref={setVideoRef}
        src={shouldLoad ? src : undefined}
        className="w-full rounded-lg"
        autoPlay={shouldLoad}
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterPath}
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onError={handleError}
        style={{
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {isLoading && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
          <div className="text-center text-slate-500">
            <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Video failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProjectsTableProps {
  onProjectHover?: (project: Project | null) => void;
}

interface FastScrollBarProps {
  years: string[];
  onYearSelect: (year: string) => void;
}

function FastScrollBar({ years, onYearSelect }: FastScrollBarProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Start long press timer
    const timeout = setTimeout(() => {
      setIsScrolling(true);
      handleTouchMove(e);
    }, 500); // 500ms long press
    
    setLongPressTimeout(timeout);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }

    if (!isScrolling || !scrollBarRef.current) return;

    e.preventDefault();
    const touch = e.touches[0];
    const rect = scrollBarRef.current.getBoundingClientRect();
    const relativeY = touch.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
    const yearIndex = Math.floor(percentage * years.length);
    
    if (yearIndex >= 0 && yearIndex < years.length) {
      const year = years[yearIndex];
      setActiveYear(year);
      onYearSelect(year);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
    
    setIsScrolling(false);
    setActiveYear(null);
  };

  // Only show on mobile/touch devices
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      {/* Fast scroll bar */}
      <div
        ref={scrollBarRef}
        className="fixed right-2 top-1/2 transform -translate-y-1/2 w-8 h-64 bg-slate-200/50 rounded-full z-40 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          opacity: isScrolling ? 1 : 0.3,
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* Year indicators */}
        {years.map((year, index) => (
          <div
            key={year}
            className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-slate-400"
            style={{
              top: `${(index / (years.length - 1)) * 100}%`,
              backgroundColor: activeYear === year ? '#1e293b' : '#94a3b8',
              transform: `translateX(-50%) ${activeYear === year ? 'scale(1.5)' : 'scale(1)'}`,
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </div>

      {/* Year display bubble */}
      <AnimatePresence>
        {isScrolling && activeYear && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed right-12 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg font-mono text-lg font-semibold z-50 pointer-events-none shadow-lg"
          >
            {activeYear}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProjectsTable({ onProjectHover }: ProjectsTableProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Sort all projects by year (newest first)
  const sortedProjects = [...projects].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  
  // Get unique years for fast scroll
  const uniqueYears = Array.from(new Set(sortedProjects.map(p => p.year)));

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleYearSelect = (year: string) => {
    const yearElement = document.getElementById(`year-${year}`);
    if (yearElement && containerRef.current) {
      yearElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
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
      <div ref={containerRef} className="space-y-1">
        {sortedProjects.map((project, index) => {
          // Check if this is the first project of a new year
          const isFirstOfYear = index === 0 || sortedProjects[index - 1].year !== project.year;
          
          return (
            <React.Fragment key={`${project.year}-${index}`}>
              {isFirstOfYear && (
                <h3 
                  id={`year-${project.year}`}
                  className="text-lg font-semibold text-slate-900 mt-8 mb-4 first:mt-0"
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

      {/* Fast scroll component */}
      <FastScrollBar
        years={uniqueYears}
        onYearSelect={handleYearSelect}
      />

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-"
            onClick={closeModal}
          >
            {/* ESC hint tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute top-4 right-4 bg-slate-900 text-white text-xs px-2 py-1 rounded-md font-mono"
            >
              ESC to close
            </motion.div>
            
            <motion.div
              key={`modal-${selectedProject.projectName}-${selectedProject.year}`}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                layout: { duration: 0.3, ease: 'easeInOut' },
                opacity: { duration: 0.2, ease: 'easeOut' },
                scale: { duration: 0.2, ease: 'easeOut' },
                y: { duration: 0.2, ease: 'easeOut' }
              }}
              className="bg-white rounded-md shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <motion.div 
                layout
                className="flex items-center justify-between p-7"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <motion.div
                  layout
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <h3 className="text-base font-medium text-slate-900">
                    {selectedProject.projectName}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono">
                    {selectedProject.year}
                  </p>
                </motion.div>
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
              </motion.div>

              {/* Content */}
              <motion.div 
                layout
                className="p-7"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {(selectedProject.image || selectedProject.video) && (
                  <motion.div 
                    layout
                    className="mb-6"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {selectedProject.video ? (
                      <OptimizedVideo
                        src={selectedProject.video}
                        poster={selectedProject.poster}
                        className="w-full"
                      />
                    ) : (
                      <Image
                        src={selectedProject.image!}
                        alt={selectedProject.projectName}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg"
                        priority
                      />
                    )}
                  </motion.div>
                )}
                
                {selectedProject.description && (
                  <motion.div 
                    layout
                    className="prose prose-slate max-w-none"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p className="text-slate-700 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </motion.div>
                )}
                
                {!selectedProject.description && (
                  <motion.p 
                    layout
                    className="text-slate-500 italic"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    No description available for this project.
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}