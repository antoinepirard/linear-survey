"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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

    Antoine Pirard - System Thinker & Product Designer

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
            <AnimationWrapper
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
                  <motion.div
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
                  </motion.div>
                </motion.div>
              </div>
            </AnimationWrapper>

            {/* Main Content */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <AnimationWrapper delay="150ms">
                <h3 className="text-lg font-medium leading-relaxed text-slate-950 mb-4">
                  A product & design partner for 0→1 and pivots.
                </h3>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  <strong>
                    I partner with early-stage founders building their first
                    product, and with teams making product pivots.
                  </strong>{" "}
                  As an embedded partner, I work with you to choose the next
                  priority, validate it with users, and make sure product and
                  engineering stay aligned so we deliver meaningful outcomes.
                </p>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  My approach is hands-on product and design. I work directly
                  with your founder and tech lead. Each week, we run outcome
                  loops: set a goal → prototype & test → write a decision memo →
                  next steps. I work closely with engineers, prioritizing,
                  scoping, and jumping in with small PRs when needed.
                </p>
              </AnimationWrapper>

              <AnimationWrapper delay="200ms">
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  What we achieve together: Faster decisions (days, not months),
                  lower risk (testing top assumptions before code), and team
                  alignment (prototypes and specs that engineering can trust).
                </p>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  In practise: Frame the problem → define success → validate
                  experience & design with users → build specs, acceptance
                  criteria, and a clean handoff to development.
                </p>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  <strong>Best fit:</strong> Engaged founders, a technical core,
                  and access to users. Multi-month or longer term
                  collaborations.
                </p>
                <p className="text-base leading-relaxed text-slate-700">
                  <strong>Not a fit:</strong> Pixel-only work, &quot;just make
                  it pretty&quot;, or having no access to decision makers.
                  Single day or week engagements.
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
                    href="mailto:antoine@ravell.io"
                    className="text-slate-600 hover:text-slate-700 transition-colors duration-150 border-b border-slate-100 hover:border-slate-300 pb-0.5"
                  >
                    antoine@ravell.io
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
                    Book a call
                  </a>
                </Button>
              </AnimationWrapper>
            </div>

            {/* Highlights Section */}
            <div className="max-w-4xl">
              <ListItem
                items={staticHighlights}
                title="Work"
                animationDelay="400ms"
              />

              {/* Projects Grid under Work section */}
              <AnimationWrapper delay="450ms" className="mt-20">
                <ProjectsGrid />
              </AnimationWrapper>
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
