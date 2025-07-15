import Image from 'next/image';
import { useCallback, useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { FeedImage } from '@/data/feed';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useLazyImageDimensions } from '@/hooks/useLazyImageDimensions';

interface FeedImageItemProps {
  item: FeedImage;
  priority?: boolean;
}

export default function FeedImageItem({ item, priority = false }: FeedImageItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, { isIntersecting }] = useIntersectionObserver({
    freezeOnceVisible: true,
    rootMargin: '200px',
  });

  // Get default dimensions from feed data or fallback
  const getDefaultDimensions = useCallback(() => {
    // Calculate responsive column width
    // Desktop: (1280px - 48px padding - 48px gaps) / 3 = ~395px
    // But use conservative 350px to account for any additional spacing
    const maxColumnWidth = 350;
    
    if (item.width && item.height) {
      const aspectRatio = item.width / item.height;
      const displayWidth = Math.min(maxColumnWidth, item.width);
      const displayHeight = Math.round(displayWidth / aspectRatio);
      return { width: displayWidth, height: displayHeight };
    }
    
    if (item.type === 'video') {
      return { width: maxColumnWidth, height: Math.round(maxColumnWidth * 0.67) }; // 3:2 aspect ratio
    }
    
    return { width: maxColumnWidth, height: maxColumnWidth }; // Square fallback
  }, [item]);

  // Load precise dimensions only when in viewport
  const { dimensions, isLoading } = useLazyImageDimensions({
    src: item.src,
    type: item.type,
    shouldLoad: isIntersecting,
    fallbackWidth: getDefaultDimensions().width,
    fallbackHeight: getDefaultDimensions().height,
  });

  // Use precise dimensions if available, otherwise use defaults
  const displayDimensions = dimensions ? {
    width: Math.min(350, dimensions.width),
    height: Math.round(Math.min(350, dimensions.width) / (dimensions.width / dimensions.height)),
  } : getDefaultDimensions();

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div ref={ref} className="masonry-column break-inside-avoid max-w-full">
      <div 
        className={`feed-image-container rounded overflow-hidden bg-slate-100 relative max-w-full ${
          item.type === 'video' ? 'video-container' : ''
        }`}
        style={{ maxWidth: '100%', width: '100%' }}
      >
        {/* Skeleton placeholder */}
        {!isLoaded && (
          <div 
            className="bg-slate-200 animate-pulse relative overflow-hidden w-full"
            style={{
              aspectRatio: `${displayDimensions.width} / ${displayDimensions.height}`,
              maxWidth: '100%',
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Video placeholder icon */}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center">
                  <PlayIcon className="w-8 h-8 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Image */}
        <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src={item.src}
            alt={item.name}
            width={displayDimensions.width}
            height={displayDimensions.height}
            className="w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
            priority={priority}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        
        {/* Video icon overlay */}
        {item.type === 'video' && (
          <a 
            href={item.videoUrl || item.src} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
            title="Watch video"
          >
            <PlayIcon className="w-4 h-4" />
          </a>
        )}
        
        {/* Loading indicator for dimension fetching */}
        {isLoading && !isLoaded && (
          <div className="absolute top-2 left-2 z-10">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
      
      <p className="text-slate-500 font-mono text-xs mt-3">{item.date}</p>
      <h3 className="text-slate-700 font-medium text-sm mt-1">{item.name}</h3>
    </div>
  );
}