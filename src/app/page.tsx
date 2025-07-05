'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ListItem from '@/components/ListItem';
import LocationTime from '@/components/LocationTime';

// Static highlights data
const staticHighlights = [
  {
    title: "Linear Design System",
    description: "Built comprehensive design system and component library",
    category: "Design System",
    href: "/case-studies/linear-design-system"
  },
  {
    title: "Rasayel - Big Picture",
    description: "Strategic design leadership transforming customer support platform",
    category: "Product Strategy",
    href: "/case-studies/rasayel-big-picture"
  },
  {
    title: "Figma Plugin Development",
    description: "Created tools to streamline design workflow",
    category: "Development",
    href: "https://figma.com"
  },
  {
    title: "CentralApp",
    description: "First product design role (2015-2016). Mostly UI/UX design.",
    category: "Product Design",
    href: "https://www.centralapp.com/en"
  }
];

const quotes = [
  {
    text: '"Perfection is achieved not when there is nothing more to add, but when there is nothing more to take away."',
    author: '— Antoine de Saint-Exupéry'
  },
  {
    text: '"There is surely nothing quite so useless as doing with great efficiency what should not be done at all."',
    author: '— Peter Drucker'
  }
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const [isHoveringModal, setIsHoveringModal] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Cycle through quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="bg-white min-h-screen relative">
      {/* Global Custom Cursor */}
      <AnimatePresence>
        {(isHoveringPhoto || isHoveringModal) && (
          <motion.div
            className="fixed pointer-events-none z-[60]"
            initial={{ 
              opacity: 0,
              scale: 0.7,
              x: cursorPosition.x - 12,
              y: cursorPosition.y - 12
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: cursorPosition.x - 12,
              y: cursorPosition.y - 12
            }}
            exit={{ 
              opacity: 0,
              scale: 0.7,
              x: cursorPosition.x - 12,
              y: cursorPosition.y - 12
            }}
            transition={{ duration: 0.05, ease: 'easeOut' }}
          >
            <div className="bg-slate-900/70 ring-1 ring-white/20 backdrop-blur-sm rounded-full p-2 shadow-lg">
              {isHoveringPhoto ? (
                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              ) : (
                <XMarkIcon className="w-5 h-5 text-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 py-9">
          {/* Header */}
          <div className="pt-9 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
              <div>
                <h1 className="text-base font-semibold text-slate-900">
                  Antoine Pirard
                </h1>
                <p className="text-base font-normal text-slate-600">
                  Product designer
                </p>
              </div>
              <div className="flex-shrink-0">
                <LocationTime />
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="relative">
              <motion.div
                layoutId="photo"
                onClick={() => setIsModalOpen(true)}
                className="cursor-none interactive-element"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
                onMouseEnter={() => setIsHoveringPhoto(true)}
                onMouseLeave={() => setIsHoveringPhoto(false)}
                onMouseMove={(e) => {
                  setCursorPosition({
                    x: e.clientX,
                    y: e.clientY
                  });
                }}
              >
                <Image
                  src="/Assets/Images/IMG_0169 2.jpeg"
                  alt="Antoine Pirard"
                  width={200}
                  height={250}
                  className="rounded-2xl shadow-2xl border-4 border-white object-cover interactive-element rotate-2 photo-hover transition-transform duration-150 max-w-[180px] sm:max-w-[200px]"
                  style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                  priority
                />
                

              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <p className="fluid-text-base font-medium leading-relaxed text-slate-950">
                Product design scaling startups from nothing to millions in ARR.
              </p>
              <p className="fluid-text-base leading-relaxed text-slate-700">
                — I&apos;m building experiences and teams that allow businesses to scale to their full potential.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="fluid-text-base leading-relaxed text-slate-600">
                Over the last 10 years, I&apos;ve helped early-stage startup founders create products from the ground up, 
                led teams and developed successful product strategy. I thrive in strategic chaos clearing and crafting 
                the detailed experiences that make a product feel complete.
              </p>
            </div>
          </div>

          {/* Connect Section */}
          <div className="max-w-2xl">
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
            </div>
          </div>

          {/* Highlights Section */}
          <div className="max-w-4xl">
            <ListItem 
              items={staticHighlights}
              title="Highlights" 
              animationDelay="400ms" 
            />
          </div>

          {/* Company Logos Section */}
          <div className="max-w-2xl">
            <div className="mt-9 mb-12">
              <div className="flex gap-6 sm:gap-8 md:gap-12 items-center flex-wrap">
                <motion.div 
                  className="h-6 sm:h-8 flex items-center"
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                >
                  <Image 
                    src="/Assets/Logos/Rasayel Logo.svg" 
                    alt="Rasayel" 
                    width={84}
                    height={23}
                    className="w-auto h-full max-w-[84px] sm:max-w-[105px]"
                  />
                </motion.div>
                <motion.div 
                  className="h-6 sm:h-8 flex items-center"
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
                >
                  <Image 
                    src="/Assets/Logos/GoVocal Logo.svg" 
                    alt="GoVocal" 
                    width={52}
                    height={35}
                    className="w-auto h-full max-w-[52px] sm:max-w-[65px]"
                  />
                </motion.div>
                <motion.div 
                  className="h-5 sm:h-6 flex items-center"
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
                >
                  <Image 
                    src="/Assets/Logos/CambridgeJBS Logo.svg" 
                    alt="Cambridge Judge Business School" 
                    width={96}
                    height={19}
                    className="w-auto h-full max-w-[96px] sm:max-w-[120px]"
                  />
                </motion.div>
                <motion.div 
                  className="h-6 sm:h-8 flex items-center"
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.62, ease: 'easeOut' }}
                >
                  <Image 
                    src="/Assets/Logos/CentralApp Logo.svg" 
                    alt="CentralApp" 
                    width={103}
                    height={19}
                    className="w-auto h-full max-w-[103px] sm:max-w-[129px]"
                  />
                </motion.div>
              </div>
            </div>
          </div>

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
          <div className="max-w-2xl mb-32">
            <motion.div 
              className="min-h-[120px] flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence mode="wait">
                <motion.blockquote 
                  key={currentQuoteIndex}
                  className="font-serif italic text-slate-900 text-lg leading-relaxed w-full"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {quotes[currentQuoteIndex].text}
                  <cite className="block mt-2 text-sm font-sans not-italic text-slate-600">
                    {quotes[currentQuoteIndex].author}
                  </cite>
                </motion.blockquote>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-none"
            onClick={() => {
              setIsModalOpen(false);
              setIsHoveringModal(false);
            }}
            onMouseEnter={() => setIsHoveringModal(true)}
            onMouseLeave={() => setIsHoveringModal(false)}
            onMouseMove={(e) => {
              setCursorPosition({
                x: e.clientX,
                y: e.clientY
              });
            }}
          >
            <motion.div
              layoutId="photo"
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src="/Assets/Images/IMG_0169 2.jpeg"
                alt="Antoine Pirard - High Resolution"
                width={800}
                height={1000}
                className="rounded-2xl object-contain max-w-full max-h-full cursor-none"
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                onClick={() => {
                  setIsModalOpen(false);
                  setIsHoveringModal(false);
                }}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer footnote */}
      <div className="text-center mb-8">
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Vibe coded in Belgium, using React, Tailwind, Framer Motion and Next.js
        </p>
      </div>
    </div>
  );
}
