import { useState, useCallback, useRef } from 'react';

interface UseResizableProps {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  onWidthChange: (width: number) => void;
}

interface UseResizableReturn {
  isResizing: boolean;
  handleResizeStart: (e: React.MouseEvent) => void;
}

export function useResizable({
  initialWidth,
  minWidth,
  maxWidth,
  onWidthChange,
}: UseResizableProps): UseResizableReturn {
  const [isResizing, setIsResizing] = useState(false);
  const startDataRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!startDataRef.current) return;

    const { startX, startWidth } = startDataRef.current;
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
    
    onWidthChange(newWidth);
  }, [minWidth, maxWidth, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    startDataRef.current = null;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, [handleMouseMove]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    startDataRef.current = {
      startX: e.clientX,
      startWidth: initialWidth,
    };

    // Disable text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [initialWidth, handleMouseMove, handleMouseUp]);

  return {
    isResizing,
    handleResizeStart,
  };
}