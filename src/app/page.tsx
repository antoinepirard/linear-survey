'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import ListItem from '@/components/ListItem';
import HeaderSection from '@/components/HeaderSection';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { staticHighlights } from '@/data/staticData';

// import CompanyLogos from '@/components/CompanyLogos';


const FocusBanner = dynamic(() => import('@/components/FocusBanner'), {
  ssr: false
});

const QuotesSection = dynamic(() => import('@/components/QuotesSection'), {
  loading: () => <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
});

const PhotoModal = dynamic(() => import('@/components/PhotoModal'), {
  loading: () => null
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
      'color: #0f172a; font-family: monospace; font-weight: bold;'
    );
  }, []);

  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden">
      <main className="overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 py-9">
            {/* Header */}
            <HeaderSection />

            {/* Photo Section */}
            <AnimationWrapper delay="100ms" className="flex justify-start relative z-50">
              <div className="relative px-4 py-2">
                <motion.div
                  layoutId="photo-container"
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-zoom-in interactive-element ring-1 ring-slate-300/40 to-slate-300/90 border-5 border-white rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.02, rotate: 2 }}
                  transition={{ duration: 0.15 }}
                  style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
                >
                  <motion.img
                    layoutId="photo"
                    src="/Assets/Images/IMG_0169_2.webp"
                    alt="Antoine Pirard"
                    width={200}
                    height={250}
                    className="rounded-2xl object-cover max-w-[180px] sm:max-w-[200px]"
                  />
                </motion.div>
              </div>
            </AnimationWrapper>

            {/* Main Content */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <AnimationWrapper delay="150ms">
              <p className="fluid-text-base font-medium leading-relaxed text-slate-950">
                Product design scaling startups from nothing to millions in ARR.
              </p>
              <p className="fluid-text-base leading-relaxed text-slate-700">
                — I&apos;m building experiences and teams that allow businesses to scale to their full potential.
              </p>
              </AnimationWrapper>

              <AnimationWrapper delay="200ms">
              <p className="fluid-text-base leading-relaxed text-slate-600">
                Over the last 10 years, I&apos;ve helped early-stage startup founders create products from the ground up,
                led teams and developed successful product strategy. I thrive in strategic chaos clearing and crafting
                the detailed experiences that make a product feel complete.
              </p>
              </AnimationWrapper>
            </div>

            {/* Connect Section */}
            <div className="max-w-2xl">
              <AnimationWrapper delay="300ms">
              <h2 className="text-lg font-medium text-slate-900 mb-3">Connect</h2>
              <p className="text-slate-600">
                Reach out to me at{' '}
                <a
                  href="mailto:contact@antoinepirard.be"
                  className="text-slate-600 hover:text-slate-700 transition-colors duration-150 border-b border-slate-100 hover:border-slate-300 pb-0.5"
                >
                  contact@antoinepirard.be
                </a>
                {' '}or{' '}
                <a
                  href="https://x.com/antoinepirard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-700 transition-colors duration-150 border-b border-slate-100 hover:border-slate-300 pb-0.5"
                >
                  @antoinepirard
                </a>
              </p>
              </AnimationWrapper>
            </div>

            {/* Highlights Section */}
            <div className="max-w-4xl">
              <ListItem
                items={staticHighlights}
                title="Work"
                animationDelay="400ms"
              />
            </div>

            {/* Company Logos Section */}
            {/* <CompanyLogos /> */}

          {/* Separation Line */}
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
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
