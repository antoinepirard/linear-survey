'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

interface MovingGridBackgroundProps {
  images: string[];
  className?: string;
  style?: React.CSSProperties;
}

export default function MovingGridBackground({ images, className, style }: MovingGridBackgroundProps) {
  // Create organized patterns for smoother animation - 4 columns
  const gridImages1 = [...images, ...images, ...images];
  const gridImages2 = [...images.slice(3), ...images.slice(0, 3), ...images.slice(3), ...images.slice(0, 3)];
  const gridImages3 = [...images.slice(6), ...images.slice(0, 6), ...images.slice(6), ...images.slice(0, 6)];
  const gridImages4 = [...images.slice(9), ...images.slice(0, 9), ...images.slice(9), ...images.slice(0, 9)];

  return (
    <div
      className={`bg-slate-50 rounded-md overflow-hidden relative mx-auto aspect-[16/9] sm:aspect-[2/1] ${className || ''}`}
      style={style}
    >
      {/* Moving grid background */}
      <div className="absolute inset-0 grid-container">
        <div className="grid-column grid-column-1">
          {gridImages1.map((src: string, index: number) => (
            <motion.div 
              key={`${src}-${index}`} 
              className="grid-item-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid-column grid-column-2">
          {gridImages2.map((src: string, index: number) => (
            <motion.div 
              key={`${src}-${index}-2`} 
              className="grid-item-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + 0.2,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid-column grid-column-3">
          {gridImages3.map((src: string, index: number) => (
            <motion.div 
              key={`${src}-${index}-3`} 
              className="grid-item-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + 0.4,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid-column grid-column-4">
          {gridImages4.map((src: string, index: number) => (
            <motion.div 
              key={`${src}-${index}-4`} 
              className="grid-item-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + 0.6,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .grid-container {
          display: flex;
          flex-direction: row;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        
        .grid-column {
          display: flex;
          flex-direction: column;
          margin-right: 12px;
        }
        
        .grid-column-1 {
          animation: moveUp 40s linear infinite;
        }
        
        .grid-column-2 {
          animation: moveDown 40s linear infinite;
        }
        
        .grid-column-3 {
          animation: moveUp 40s linear infinite;
        }
        
        .grid-column-4 {
          animation: moveDown 40s linear infinite;
        }
        
        .grid-item-wrapper {
          margin-bottom: 4px;
          flex-shrink: 0;
        }
        
        .grid-item {
          width: 320px;
          height: auto;
          border-radius: 12px;
          display: block;
        }
        
        @keyframes moveUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        
        @keyframes moveDown {
          0% { transform: translateY(-33.33%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}