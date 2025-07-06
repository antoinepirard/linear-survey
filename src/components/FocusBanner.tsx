'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusInfo {
  element: string;
  description: string;
  action: string;
}

export default function FocusBanner() {
  const [focusInfo, setFocusInfo] = useState<FocusInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wasTabPressed, setWasTabPressed] = useState(false);

  useEffect(() => {
    // Track Tab key presses
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setWasTabPressed(true);
        // Reset after a short delay to catch the focus event
        setTimeout(() => setWasTabPressed(false), 100);
      }
    };

    const handleMouseDown = () => {
      // Immediately disable tab flag when mouse is used
      setWasTabPressed(false);
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const getFocusInfo = (element: Element): FocusInfo | null => {
      const tagName = element.tagName.toLowerCase();
      const ariaLabel = element.getAttribute('aria-label');
      
      // Photo container
      if (element.getAttribute('role') === 'button' && ariaLabel?.includes('photo')) {
        return {
          element: 'Photo',
          description: 'Profile photo by Antoine Pirard',
          action: 'Press Enter or Space to view full size'
        };
      }

      // Links
      if (tagName === 'a') {
        const href = element.getAttribute('href');
        const text = element.textContent?.trim() || '';
        
        if (href?.startsWith('mailto:')) {
          return {
            element: 'Email Link',
            description: `Send email to ${text}`,
            action: 'Press Enter to open email client'
          };
        }
        
        if (href?.startsWith('https://x.com') || href?.includes('twitter')) {
          return {
            element: 'X (Twitter) Link',
            description: `Visit ${text} on X`,
            action: 'Press Enter to open in new tab'
          };
        }
        
        if (href?.startsWith('/case-studies/')) {
          return {
            element: 'Case Study',
            description: text,
            action: 'Press Enter to view case study'
          };
        }
        
        if (href?.startsWith('http')) {
          return {
            element: 'External Link',
            description: text,
            action: 'Press Enter to open in new tab'
          };
        }
        
        return {
          element: 'Link',
          description: text,
          action: 'Press Enter to navigate'
        };
      }

      // Buttons
      if (tagName === 'button') {
        const text = element.textContent?.trim() || '';
        
        if (text.includes('Copy')) {
          return {
            element: 'Copy Button',
            description: 'Copy current page URL to clipboard',
            action: 'Press Enter to copy URL'
          };
        }
        
        return {
          element: 'Button',
          description: text || 'Interactive button',
          action: 'Press Enter to activate'
        };
      }

      // Form inputs
      if (tagName === 'input') {
        const type = element.getAttribute('type');
        const placeholder = element.getAttribute('placeholder');
        
        if (type === 'email') {
          return {
            element: 'Email Input',
            description: placeholder || 'Enter your email address',
            action: 'Type to enter email'
          };
        }
        
        return {
          element: 'Input Field',
          description: placeholder || 'Text input field',
          action: 'Type to enter text'
        };
      }

      // Textarea
      if (tagName === 'textarea') {
        const placeholder = element.getAttribute('placeholder');
        return {
          element: 'Text Area',
          description: placeholder || 'Multi-line text input',
          action: 'Type to enter text'
        };
      }

      // Generic focusable elements
      if (element.hasAttribute('tabindex') || ['button', 'a', 'input', 'textarea', 'select'].includes(tagName)) {
        return {
          element: tagName.charAt(0).toUpperCase() + tagName.slice(1),
          description: element.textContent?.trim() || ariaLabel || 'Interactive element',
          action: 'Press Enter to interact'
        };
      }

      return null;
    };

    const handleFocusIn = (event: FocusEvent) => {
      const element = event.target as Element;
      const info = getFocusInfo(element);
      
      // Only show banner if Tab was recently pressed (keyboard navigation)
      if (info && wasTabPressed) {
        setFocusInfo(info);
        setIsVisible(true);
      }
    };

    const handleFocusOut = () => {
      setIsVisible(false);
      // Keep the info for a moment to allow smooth exit animation
      setTimeout(() => {
        if (!document.activeElement || document.activeElement === document.body) {
          setFocusInfo(null);
        }
      }, 200);
    };

    // Add event listeners
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [wasTabPressed]);

  return (
    <AnimatePresence>
      {isVisible && focusInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-slate-950/80 backdrop-blur-md shadow-md rounded-lg px-4 py-3 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-white font-medium text-sm mb-1">
                {focusInfo.element}
              </div>
              <div className="text-slate-300 text-xs mb-2">
                {focusInfo.description}
              </div>
              <div className="text-slate-400 text-xs">
                {focusInfo.action}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
