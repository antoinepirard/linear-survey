'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { FeedImage } from '@/data/feed';
import VideoPlayer from './VideoPlayer';


interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: FeedImage;
  allItems?: FeedImage[];
}

export default function PhotoModal({ isOpen, onClose, item, allItems }: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (item && allItems) {
      const index = allItems.findIndex(i => i.id === item.id);
      setCurrentIndex(index);
    }
  }, [item, allItems]);

  const goToPrevious = useCallback(() => {
    if (!allItems) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : allItems.length - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, allItems]);

  const goToNext = useCallback(() => {
    if (!allItems) return;
    const newIndex = currentIndex < allItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
  }, [currentIndex, allItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, onClose]);

  if (!isOpen) return null;

  // For backward compatibility with homepage usage
  if (!item || !allItems) {
    return (
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="bg-black/80 backdrop-blur-sm absolute inset-0 w-full h-full"
        />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative max-h-[90vh] overflow-hidden rounded-2xl"
        >
          <motion.img
            src="/Assets/Images/IMG_0169_2.webp"
            alt="Antoine Pirard - High Resolution"
            className="object-contain cursor-zoom-out"
            onClick={onClose}
          />
        </motion.div>
      </motion.div>
    );
  }

  const currentItem = allItems[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-black/80 backdrop-blur-sm absolute inset-0 w-full h-full"
      />

      {/* Navigation buttons */}
      {allItems && allItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative w-full h-full max-w-[90vw] max-h-[80vh] flex items-center justify-center z-10" style={{ maxHeight: '80vh' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 -right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center"
          >
            {currentItem.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center">
                <VideoPlayer 
                  src={currentItem.src} 
                  className="max-w-full max-h-full"
                  autoplay={true}
                />
              </div>
            ) : (
              <Image
                src={currentItem.src}
                alt={currentItem.name}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Item info */}
      <div className="absolute bottom-4 left-4 text-white">
        <p className="font-mono text-sm opacity-80">{currentItem.date}</p>
        <h3 className="font-medium">{currentItem.name}</h3>
        {allItems && allItems.length > 1 && (
          <p className="text-sm opacity-60 mt-1">
            {currentIndex + 1} of {allItems.length}
          </p>
        )}
      </div>
    </motion.div>
  );
}
