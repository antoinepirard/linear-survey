import Image from 'next/image';
import { MotionBlurWrapper } from '@/hooks/useAnimation';
import { companyLogos } from '@/data/staticData';

export default function CompanyLogos() {
  return (
    <div className="max-w-2xl">
      <div className="mt-9 mb-12">
        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center flex-wrap">
          {companyLogos.map((logo, index) => (
            <MotionBlurWrapper
              key={logo.alt}
              className="flex items-center"
              delay={logo.delay}
              duration={0.5}
            >
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                width={logo.width}
                height={logo.height}
                className="w-auto"
                style={{ 
                  height: index === 2 ? '24px' : '32px',
                  maxWidth: logo.maxWidth
                }}
              />
            </MotionBlurWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}