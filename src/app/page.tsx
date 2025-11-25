"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

import ListItem from "@/components/ListItem";
import HeaderSection from "@/components/HeaderSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import { AnimationWrapper } from "@/hooks/useAnimation";
import { staticHighlights } from "@/data/staticData";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

// import CompanyLogos from '@/components/CompanyLogos';

const FocusBanner = dynamic(() => import("@/components/FocusBanner"), {
  ssr: false,
});

const QuotesSection = dynamic(() => import("@/components/QuotesSection"), {
  loading: () => <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />,
});

const PhotoModal = dynamic(() => import("@/components/PhotoModal"), {
  loading: () => null,
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log folio info once on load
  useEffect(() => {
    console.log(
      `%c
    ███████╗ ██████╗ ██╗     ██╗ ██████╗
    ██╔════╝██╔═══██╗██║     ██║██╔═══██╗
    █████╗  ██║   ██║██║     ██║██║   ██║
    ██╔══╝  ██║   ██║██║     ██║██║   ██║
    ██║     ╚██████╔╝███████╗██║╚██████╔╝
    ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝

    Antoine Pirard - Product Designer

    🧠 Systems Thinker
    🎨 Product Crafter
    ⚡ Vibing Coding to Learn (Is vibe coding just coding?)

    Built with Next.js 15, Framer Motion & Tailwind CSS
    Version: 2025.1
\n`,
      "color: #0f172a; font-family: monospace; font-weight: bold;"
    );
  }, []);

  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden">
      <main className="overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 pt-20 pb-9 sm:py-9">
            {/* Header */}
            <HeaderSection />

            {/* Photo Section */}
            {/* <AnimationWrapper
              delay="100ms"
              className="flex justify-start relative z-50"
            >
              <div className="relative px-4 py-2 group">
                <motion.div
                  layoutId="photo-container"
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-zoom-in interactive-element ring-1 ring-slate-300/40 to-slate-300/90 border-5 border-white rounded-2xl shadow-xl relative overflow-hidden"
                  whileHover={{ scale: 1.02, rotate: 2 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    willChange: "transform",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.img
                    layoutId="photo"
                    src="/Assets/Images/IMG_0169_2.webp"
                    alt="Antoine Pirard"
                    width={200}
                    height={250}
                    className="rounded-2xl object-cover max-w-[180px] sm:max-w-[200px]"
                  />
                  {/* Contextual overlay */}
            {/* <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl flex items-end p-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-white">
                      <p className="text-xs font-medium mb-1">
                        📍 Tervuren, Belgium
                      </p>
                      <p className="text-xs text-white/80">Antoine & Olivia</p>
                    </div>
                  </motion.div> */}
            {/* </motion.div>
              </div>
            </AnimationWrapper> */}

            {/* Main Content */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <AnimationWrapper delay="150ms">
                <p className="text-base font-medium leading-relaxed text-slate-950">
                  Product & Design.
                </p>
                <p className="text-base leading-relaxed text-slate-700">
                  I craft thoughtful experiences with product teams—from
                  research and validation to design and engineering handover.
                </p>
              </AnimationWrapper>

              <AnimationWrapper delay="200ms">
                <p className="text-base leading-relaxed text-slate-700">
                  I&apos;ve spent the last decade in fast-moving, ambiguous
                  environments—collaborating with brilliant engineers to find
                  the most valuable problems to solve, and solving them from
                  first principles.
                </p>
              </AnimationWrapper>
            </div>

            {/* Connect Section */}
            <div className="max-w-2xl">
              <AnimationWrapper delay="300ms">
                <h2 className="text-lg font-medium text-slate-900 mb-3">
                  Connect
                </h2>
                <p className="text-slate-600 mb-4">
                  Reach out to me at{" "}
                  <a
                    href="mailto:contact@antoinepirard.be"
                    className="text-slate-600 hover:text-slate-700 transition-colors duration-150 border-b border-slate-100 hover:border-slate-300 pb-0.5"
                  >
                    contact@antoinepirard.be
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://x.com/antoinepirard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-700 transition-colors duration-150 border-b border-slate-100 hover:border-slate-300 pb-0.5"
                  >
                    @antoinepirard
                  </a>
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-800 transition-all duration-150"
                >
                  <a
                    href="https://cal.com/antoine-ravell/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    Let&apos;s chat
                  </a>
                </Button>
              </AnimationWrapper>
            </div>

            {/* Highlights Section */}
            <div className="max-w-4xl">
              {/* Highlights Title */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <h2 className="text-lg font-medium text-slate-900 mb-6">
                  Highlights
                </h2>
              </div>

              {/* Projects Grid */}
              <AnimationWrapper delay="420ms" className="mb-12">
                <ProjectsGrid />
              </AnimationWrapper>

              {/* Highlights List */}
              <ListItem
                items={staticHighlights}
                title=""
                animationDelay="450ms"
              />
            </div>

            {/* Company Logos Section */}
            {/* <CompanyLogos /> */}

            {/* Testimonials Section */}
            {/* <TestimonialsSection /> */}

            {/* Separation Line */}
            <motion.div
              className="max-w-4xl"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            >
              <div className="h-px bg-slate-200" />
            </motion.div>

            {/* Quotes Section */}
            <QuotesSection />

            {/* LinkedIn Recommendations */}
            <AnimationWrapper delay="500ms">
              <div className="flex justify-center">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="bg-white hover:bg-slate-100 text-slate-600"
                >
                  <a
                    href="https://www.linkedin.com/in/antoinepirard/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/Assets/Logos/linkedin-logo.svg"
                      alt="LinkedIn"
                      width={16}
                      height={16}
                    />
                    Read recommendations
                  </a>
                </Button>
              </div>
            </AnimationWrapper>

            {/* Footer footnote */}
            <div className="text-center">
              <p className="text-xs text-slate-500 font-mono tracking-wide">
                Coded in English with my buddy Claudy.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence mode="wait">
        <PhotoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </AnimatePresence>

      {/* Focus Banner */}
      <FocusBanner />
    </div>
  );
}
