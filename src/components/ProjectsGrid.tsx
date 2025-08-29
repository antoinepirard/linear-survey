"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Project, projects } from "@/data/projects";
import { useCursorPosition } from "@/hooks/useCursorPosition";

interface ProjectsGridProps {
  className?: string;
}

const PREVIEW_W = 640; // tailwind w-[40rem]

export default function ProjectsGrid({ className = "" }: ProjectsGridProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const { position, containerRef } = useCursorPosition();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  // Get first 4 projects with preview images or videos
  const projectsWithMedia = projects
    .filter((project) => project.previewImage || project.previewVideo)
    .slice(0, 4);

  const handleProjectHover = (project: Project | null) => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (project) {
      // Immediately show the new project
      setHoveredProject(project);
    } else {
      // Delay closing by 500ms
      closeTimeoutRef.current = setTimeout(() => {
        setHoveredProject(null);
      }, 250);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`relative ${className}`}
    >
      {/* Projects Grid */}
      <div className="grid grid-cols-4 gap-4 sm:gap-6">
        {projectsWithMedia.map((project) => (
          <motion.div
            key={`${project.year}-${project.projectName}`}
            className="relative aspect-[3/4] group cursor-pointer"
            onMouseEnter={() => handleProjectHover(project)}
            onMouseLeave={() => handleProjectHover(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Project Thumbnail */}
            <div className="w-full h-full relative overflow-hidden rounded-xl bg-slate-100">
              {project.previewImage ? (
                <Image
                  src={project.previewImage}
                  alt={project.projectName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-center p-4">
                    <div className="text-sm font-medium mb-1">
                      {project.projectName}
                    </div>
                    <div className="text-xs text-slate-500">{project.year}</div>
                  </div>
                </div>
              )}

              {/* Overlay with project info */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-white">
                  <div className="text-sm font-medium mb-1 line-clamp-2">
                    {project.projectName}
                  </div>
                  <div className="text-sm text-white/80">
                    {project.year} • {project.category}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cursor-following preview (via portal) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {hoveredProject &&
              (hoveredProject.previewImage || hoveredProject.previewVideo) && (
                <motion.div
                  className="fixed pointer-events-none z-50 w-[40rem]"
                  style={{
                    left: position.x - PREVIEW_W / 2,
                    top: position.y - 60,
                    transform: "translateY(-100%)",
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full">
                    {hoveredProject.previewVideo ? (
                      <video
                        key={hoveredProject.previewVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-[30rem] object-cover"
                        poster={hoveredProject.previewImage}
                      >
                        <source
                          src={hoveredProject.previewVideo}
                          type="video/mp4"
                        />
                        <source
                          src={hoveredProject.previewVideo}
                          type="video/webm"
                        />
                      </video>
                    ) : (
                      <div className="relative w-full h-[30rem]">
                        <Image
                          src={
                            hoveredProject.hoverPreviewImage ||
                            hoveredProject.previewImage!
                          }
                          alt={hoveredProject.projectName}
                          fill
                          className="object-cover"
                          sizes="640px"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="text-sm font-medium text-slate-900 mb-1">
                        {hoveredProject.projectName}
                      </div>
                      <div className="text-sm text-slate-600">
                        {hoveredProject.year} • {hoveredProject.category}
                      </div>
                      {hoveredProject.description && (
                        <div className="text-sm text-slate-500 mt-2">
                          {hoveredProject.description}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
