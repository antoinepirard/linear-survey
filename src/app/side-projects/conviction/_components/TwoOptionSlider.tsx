'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TwoOptionSliderProps {
  options: [string, string];
  onValueChange: (values: [number, number]) => void;
}

export function TwoOptionSlider({ options, onValueChange }: TwoOptionSliderProps) {
  // Value is 0-100, representing how much goes to option B (right side)
  const [value, setValue] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setValue(percentage);
    onValueChange([100 - percentage, percentage]);
  }, [onValueChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValue(e.clientX);
  }, [updateValue]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging.current) {
      updateValue(e.clientX);
    }
  }, [updateValue]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const leftPoints = Math.round(100 - value);
  const rightPoints = Math.round(value);

  return (
    <div className="w-full px-4 py-8">
      {/* Option labels with points */}
      <div className="flex justify-between mb-6">
        <div className="text-center px-4 py-2 rounded-lg bg-white border-2 border-slate-100">
          <div className="text-lg font-semibold text-slate-900">{options[0]}</div>
          <motion.div
            className="text-3xl font-bold tabular-nums text-slate-900"
            key={leftPoints}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {leftPoints}
          </motion.div>
        </div>
        <div className="text-center px-4 py-2 rounded-lg bg-white border-2 border-slate-100">
          <div className="text-lg font-semibold text-slate-900">{options[1]}</div>
          <motion.div
            className="text-3xl font-bold tabular-nums text-slate-900"
            key={rightPoints}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {rightPoints}
          </motion.div>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className="relative h-14 bg-slate-100 rounded-full cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Left fill (option A) */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-l-full"
          style={{ width: `${100 - value}%`, backgroundColor: '#3B82F6' }}
          initial={false}
          animate={{ width: `${100 - value}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />

        {/* Right fill (option B) */}
        <motion.div
          className="absolute right-0 top-0 h-full rounded-r-full"
          style={{ width: `${value}%`, backgroundColor: '#FF6B5B' }}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-slate-900"
          style={{ left: `calc(${value}% - 16px)` }}
          initial={false}
          animate={{ left: `calc(${value}% - 16px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-slate-400 mt-4">
        Drag to adjust your preference
      </p>
    </div>
  );
}
