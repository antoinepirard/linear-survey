import { AnimationWrapper } from '@/hooks/useAnimation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeftIcon as ChevronLeftIconSolid } from '@heroicons/react/24/solid';
import Navigation from './Navigation';

export default function HeaderSection() {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    // Initial check
    checkMobile();
    
    // Throttled resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkMobile]);

  const headerY = useTransform(scrollY, [0, 100], [0, -20]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const stickyOpacity = useTransform(scrollY, [80, 120], [0, 1]);

  return (
    <>
      {/* Original header - hidden on mobile */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative z-10 hidden sm:block"
      >
        <AnimationWrapper delay="0ms" className="pt-9">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div>
              {isHomePage ? (
                <div className="inline-block -mx-2 -my-1 px-2 py-1">
                  <div className="relative h-10 flex flex-col justify-center">
                    <div>
                      <h1 className="text-base font-semibold text-slate-900 leading-tight">
                        Antoine Pirard
                      </h1>
                      <p className="text-base font-normal text-slate-600 leading-tight">
                        Product designer
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="inline-block -mx-2 -my-1 px-2 py-1 rounded-md cursor-pointer"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <Link href="/">
                    <motion.div 
                      className="relative h-10 overflow-hidden flex flex-col justify-center rounded-md"
                      variants={{
                        rest: { backgroundColor: 'rgb(248 250 252 / 0)' },
                        hover: { backgroundColor: 'rgb(248 250 252 / 1)' }
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        variants={{
                          rest: { y: 0, opacity: 1 },
                          hover: { y: -12, opacity: 0 }
                        }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <h1 className="text-base font-semibold text-slate-900 leading-tight">
                          Antoine Pirard
                        </h1>
                        <p className="text-base font-normal text-slate-600 leading-tight">
                          Product designer
                        </p>
                      </motion.div>
                      <motion.div 
                        className="absolute inset-y-0 left-2 flex items-center"
                        variants={{
                          rest: { y: 12, opacity: 0 },
                          hover: { y: 0, opacity: 1 }
                        }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="flex items-center">
                          <ChevronLeftIconSolid className="w-3 h-3 text-slate-900 mr-1" />
                          <p className="text-sm font-medium text-slate-900">
                            Back to home
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </div>
            <Navigation className="flex-shrink-0" />
          </div>
        </AnimationWrapper>
      </motion.div>

      {/* Sticky navbar - always visible on mobile, scroll-triggered on desktop */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-slate-100"
        style={{ opacity: isMobile ? 1 : stickyOpacity }}
      >
        <div className="max-w-4xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer">
              Antoine Pirard
            </Link>
            <Navigation showDot={false} />
          </div>
        </div>
      </motion.div>
    </>
  );
}