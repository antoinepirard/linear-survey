'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomScrollbarProps {
  containerRef: React.RefObject<HTMLElement>;
  isVisible: boolean;
  className?: string;
}

export function CustomScrollbar({ containerRef, isVisible, className = '' }: CustomScrollbarProps) {
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    thumbHeight: 0,
    thumbTop: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringThumb, setIsHoveringThumb] = useState(false);
  const dragStartRef = useRef({ startY: 0, startScrollTop: 0 });

  const updateScrollInfo = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Calculate thumb dimensions and position
    const scrollRatio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(20, clientHeight * scrollRatio); // Minimum 20px height
    const trackHeight = clientHeight - 8; // Account for padding
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - thumbHeight) + 4; // 4px padding

    setScrollInfo({
      scrollTop,
      scrollHeight,
      clientHeight,
      thumbHeight,
      thumbTop: isNaN(thumbTop) ? 0 : thumbTop,
    });
  }, [containerRef]);

  // Update scroll info when container scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollInfo();
    
    const handleScroll = () => updateScrollInfo();
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also update on resize
    const resizeObserver = new ResizeObserver(updateScrollInfo);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef, updateScrollInfo]);

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    e.preventDefault();
    setIsDragging(true);
    
    dragStartRef.current = {
      startY: e.clientY,
      startScrollTop: containerRef.current.scrollTop,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;

      const deltaY = moveEvent.clientY - dragStartRef.current.startY;
      const scrollRange = scrollInfo.scrollHeight - scrollInfo.clientHeight;
      const trackRange = scrollInfo.clientHeight - scrollInfo.thumbHeight - 8; // Account for padding
      const scrollDelta = (deltaY / trackRange) * scrollRange;
      
      containerRef.current.scrollTop = dragStartRef.current.startScrollTop + scrollDelta;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [containerRef, scrollInfo]);

  // Handle track clicks
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const scrollRatio = clickY / trackHeight;
    const scrollTarget = scrollRatio * (scrollInfo.scrollHeight - scrollInfo.clientHeight);
    
    containerRef.current.scrollTo({
      top: scrollTarget,
      behavior: 'smooth',
    });
  }, [containerRef, scrollInfo]);

  // Don't render if content doesn't overflow
  const hasOverflow = scrollInfo.scrollHeight > scrollInfo.clientHeight;
  if (!hasOverflow) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.4, 0, 0.2, 1] // cubic-bezier for smooth easing
          }}
          className={`absolute right-1 top-1 bottom-1 w-2.5 ${className}`}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Scrollbar track */}
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handleTrackClick}
          >
            {/* Scrollbar thumb */}
            <motion.div
              className={`absolute right-0 rounded-full cursor-grab transition-colors duration-200 ${
                isDragging || isHoveringThumb
                  ? 'bg-slate-400/60' 
                  : 'bg-slate-400/30'
              } ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{
                width: '8px',
                height: `${scrollInfo.thumbHeight}px`,
                top: `${scrollInfo.thumbTop}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseEnter={() => setIsHoveringThumb(true)}
              onMouseLeave={() => setIsHoveringThumb(false)}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}