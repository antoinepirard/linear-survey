import { useState, useCallback, useRef, useEffect } from "react";

interface UseResizableProps {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  onWidthChange: (width: number) => void;
  elementRef: React.RefObject<HTMLElement | null>; // Direct DOM reference
}

interface UseResizableReturn {
  isResizing: boolean;
  handleResizeStart: (e: React.MouseEvent) => void;
  currentWidth: number;
}

export function useResizable({
  initialWidth,
  minWidth,
  maxWidth,
  onWidthChange,
  elementRef,
}: UseResizableProps): UseResizableReturn {
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(initialWidth);
  const startDataRef = useRef<{ startX: number; startWidth: number } | null>(
    null
  );
  const rafIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Direct DOM update for smooth visual feedback
  const updateVisualWidth = useCallback(
    (width: number) => {
      if (!elementRef.current) return;

      // Cancel any pending RAF to avoid stacking
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (elementRef.current) {
          // Update CSS custom property for immediate visual feedback
          elementRef.current.style.setProperty("--sidebar-width", `${width}px`);
          setCurrentWidth(width);
        }
      });
    },
    [elementRef]
  );

  // Throttled React state update (for persistence)
  const throttledStateUpdate = useCallback(
    (width: number) => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 16) {
        // ~60fps throttling
        onWidthChange(width);
        lastUpdateRef.current = now;
      }
    },
    [onWidthChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!startDataRef.current) return;

      const { startX, startWidth } = startDataRef.current;
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidth + deltaX)
      );

      // Immediate visual update (no React re-render)
      updateVisualWidth(newWidth);

      // Throttled state update for persistence
      throttledStateUpdate(newWidth);
    },
    [minWidth, maxWidth, updateVisualWidth, throttledStateUpdate]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);

    // Final state update to ensure persistence
    if (currentWidth !== initialWidth) {
      onWidthChange(currentWidth);
    }

    startDataRef.current = null;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // Re-enable text selection and restore cursor
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // Re-enable CSS transitions after resize is complete
    if (elementRef.current) {
      elementRef.current.style.transition = "width 0.2s ease-out";
    }
  }, [currentWidth, initialWidth, onWidthChange, handleMouseMove, elementRef]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      startDataRef.current = {
        startX: e.clientX,
        startWidth: currentWidth,
      };

      // Disable CSS transitions during resize for smooth dragging
      if (elementRef.current) {
        elementRef.current.style.transition = "none";
      }

      // Disable text selection during resize
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [currentWidth, handleMouseMove, handleMouseUp, elementRef]
  );

  // Sync currentWidth with initialWidth when not resizing
  useEffect(() => {
    if (!isResizing) {
      setCurrentWidth(initialWidth);
    }
  }, [initialWidth, isResizing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    isResizing,
    handleResizeStart,
    currentWidth,
  };
}
