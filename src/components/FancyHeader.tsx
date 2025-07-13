'use client';

import React, { useState, useRef } from 'react';

interface FancyHeaderProps {
  dateRange?: string;
  title: string;
  description: string;
  className?: string;
}

export function FancyHeader({ 
  dateRange, 
  title, 
  description, 
  className = "" 
}: FancyHeaderProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <header 
      ref={headerRef}
      className={`mb-12 text-center group border border-dashed transition-all duration-200 p-6 -m-6 relative cursor-move select-none ${
        isSelected 
          ? 'border-orange-500' 
          : 'border-slate-300 hover:border-slate-400'
      } ${isDragging ? 'transition-none' : ''} ${className}`}
      onClick={() => setIsSelected(!isSelected)}
      onMouseDown={handleDragStart}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transformOrigin: 'center'
      }}
    >
      {/* Corner squares - visual indicators only */}
      <div 
        className={`absolute -top-1 -left-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
          isSelected 
            ? 'bg-orange-500' 
            : 'bg-slate-300 group-hover:bg-slate-400'
        }`}
      />
      <div 
        className={`absolute -top-1 -right-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
          isSelected 
            ? 'bg-orange-500' 
            : 'bg-slate-300 group-hover:bg-slate-400'
        }`}
      />
      <div 
        className={`absolute -bottom-1 -left-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
          isSelected 
            ? 'bg-orange-500' 
            : 'bg-slate-300 group-hover:bg-slate-400'
        }`}
      />
      <div 
        className={`absolute -bottom-1 -right-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
          isSelected 
            ? 'bg-orange-500' 
            : 'bg-slate-300 group-hover:bg-slate-400'
        }`}
      />
      
      {dateRange && (
        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
          <span className='font-mono'>{dateRange}</span>
        </div>
      )}
      
      <h1 className="text-5xl font-bold text-slate-900 mt-6 mb-4 tracking-tight">
        {title}
      </h1>
      
      <p className="text-lg text-slate-700 mb-12">
        {description}
      </p>
    </header>
  );
}