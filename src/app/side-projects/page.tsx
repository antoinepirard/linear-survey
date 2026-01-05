"use client";

import Link from "next/link";
import { motion } from "motion/react";
import HeaderSection from "@/components/HeaderSection";
import { AnimationWrapper } from "@/hooks/useAnimation";
import { StarIcon } from "@heroicons/react/24/solid";

const featuredProjects = [
  {
    slug: "ravell",
    title: "Ravell",
    description: "Team planning tool for product teams.",
    date: "2025",
    href: "https://ravell.app",
    isExternal: true,
  },
  {
    slug: "antoines-manual",
    title: "Antoine's Manual",
    description: "How I work, think, and collaborate.",
    date: "2026",
    href: "/side-projects/antoines-manual",
    isExternal: false,
  },
];

const openSourceProjects = [
  {
    slug: "morphing-toc",
    title: "morphing-toc",
    description: "Table of contents that morphs from lines to menu on hover.",
    date: "2026",
    href: "/open-source/morphing-toc",
    isExternal: false,
  },
];

const sideProjects = [
  {
    slug: "strategy-tree",
    title: "Strategy Tree",
    description: "Visualize goals and how product work contributes to strategy.",
    date: "2026",
  },
  {
    slug: "difffs",
    title: "Difffs",
    description: "Track competitor website changes.",
    date: "2026",
  },
  {
    slug: "btc-sentiment",
    title: "BTC Sentiment",
    description: "Track Bitcoin price alongside Fear & Greed index.",
    date: "2026",
  },
  {
    slug: "recipe-checker",
    title: "Recipe Checker",
    description: "Match ingredients you have with recipes.",
    date: "2026",
  },
  {
    slug: "conviction",
    title: "Conviction Voting",
    description: "Real-time voting with conviction levels.",
    date: "2026",
  },
  {
    slug: "sourdough",
    title: "Sourdough Calculator",
    description: "Baker's percentages for sourdough bread.",
    date: "2026",
  },
];

export default function SideProjectsPage() {
  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden">
      <main className="overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 pt-20 pb-9 sm:py-9">
            <HeaderSection />

            <div className="flex flex-col gap-6">
              <AnimationWrapper delay="150ms">
                <p className="text-base text-slate-600 max-w-xl">
                  Things I build on nights and weekends. Mostly experiments, sometimes useful.
                </p>
              </AnimationWrapper>

              {/* Projects List */}
              <AnimationWrapper delay="200ms">
                <div className="flex flex-col">
                  {/* Open Source */}
                  <div className="mb-2 mt-4">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Open Source
                    </span>
                  </div>
                  {openSourceProjects.map((project) => (
                    <motion.div key={project.slug} whileHover="hover">
                      <Link
                        href={project.href}
                        className="group block py-4 px-2 -mx-2 border-b border-slate-100 transition-colors duration-150 hover:border-slate-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-900 font-mono transition-colors duration-150 group-hover:text-slate-700">
                              {project.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center min-w-0">
                            <motion.span
                              className="text-xs font-mono uppercase text-slate-500 whitespace-nowrap"
                              animate={{ x: 0 }}
                              variants={{
                                hover: { x: -16 },
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                              {project.date}
                            </motion.span>
                            <motion.div
                              className="flex items-center"
                              initial={{ x: 16, opacity: 0 }}
                              variants={{
                                hover: { x: 0, opacity: 1 },
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                              <span className="text-xs text-slate-400 -ml-2">→</span>
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Featured Projects */}
                  <div className="mb-2 mt-6">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                  {featuredProjects.map((project) => (
                    <motion.div key={project.slug} whileHover="hover">
                      {project.isExternal ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block py-4 px-2 -mx-2 border-b border-slate-100 transition-colors duration-150 hover:border-slate-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-slate-900 transition-colors duration-150 group-hover:text-slate-700">
                                  {project.title}
                                </h3>
                                <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                              <p className="text-sm text-slate-600">
                                {project.description}
                              </p>
                            </div>
                            <div className="flex items-center min-w-0">
                              <motion.span
                                className="text-xs font-mono uppercase text-slate-500 whitespace-nowrap"
                                animate={{ x: 0 }}
                                variants={{
                                  hover: { x: -20 },
                                }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                              >
                                {project.date}
                              </motion.span>
                              <motion.div
                                className="flex items-center"
                                initial={{ x: 20, opacity: 0 }}
                                variants={{
                                  hover: { x: 0, opacity: 1 },
                                }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                              >
                                <span className="text-xs text-slate-400 -ml-2">↗</span>
                              </motion.div>
                            </div>
                          </div>
                        </a>
                      ) : (
                        <Link
                          href={project.href}
                          className="group block py-4 px-2 -mx-2 border-b border-slate-100 transition-colors duration-150 hover:border-slate-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-slate-900 transition-colors duration-150 group-hover:text-slate-700">
                                  {project.title}
                                </h3>
                                <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                              <p className="text-sm text-slate-600">
                                {project.description}
                              </p>
                            </div>
                            <div className="flex items-center min-w-0">
                              <motion.span
                                className="text-xs font-mono uppercase text-slate-500 whitespace-nowrap"
                                animate={{ x: 0 }}
                                variants={{
                                  hover: { x: -16 },
                                }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                              >
                                {project.date}
                              </motion.span>
                              <motion.div
                                className="flex items-center"
                                initial={{ x: 16, opacity: 0 }}
                                variants={{
                                  hover: { x: 0, opacity: 1 },
                                }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                              >
                                <span className="text-xs text-slate-400 -ml-2">→</span>
                              </motion.div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  {/* Other Projects */}
                  <div className="mb-2 mt-6">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Experiments
                    </span>
                  </div>
                  {sideProjects.map((project, index) => (
                    <motion.div
                      key={project.slug}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.04, duration: 0.3 }}
                      whileHover="hover"
                    >
                      <Link
                        href={`/side-projects/${project.slug}`}
                        className="group block py-4 px-2 -mx-2 border-b border-slate-100 transition-colors duration-150 hover:border-slate-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-900 transition-colors duration-150 group-hover:text-slate-700">
                              {project.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center min-w-0">
                            <motion.span
                              className="text-xs font-mono uppercase text-slate-500 whitespace-nowrap"
                              animate={{ x: 0 }}
                              variants={{
                                hover: { x: -16 },
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                              {project.date}
                            </motion.span>
                            <motion.div
                              className="flex items-center"
                              initial={{ x: 16, opacity: 0 }}
                              variants={{
                                hover: { x: 0, opacity: 1 },
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                              <span className="text-xs text-slate-400 -ml-2">→</span>
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AnimationWrapper>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

