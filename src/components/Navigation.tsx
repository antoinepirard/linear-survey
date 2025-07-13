import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface NavigationProps {
  className?: string;
  showDot?: boolean;
}

export default function Navigation({ className, showDot = true }: NavigationProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [dotPosition, setDotPosition] = useState({ left: 0, width: 0 });
  const [isDotReady, setIsDotReady] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const items = [
    { href: '/', label: 'Work' },
    { href: '/feed', label: 'Feed' }
  ];

  const updateDotPosition = (element: HTMLElement) => {
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = element.getBoundingClientRect();
      setDotPosition({
        left: itemRect.left - navRect.left + (itemRect.width / 2) - 2,
        width: 4
      });
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const activeItem = navRef.current?.querySelector(`[href="${pathname}"]`) as HTMLElement;
      if (activeItem) {
        updateDotPosition(activeItem);
        setIsDotReady(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <nav className={className}>
      <div ref={navRef} className="flex gap-6 relative">
        {items.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`text-sm font-regular transition-colors py-2 px-1 -mx-1 ${
              pathname === item.href 
                ? 'text-slate-900' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
            onMouseEnter={(e) => {
              setHoveredItem(item.href);
              updateDotPosition(e.currentTarget);
            }}
            onMouseLeave={() => {
              setHoveredItem(null);
              const activeItem = navRef.current?.querySelector(`[href="${pathname}"]`) as HTMLElement;
              if (activeItem) {
                updateDotPosition(activeItem);
              }
            }}
          >
            {item.label}
          </Link>
        ))}
        
        {showDot && isDotReady && (
          <motion.div
            className="absolute bottom-[-2px] h-1 w-1 bg-slate-300 rounded-full"
            initial={{ 
              opacity: 0,
              left: dotPosition.left,
              scale: 1
            }}
            animate={{
              left: dotPosition.left,
              scale: hoveredItem ? 1.2 : 1,
              opacity: 1
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.2 }
            }}
          />
        )}
      </div>
    </nav>
  );
}