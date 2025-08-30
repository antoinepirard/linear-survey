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
  const [clickedProject, setClickedProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [preloadedMedia, setPreloadedMedia] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const { position, containerRef } = useCursorPosition();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get first 4 projects with preview images or videos
  const projectsWithMedia = projects
    .filter((project) => project.previewImage || project.previewVideo)
    .slice(0, 4);

  useEffect(() => {
    setMounted(true);

    // Check if mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload media on mobile after component mounts
  useEffect(() => {
    if (!mounted || !isMobile) return;

    const preloadMedia = async () => {
      const mediaToPreload = projectsWithMedia
        .filter((project) => project.previewVideo || project.hoverPreviewImage)
        .slice(0, 2); // Only preload first 2 to avoid overwhelming

      for (const project of mediaToPreload) {
        const mediaUrl = project.previewVideo || project.hoverPreviewImage;
        if (!mediaUrl || preloadedMedia.has(mediaUrl)) continue;

        try {
          if (project.previewVideo) {
            // Preload video
            const video = document.createElement("video");
            video.preload = "metadata";
            video.src = mediaUrl;
            video.load();

            await new Promise((resolve) => {
              video.addEventListener("loadedmetadata", resolve, { once: true });
              video.addEventListener("error", resolve, { once: true });
            });
          } else if (project.hoverPreviewImage) {
            // Preload image
            const img = document.createElement("img");
            img.src = mediaUrl;

            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
          }

          setPreloadedMedia((prev) => new Set(prev).add(mediaUrl));
        } catch {
          console.warn("Failed to preload media:", mediaUrl);
        }
      }
    };

    // Delay preloading to not interfere with initial page load
    const timer = setTimeout(preloadMedia, 1000);
    return () => clearTimeout(timer);
  }, [mounted, isMobile, projectsWithMedia, preloadedMedia]);

  const handleProjectHover = (project: Project | null) => {
    if (isMobile) return; // No hover on mobile

    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (project) {
      // Immediately show the new project
      setHoveredProject(project);
    } else {
      // Delay closing by 250ms
      closeTimeoutRef.current = setTimeout(() => {
        setHoveredProject(null);
      }, 250);
    }
  };

  const handleProjectClick = (project: Project) => {
    if (isMobile) {
      const mediaUrl = project.previewVideo || project.hoverPreviewImage;
      if (mediaUrl) {
        setLoadingStates((prev) => ({ ...prev, [mediaUrl]: true }));
      }
      setClickedProject(project);
    }
  };

  const handleMediaLoaded = (mediaUrl: string) => {
    setLoadingStates((prev) => ({ ...prev, [mediaUrl]: false }));
  };

  const closeMobileModal = () => {
    setClickedProject(null);
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {projectsWithMedia.map((project) => (
          <motion.div
            key={`${project.year}-${project.projectName}`}
            className="relative aspect-[3/4] group cursor-default"
            onMouseEnter={() => handleProjectHover(project)}
            onMouseLeave={() => handleProjectHover(null)}
            onClick={() => handleProjectClick(project)}
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

      {/* Desktop Cursor-following preview (via portal) */}
      {mounted &&
        !isMobile &&
        createPortal(
          <AnimatePresence>
            {hoveredProject &&
              (hoveredProject.previewImage || hoveredProject.previewVideo) && (
                <motion.div
                  className="fixed pointer-events-none z-50 w-[40rem]"
                  style={{
                    left: position.x - PREVIEW_W / 2,
                    top: position.y - 200,
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

      {/* Mobile Fullscreen Modal */}
      {mounted &&
        isMobile &&
        createPortal(
          <AnimatePresence>
            {clickedProject &&
              (clickedProject.previewImage || clickedProject.previewVideo) && (
                <motion.div
                  className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeMobileModal}
                >
                  {/* Close button */}
                  <button
                    onClick={closeMobileModal}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Modal content */}
                  <motion.div
                    className="bg-white rounded-2xl overflow-hidden max-w-sm w-full max-h-[80vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative w-full h-64 bg-slate-100">
                      {/* Loading spinner */}
                      {loadingStates[
                        clickedProject.previewVideo ||
                          clickedProject.hoverPreviewImage ||
                          ""
                      ] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
                        </div>
                      )}

                      {clickedProject.previewVideo ? (
                        <video
                          key={clickedProject.previewVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-64 object-cover"
                          poster={clickedProject.previewImage}
                          onLoadedData={() =>
                            handleMediaLoaded(clickedProject.previewVideo!)
                          }
                          onCanPlayThrough={() =>
                            handleMediaLoaded(clickedProject.previewVideo!)
                          }
                        >
                          <source
                            src={clickedProject.previewVideo}
                            type="video/mp4"
                          />
                          <source
                            src={clickedProject.previewVideo}
                            type="video/webm"
                          />
                        </video>
                      ) : (
                        <Image
                          src={
                            clickedProject.hoverPreviewImage ||
                            clickedProject.previewImage!
                          }
                          alt={clickedProject.projectName}
                          fill
                          className="object-cover"
                          sizes="400px"
                          priority={preloadedMedia.has(
                            clickedProject.hoverPreviewImage ||
                              clickedProject.previewImage!
                          )}
                          onLoad={() =>
                            handleMediaLoaded(
                              clickedProject.hoverPreviewImage ||
                                clickedProject.previewImage!
                            )
                          }
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-lg font-medium text-slate-900 mb-2">
                        {clickedProject.projectName}
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        {clickedProject.year} • {clickedProject.category}
                      </div>
                      {clickedProject.description && (
                        <div className="text-sm text-slate-500">
                          {clickedProject.description}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
