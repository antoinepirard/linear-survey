import type { TargetAndTransition, Transition, VariantLabels } from 'framer-motion';

declare module 'framer-motion' {
  interface MotionProps {
    initial?: boolean | TargetAndTransition | VariantLabels;
    animate?: boolean | TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
    whileTap?: TargetAndTransition | VariantLabels;
    whileHover?: TargetAndTransition | VariantLabels;
    transition?: Transition;
    variants?: Record<string, TargetAndTransition>;
    custom?: any;
    layout?: boolean | 'size' | 'position' | 'preserve-aspect';
    layoutId?: string;
  }
}
