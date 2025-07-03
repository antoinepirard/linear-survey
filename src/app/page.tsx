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
    href: "https://linear.app"
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-20 py-9">
          {/* Header */}
          <div className="pt-9 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-base font-semibold text-slate-900">
                  Antoine Pirard
                </h1>
                <p className="text-base font-normal text-slate-600">
                  Product design leader
                </p>
              </div>
              <LocationTime />
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
                  className="rounded-2xl shadow-2xl transform rotate-2 border-4 border-white object-cover interactive-element photo-hover transition-transform duration-150"
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
          <div className="max-w-4xl">
            <div className="mt-9 animate-fade-in-up mb-30" style={{ animationDelay: '400ms' }}>
              <div className="flex gap-12 items-center flex-wrap">
              <div className="h-8 flex items-center">
                <Image 
                  src="/Assets/Logos/Rasayel Logo.svg" 
                  alt="Rasayel" 
                  width={105}
                  height={29}
                />
              </div>
              <div className="h-8 flex items-center">
                <Image 
                  src="/Assets/Logos/GoVocal Logo.svg" 
                  alt="GoVocal" 
                  width={65}
                  height={44}
                />
              </div>
              <div className="h-6 flex items-center">
                <Image 
                  src="/Assets/Logos/CambridgeJBS Logo.svg" 
                  alt="Cambridge Judge Business School" 
                  width={120}
                  height={24}
                />
              </div>
              <div className="h-8 flex items-center">
                <Image 
                  src="/Assets/Logos/CentralApp Logo.svg" 
                  alt="CentralApp" 
                  width={129}
                  height={24}
                />
                </div>
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
