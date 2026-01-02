'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface RadarVoteProps {
  options: string[];
  onValuesChange: (values: number[]) => void;
}

const SIZE = 500;
const CENTER = SIZE / 2;
const MAX_RADIUS = SIZE / 2 - 70; // Leave room for labels
const MIN_RADIUS = 30;

export function RadarVote({ options, onValuesChange }: RadarVoteProps) {
  // Values from 0-1 representing how far out each vertex is
  const [values, setValues] = useState<number[]>(() => options.map(() => 0.5));
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingIndex = useRef<number | null>(null);

  const numOptions = options.length;

  // Calculate angle for each option (starting from top, going clockwise)
  const getAngle = (index: number) => {
    return (2 * Math.PI * index) / numOptions - Math.PI / 2;
  };

  // Convert polar to cartesian
  const getPoint = (index: number, value: number) => {
    const angle = getAngle(index);
    const radius = MIN_RADIUS + value * (MAX_RADIUS - MIN_RADIUS);
    return {
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
    };
  };

  // Get label position (slightly outside max radius)
  const getLabelPoint = (index: number) => {
    const angle = getAngle(index);
    const radius = MAX_RADIUS + 50;
    return {
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
    };
  };

  // Calculate the distance from center for a touch point relative to vertex angle
  const getValueFromPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return 0.5;

    const rect = svgRef.current.getBoundingClientRect();
    // Scale coordinates to SVG viewBox
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Calculate distance from center
    const dx = x - CENTER;
    const dy = y - CENTER;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize to 0-1 range
    const value = (distance - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS);
    return Math.max(0, Math.min(1, value));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, index: number) => {
    draggingIndex.current = index;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (draggingIndex.current === null) return;

    const newValue = getValueFromPoint(e.clientX, e.clientY);
    setValues((prev) => {
      const updated = [...prev];
      updated[draggingIndex.current!] = newValue;
      onValuesChange(updated);
      return updated;
    });
  }, [getValueFromPoint, onValuesChange]);

  const handlePointerUp = useCallback(() => {
    draggingIndex.current = null;
  }, []);

  // Build the polygon path from current values
  const polygonPoints = values
    .map((value, index) => {
      const point = getPoint(index, value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  // Grid lines (concentric rings)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="touch-none w-full max-w-[500px] aspect-square"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Grid rings */}
        {gridLevels.map((level) => {
          const radius = MIN_RADIUS + level * (MAX_RADIUS - MIN_RADIUS);
          return (
            <circle
              key={level}
              cx={CENTER}
              cy={CENTER}
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          );
        })}

        {/* Grid lines from center to each vertex */}
        {options.map((_, index) => {
          const endPoint = getPoint(index, 1);
          return (
            <line
              key={index}
              x1={CENTER}
              y1={CENTER}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          );
        })}

        {/* Filled polygon showing current shape */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(249, 115, 22, 0.3)"
          stroke="#f97316"
          strokeWidth={2}
          initial={false}
        />

        {/* Draggable vertices */}
        {values.map((value, index) => {
          const point = getPoint(index, value);
          return (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={16}
              fill="#f97316"
              stroke="white"
              strokeWidth={3}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={false}
            />
          );
        })}

        {/* Labels */}
        {options.map((option, index) => {
          const labelPoint = getLabelPoint(index);
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-semibold fill-slate-900"
            >
              {option}
            </text>
          );
        })}
      </svg>

      {/* Values display */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {options.map((option, index) => (
          <div key={index} className="text-center">
            <span className="text-sm text-slate-500">{option}</span>
            <motion.div
              className="text-xl font-bold tabular-nums text-slate-900"
              key={Math.round(values[index] * 100)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {Math.round(values[index] * 100)}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-slate-400 mt-4">
        Drag points to shape your preferences
      </p>
    </div>
  );
}
