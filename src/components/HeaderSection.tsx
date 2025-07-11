import { AnimationWrapper } from '@/hooks/useAnimation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import Navigation from './Navigation';

export default function HeaderSection() {
  const { scrollY } = useScroll();

  const headerY = useTransform(scrollY, [0, 100], [0, -20]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const stickyOpacity = useTransform(scrollY, [80, 120], [0, 1]);

  return (
    <>
      {/* Original header */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative z-10"
      >
        <AnimationWrapper delay="0ms" className="pt-9">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
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
      </motion.div>

      {/* Sticky navbar */}
      <motion.div
        style={{ opacity: stickyOpacity }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-slate-100"
      >
        <div className="max-w-4xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors">
              Antoine Pirard
            </Link>
            <Navigation showDot={false} />
          </div>
        </div>
      </motion.div>
    </>
  );
}