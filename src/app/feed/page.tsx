'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimationWrapper } from '@/hooks/useAnimation';
import VideoPlayer from '@/components/VideoPlayer';
import { feedImages, FeedImage } from '@/data/feed';
import { preloadMediaDimensions, ImageDimensions } from '@/utils/imageDimensions';
import HeaderSection from '@/components/HeaderSection';

export default function Feed() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({});
  
  const sortedFeedImages = [...feedImages].sort((a, b) => {
    const yearA = parseInt(a.date);
    const yearB = parseInt(b.date);
    return yearB - yearA;
  });

  useEffect(() => {
    const initializeImages = async () => {
      const mediaItems = sortedFeedImages.map(item => ({
        src: item.src,
        type: item.type || 'image'
      }));
      const dimensions = await preloadMediaDimensions(mediaItems);
      setImageDimensions(dimensions);
    };

    initializeImages();
  }, [sortedFeedImages]);

  const handleImageLoad = useCallback((id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  }, []);

  const getImageDimensions = useCallback((item: FeedImage) => {
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
    
    // Default dimensions - 16:9 for videos, square for images
    if (item.type === 'video') {
      return {
        width: 600,
        height: 338, // 16:9 aspect ratio
        aspectRatio: 16/9
      };
    }
    
    return {
      width: 600,
      height: 600,
      aspectRatio: 1
    };
  }, [imageDimensions]);

  const masonryColumns = useMemo(() => {
    const getColumnCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
      }
      return 3;
    };

    const columnCount = getColumnCount();
    const columns: FeedImage[][] = Array(columnCount).fill(null).map(() => []);
    const columnHeights = Array(columnCount).fill(0);

    sortedFeedImages.forEach((item) => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[shortestColumnIndex].push(item);
      
      const itemDimensions = getImageDimensions(item);
      const estimatedHeight = itemDimensions.height + 100; // Add margin/padding
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });

    return columns;
  }, [sortedFeedImages, getImageDimensions]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 pt-20 pb-9 sm:py-9">
          <HeaderSection />
          
          <AnimationWrapper delay="50ms">
            <h1 className="text-4xl sm:text-6xl font-light text-slate-900 mb-2 text-center">Feed</h1>
            <p className="font-regular text-slate-600 mb-12 text-center">A visual collection of moments and work</p>
          </AnimationWrapper>
        </div>
      </div>
      
      {/* Wider container for feed content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 feed-container">
        <div className="flex gap-6 items-start">
          {masonryColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 space-y-6">
              {column.map((item) => {
                const globalIndex = sortedFeedImages.findIndex(feedItem => feedItem.id === item.id);
                return (
                  <AnimationWrapper key={item.id} delay={`${100 + globalIndex * 50}ms`}>
                    <div className="masonry-column break-inside-avoid">
                      <div className={`feed-image-container rounded overflow-hidden bg-slate-100 ${item.type === 'video' ? 'video-container' : ''}`}>
                        <div className={`transition-opacity duration-300 ${loadedImages.has(item.id) || item.type === 'video' ? 'opacity-100' : 'opacity-0'}`}>
                          {item.type === 'video' ? (
                            <div style={{
                              aspectRatio: getImageDimensions(item).aspectRatio || 'auto',
                              height: 'auto'
                            }}>
                              <VideoPlayer
                                src={item.src}
                                className="w-full block"
                                enableLazyLoading={true}
                                poster={item.poster}
                              />
                            </div>
                          ) : (
                            <Image
                              src={item.src}
                              alt={item.name}
                              width={getImageDimensions(item).width}
                              height={getImageDimensions(item).height}
                              className="w-full h-auto"
                              priority={globalIndex < 3}
                              onLoad={() => handleImageLoad(item.id)}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-slate-500 font-mono text-xs mt-3">{item.date}</p>
                      <h3 className="text-slate-700 font-medium text-sm mt-1">{item.name}</h3>
                    </div>
                  </AnimationWrapper>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}