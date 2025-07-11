'use client';

import Image from 'next/image';
import { AnimationWrapper } from '@/hooks/useAnimation';
import { feedImages } from '@/data/feed';
import HeaderSection from '@/components/HeaderSection';

export default function Feed() {
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
        </div>
      </div>
    </div>
  );
}