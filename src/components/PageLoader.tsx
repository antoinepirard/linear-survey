'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import duoSlidingCubes from '../../public/Assets/Animated/Duo Sliding Cubes v1.json';

interface PageLoaderProps {
  onComplete?: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 300); // Additional delay for fade-out animation
    }, 1000); // 1 second delay as requested

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div 
        className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-out"
        style={{ 
          animation: 'fade-out 300ms ease-out forwards',
          pointerEvents: 'none'
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-24 h-24">
        <Lottie
          animationData={duoSlidingCubes}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}