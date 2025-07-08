import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { quotes } from '@/data/staticData';

export default function QuotesSection() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mb-22">
      <motion.div 
        className="min-h-[120px] flex items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.blockquote 
            key={currentQuoteIndex}
            className="font-serif italic text-slate-900 text-lg leading-relaxed w-full"
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {quotes[currentQuoteIndex].text}
            <cite className="block mt-2 text-sm font-sans not-italic text-slate-600">
              {quotes[currentQuoteIndex].author}
            </cite>
          </motion.blockquote>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}