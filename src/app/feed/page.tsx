'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { feedImages, FeedImage } from '@/data/feed';
import { preloadImageDimensions, ImageDimensions } from '@/utils/imageDimensions';
import HeaderSection from '@/components/HeaderSection';

export default function Feed() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({});

  useEffect(() => {
    const initializeImages = async () => {
      const imageSources = feedImages.map(item => item.src);
      const dimensions = await preloadImageDimensions(imageSources);
      setImageDimensions(dimensions);
    };

    initializeImages();
  }, []);

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const getImageDimensions = (item: FeedImage) => {
    const dimensions = imageDimensions[item.src];
    
    if (dimensions) {
      // Calculate display width to maintain aspect ratio
      // Base width of 600px for large images, adjust based on aspect ratio
      const aspectRatio = dimensions.width / dimensions.height;
      const displayWidth = Math.min(600, dimensions.width);
      const displayHeight = Math.round(displayWidth / aspectRatio);
      
      return {
        width: displayWidth,
        height: displayHeight,
        aspectRatio
      };
    }
    
    // Default square dimensions for images
    return {
      width: 600,
      height: 600,
      aspectRatio: 1
    };
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 py-9">
          <HeaderSection />
          
          <AnimationWrapper delay="50ms">
            <h1 className="text-8xl sm:text-6xl font-light text-slate-900 mb-2 text-center">Feed</h1>
            <p className="font-regular text-slate-600 mb-12 text-center">A visual collection of moments and work</p>
          </AnimationWrapper>
        </div>
      </div>
      
      {/* Wider container for feed content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 feed-container">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-8">
          {feedImages.map((item, index) => (
            <AnimationWrapper key={item.id} delay={`${100 + index * 50}ms`}>
              <div className="masonry-column break-inside-avoid mb-6">
                <div className="feed-image-container rounded overflow-hidden bg-slate-100">
                  <div className={`transition-opacity duration-300 ${loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'}`}>
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={getImageDimensions(item).width}
                      height={getImageDimensions(item).height}
                      className="w-full h-auto"
                      priority={index < 3}
                      onLoad={() => handleImageLoad(item.id)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                </div>
                <p className="text-slate-500 font-mono text-xs mt-3">{item.date}</p>
                <h3 className="text-slate-700 font-medium text-sm mt-1">{item.name}</h3>
              </div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}