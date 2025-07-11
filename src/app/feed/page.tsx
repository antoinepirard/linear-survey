'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { feedImages, FeedImage } from '@/data/feed';
import { generateVideoThumbnail, formatDuration } from '@/utils/videoThumbnail';
import HeaderSection from '@/components/HeaderSection';
import PhotoModal from '@/components/PhotoModal';

export default function Feed() {
  const [selectedItem, setSelectedItem] = useState<FeedImage | null>(null);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});

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
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
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

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {feedImages.map((item, index) => (
              <AnimationWrapper key={item.id} delay={`${100 + index * 50}ms`}>
                <div className="break-inside-avoid mb-6">
                  <div 
                    className="rounded-md overflow-hidden cursor-pointer relative group"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.type === 'video' ? (
                      <>
                        <Image
                          src={videoThumbnails[item.id] || '/Assets/Images/placeholder.jpg'}
                          alt={item.name}
                          width={600}
                          height={600}
                          className="w-full h-auto"
                          priority={index < 3}
                        />
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
                      <Image
                        src={item.src}
                        alt={item.name}
                        width={600}
                        height={600}
                        className="w-full h-auto"
                        priority={index < 3}
                      />
                    )}
                  </div>
                  <p className="text-slate-500 font-mono text-xs mt-3">{item.date}</p>
                  <h3 className="text-slate-700 font-medium text-sm mt-1">{item.name}</h3>
                </div>
              </AnimationWrapper>
            ))}
          </div>

          {selectedItem && (
            <PhotoModal 
              isOpen={true}
              onClose={handleCloseModal}
              item={selectedItem}
              allItems={feedImages}
            />
          )}
        </div>
      </div>
    </div>
  );
}