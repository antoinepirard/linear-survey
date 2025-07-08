'use client';

import { motion } from 'motion/react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoModal({ isOpen, onClose }: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-black/30 backdrop-blur-sm absolute inset-0 w-full h-full"
      >
      </motion.div>

      <motion.div layoutId="photo-container" className="relative max-h-[90vh] overflow-hidden rounded-2xl">
        <motion.img
          layoutId="photo"
            src="/Assets/Images/IMG_0169_2.webp"
            alt="Antoine Pirard - High Resolution"
            className="object-contain cursor-zoom-out"
            onClick={onClose}
          />
      </motion.div>
    </motion.div>
  );
}
