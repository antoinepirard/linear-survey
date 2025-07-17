'use client';

import { useCallback, useMemo } from 'react';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { feedImages, FeedImage } from '@/data/feed';
import HeaderSection from '@/components/HeaderSection';
import FeedImageItem from '@/components/FeedImageItem';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

export default function Feed() {
  
  const sortedFeedImages = [...feedImages].sort((a, b) => {
    const yearA = parseInt(a.date);
    const yearB = parseInt(b.date);
    return yearB - yearA;
  });



  const getDefaultDimensions = useCallback((item: FeedImage) => {
    // Base width should match the column width  
    const maxColumnWidth = 350;
    
    // Use feed data dimensions if available
    if (item.width && item.height) {
      const aspectRatio = item.width / item.height;
      const displayWidth = Math.min(maxColumnWidth, item.width);
      const displayHeight = Math.round(displayWidth / aspectRatio);
      
      return {
        width: displayWidth,
        height: displayHeight,
        aspectRatio
      };
    }
    
    // Default dimensions based on media type
    if (item.type === 'video') {
      return {
        width: maxColumnWidth,
        height: Math.round(maxColumnWidth * 0.67), // 3:2 aspect ratio for videos
        aspectRatio: 3/2
      };
    }
    
    // Default square aspect ratio for images
    return {
      width: maxColumnWidth,
      height: maxColumnWidth,
      aspectRatio: 1
    };
  }, []);

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
      
      const itemDimensions = getDefaultDimensions(item);
      const estimatedHeight = itemDimensions.height + 100; // Add margin/padding
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });

    return columns;
  }, [sortedFeedImages, getDefaultDimensions]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 pt-20 pb-9 sm:py-9">
          <HeaderSection />
          
          <AnimationWrapper delay="50ms">
            <h1 className="text-4xl sm:text-6xl font-light text-slate-900 mb-2 text-center">Feed</h1>
            <p className="font-regular text-slate-600 mb-4 text-center">A visual collection of moments and work</p>
            <div className="flex justify-center mb-12">
              <a href="https://ninethirty.substack.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white border border-slate-100 text-slate-700 hover:border-slate-200 transition-colors">
                <Image 
                  src="/Assets/Images/substack.png" 
                  alt="Substack logo" 
                  width={16} 
                  height={16}
                  className="rounded-sm"
                />
                read my substack
                <ArrowUpRightIcon className="w-4 h-4" />
              </a>
            </div>
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
                    <FeedImageItem
                      item={item}
                      priority={globalIndex < 3}
                    />
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