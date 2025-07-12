'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { feedImages, FeedImage } from '@/data/feed';
import { generateVideoThumbnail, formatDuration } from '@/utils/videoThumbnail';
import HeaderSection from '@/components/HeaderSection';

export default function Feed() {
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const generateThumbnails = async () => {
      const thumbnails: Record<number, string> = {};
      
      for (const item of feedImages) {
        if (item.type === 'video') {
          try {
            const thumbnail = await generateVideoThumbnail(item.src);
            thumbnails[item.id] = thumbnail;
          } catch (error) {
            console.error('Failed to generate thumbnail for video:', item.id, error);
          }
        }
      }
      
      setVideoThumbnails(thumbnails);
    };

    generateThumbnails();
  }, []);

  const handleItemClick = (item: FeedImage) => {
    if (item.type === 'video') {
      // Open video in new tab - you can replace with actual video URLs
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    }
  };

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {feedImages.map((item, index) => (
            <AnimationWrapper key={item.id} delay={`${100 + index * 50}ms`}>
              <div className="break-inside-avoid mb-6">
                <div 
                  className={`rounded-md overflow-hidden relative group ${item.type === 'video' ? 'cursor-pointer' : ''} bg-slate-100`}
                  onClick={() => handleItemClick(item)}
                  >
                    {item.type === 'video' ? (
                      <>
                        <div className={`transition-opacity duration-300 ${loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'}`}>
                          <Image
                            src={videoThumbnails[item.id] || '/Assets/Images/placeholder.jpg'}
                            alt={item.name}
                            width={600}
                            height={600}
                            className="w-full h-auto"
                            priority={index < 3}
                            onLoad={() => handleImageLoad(item.id)}
                            sizes="100vw"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <PlayIcon className="w-6 h-6 text-slate-800 ml-1" />
                          </div>
                        </div>
                        {item.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(item.duration)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={`transition-opacity duration-300 ${loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'}`}>
                        <Image
                          src={item.src}
                          alt={item.name}
                          width={600}
                          height={600}
                          className="w-full h-auto"
                          priority={index < 3}
                          onLoad={() => handleImageLoad(item.id)}
                          sizes="100vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                    )}
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