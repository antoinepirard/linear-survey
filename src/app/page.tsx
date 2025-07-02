'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ListItem from '@/components/ListItem';
import LocationTime from '@/components/LocationTime';

const highlightsData = [
  {
    title: 'Rasayel Reporting',
    description: 'Lead Platform Team',
    category: '2021 – Present',
    href: '#'
  },  {
    title: 'Rasayel Automations',
    description: 'Product Research & Design',
    category: '2021 – Present',
    href: '#'
  },
  {
    title: 'Rasayel Inbox',
    description: 'Product strategy and development',
    category: 'Product',
    href: '#'
  },
  {
    title: 'GoVocal',
    description: 'Design tool and workflow optimization',
    category: 'Product, Web',
    href: '#'
  },
  {
    title: 'Insights',
    description: 'Data visualization and analytics platform',
    category: 'Web',
    href: '#'
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
                <h1 className="text-base font-bold text-slate-900">
                  Antoine Pirard
                </h1>
                <p className="text-base font-regular text-slate-600">
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
                className="cursor-zoom-in"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/Assets/Images/antoine-olivia.jpg"
                  alt="Antoine Pirard"
                  width={200}
                  height={250}
                  className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-1 transition-transform duration-300 border-4 border-white"
                  priority
                />
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <p className="text-base font-medium leading-relaxed text-slate-950">
                Product design leader scaling startups from nothing to millions in ARR.
              </p>
              <p className="text-base leading-relaxed text-slate-700">
                — I&apos;m building experiences and teams that allow businesses to scale to their full potential.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="text-base leading-relaxed text-slate-600">
                Over the last 10 years, I&apos;ve helped early-stage startup founders create products from the ground up, 
                led teams and developed successful product strategy. I thrive in strategic chaos clearing and crafting 
                the detailed experiences that make a product feel complete.
              </p>
            </div>
          </div>

          {/* Highlights Section */}
          <ListItem items={highlightsData} title="Highlights" animationDelay="300ms" />

          {/* Company Logos Section */}
          <div className="mt-9 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              layoutId="photo"
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              <Image
                src="/Assets/Images/IMG_0169 2.jpeg"
                alt="Antoine Pirard - High Resolution"
                width={800}
                height={1000}
                className="rounded-2xl object-contain max-w-full max-h-full cursor-zoom-out"
                onClick={() => setIsModalOpen(false)}
                priority
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
