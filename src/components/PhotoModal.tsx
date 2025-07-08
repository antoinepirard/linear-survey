'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoModal({ isOpen, onClose }: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <motion.div
        layoutId="photo"
        className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src="/Assets/Images/IMG_0169_2.webp"
          alt="Antoine Pirard - High Resolution"
          width={800}
          height={1000}
          className="rounded-2xl object-contain max-w-full max-h-full cursor-zoom-out"
          style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          onClick={onClose}
          priority
        />
      </motion.div>
    </motion.div>
  );
}