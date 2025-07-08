import { ReactNode } from 'react';
import { motion } from 'motion/react';

export interface AnimationWrapperProps {
  children: ReactNode;
  delay?: string;
  className?: string;
}

export const AnimationWrapper = ({ children, delay = '0ms', className = '' }: AnimationWrapperProps) => {
  return (
    <div className={`animate-fade-in-up ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
};

export interface MotionBlurWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export const MotionBlurWrapper = ({ 
  children, 
  delay = 0, 
  className = '',
  duration = 0.5 
}: MotionBlurWrapperProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};