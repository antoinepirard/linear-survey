'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    title: "Triage Responsibility",
    description: "Led product strategy and user experience design",
    category: "Product Strategy",
    href: "https://example.com"
  },
  {
    title: "Figma Plugin Development",
    description: "Created tools to streamline design workflow",
    category: "Development",
    href: "https://figma.com"
  },
  {
    title: "User Insights Platform",
    description: "Designed analytics dashboard for user behavior",
    category: "Analytics",
    href: "https://example.com"
  }
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen relative">
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
                  Product design leader
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
                className="cursor-zoom-in interactive-element"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
              >
                <Image
                  src="/Assets/Images/IMG_0169 2.jpeg"
                  alt="Antoine Pirard"
                  width={200}
                  height={250}
                  className="rounded-2xl shadow-2xl transform rotate-2 border-4 border-white object-cover interactive-element photo-hover transition-transform duration-150 max-w-[180px] sm:max-w-[200px]"
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
                Product design leader scaling startups from nothing to millions in ARR.
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
            <div className="mt-9 mb-30">
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
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              layoutId="photo"
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
              style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
            >
              <Image
                src="/Assets/Images/IMG_0169 2.jpeg"
                alt="Antoine Pirard - High Resolution"
                width={800}
                height={1000}
                className="rounded-2xl object-contain max-w-full max-h-full cursor-zoom-out"
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                onClick={() => setIsModalOpen(false)}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
