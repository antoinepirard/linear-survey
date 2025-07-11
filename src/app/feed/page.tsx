'use client';

import Image from 'next/image';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { feedImages } from '@/data/feed';
import Navigation from '@/components/Navigation';

export default function Feed() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimationWrapper delay="0ms">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-8">
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Antoine Pirard
              </h1>
              <p className="text-base font-normal text-slate-600">
                Product designer
              </p>
            </div>
            <Navigation className="flex-shrink-0" />
          </div>
        </AnimationWrapper>
      </div>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <AnimationWrapper delay="50ms">
          <h1 className="text-3xl sm:text-4xl font-medium text-slate-900 mb-2">Feed</h1>
          <p className="text-slate-600 mb-12">A visual collection of moments and inspiration</p>
        </AnimationWrapper>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {feedImages.map((image, index) => (
            <AnimationWrapper key={image.id} delay={`${100 + index * 50}ms`}>
              <div className="break-inside-avoid mb-6">
                <div className="rounded-md overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.name}
                    width={600}
                    height={600}
                    className="w-full h-auto"
                    priority={index < 3}
                  />
                </div>
                <p className="text-slate-500 font-mono text-xs mt-3">{image.date}</p>
                <h3 className="text-slate-700 font-medium text-sm mt-1">{image.name}</h3>
              </div>
            </AnimationWrapper>
          ))}
        </div>
      </main>
    </div>
  );
}