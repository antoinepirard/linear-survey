'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface MovingGridBackgroundProps {
  images: string[];
  className?: string;
  style?: React.CSSProperties;
}

export default function MovingGridBackground({ images, className, style }: MovingGridBackgroundProps) {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const loadPromises = images.map((src) => {
        return new Promise<string>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(src);
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(loadPromises);
        setAllImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        // Still show images even if some fail to preload
        setAllImagesLoaded(true);
      }
    };

    preloadImages();
  }, [images]);
  // Create organized patterns for smoother animation - 4 columns
  const gridImages1 = [...images, ...images, ...images];
  const gridImages2 = [...images.slice(3), ...images.slice(0, 3), ...images.slice(3), ...images.slice(0, 3)];
  const gridImages3 = [...images.slice(6), ...images.slice(0, 6), ...images.slice(6), ...images.slice(0, 6)];
  const gridImages4 = [...images.slice(9), ...images.slice(0, 9), ...images.slice(9), ...images.slice(0, 9)];

  return (
    <div
      className={`${allImagesLoaded ? 'bg-slate-50' : 'bg-white'} rounded-md overflow-hidden relative mx-auto aspect-[16/9] sm:aspect-[2/1] transition-colors duration-700 ${className || ''}`}
      style={style}
    >

      {/* Moving grid background */}
      <div className={`absolute inset-0 grid-container ${allImagesLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="grid-column grid-column-1">
          {gridImages1.map((src: string, index: number) => (
            <motion.div 
              key={`${src}-${index}`} 
              className="grid-item-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: allImagesLoaded ? 1 : 0 }}
              transition={{ 
                duration: 0.3, 
                delay: allImagesLoaded ? index * 0.05 : 0,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
                priority={index < 6}
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
              animate={{ opacity: allImagesLoaded ? 1 : 0 }}
              transition={{ 
                duration: 0.3, 
                delay: allImagesLoaded ? index * 0.05 + 0.1 : 0,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
                priority={index < 6}
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
              animate={{ opacity: allImagesLoaded ? 1 : 0 }}
              transition={{ 
                duration: 0.3, 
                delay: allImagesLoaded ? index * 0.05 + 0.2 : 0,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
                priority={index < 6}
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
              animate={{ opacity: allImagesLoaded ? 1 : 0 }}
              transition={{ 
                duration: 0.3, 
                delay: allImagesLoaded ? index * 0.05 + 0.3 : 0,
                ease: "easeOut" 
              }}
            >
              <Image
                src={src}
                width={320}
                height={200}
                className="grid-item"
                alt="Rasayel screenshot"
                priority={index < 6}
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