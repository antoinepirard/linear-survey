import { useState, useEffect, useRef } from "react";

interface CursorPosition {
  x: number;
  y: number;
  windowWidth: number;
  windowHeight: number;
}

export function useCursorPosition() {
  const [position, setPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
    windowWidth: 0,
    windowHeight: 0,
  });
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    };

    const handleResize = () => {
      setPosition((prev) => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      }));
    };

    // Initialize window dimensions
    setPosition((prev) => ({
      ...prev,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }));

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { position, containerRef };
}
