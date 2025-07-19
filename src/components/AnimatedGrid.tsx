'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedGridProps {
  className?: string;
  gridSize?: number;
  strokeWidth?: number;
  color?: string;
  animationDuration?: number;
  delayBetweenLines?: number;
}

export default function AnimatedGrid({
  className = '',
  gridSize = 50,
  strokeWidth = 1,
  color = '#e2e8f0',
  animationDuration = 0.8,
  delayBetweenLines = 0.05
}: AnimatedGridProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Calculate grid lines
  const horizontalLines = Math.ceil(dimensions.height / gridSize) + 1;

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        style={{ zIndex: 0 }}
      >
        {/* Horizontal lines */}
        {Array.from({ length: horizontalLines }, (_, i) => (
          <motion.line
            key={`h-${i}`}
            x1={0}
            y1={i * gridSize}
            x2={dimensions.width}
            y2={i * gridSize}
            stroke={color}
            strokeWidth={strokeWidth}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration: animationDuration,
              delay: i * delayBetweenLines,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}