import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';

interface ListItemData {
  title: string;
  description: string;
  category: string;
  slug?: string;
  href?: string;
}

interface ListItemProps {
  items: ListItemData[];
  title?: string;
  animationDelay?: string;
}

export default function ListItem({ items, title = 'Highlights', animationDelay = '400ms' }: ListItemProps) {
  
  return (
    <div className="animate-fade-in-up" style={{ animationDelay }}>
      <h2 className="text-base font-medium text-slate-900 mb-6">{title}</h2>
      <div className="space-y-0">
        {items.map((item, index) => {
          // Determine the link destination
          const linkHref = item.slug ? `/article/${item.slug}` : (item.href || "#");
          const isExternal = item.href && (item.href.startsWith('http://') || item.href.startsWith('https://'));
          

          
          return (
            <motion.div key={index} className="group" whileHover="hover">
              {isExternal ? (
                <a 
                  href={item.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-4 px-2 -mx-2 border-b border-slate-100 interactive-element transition-colors duration-150 hover:border-slate-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-900 transition-colors duration-150 group-hover:text-slate-700">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center min-w-0">
                      <motion.span 
                        className="text-xs uppercase text-slate-500 whitespace-nowrap"
                        animate={{ x: 0 }}
                        variants={{
                          hover: { x: -20 }
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        {item.category}
                      </motion.span>
                      <motion.div
                        className="flex items-center"
                        initial={{ x: 20, opacity: 0 }}
                        variants={{
                          hover: { x: 0, opacity: 1 }
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        <ArrowUpRightIcon className="w-3 h-3 text-slate-400 -ml-2" aria-label="External link" />
                      </motion.div>
                    </div>
                  </div>
                </a>
              ) : (
                <Link 
                  href={linkHref}
                  className="block py-4 px-2 -mx-2 border-b border-slate-100 interactive-element transition-colors duration-150 hover:border-slate-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-900 transition-colors duration-150 group-hover:text-slate-700">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center min-w-0">
                      <motion.span 
                        className="text-xs uppercase text-slate-500 whitespace-nowrap"
                        animate={{ x: 0 }}
                        variants={{
                          hover: { x: -16 }
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        {item.category}
                      </motion.span>
                      {(item.slug || (item.href && !isExternal)) && (
                        <motion.div
                          className="flex items-center"
                          initial={{ x: 16, opacity: 0 }}
                          variants={{
                            hover: { x: 0, opacity: 1 }
                          }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <span className="text-xs text-slate-400 -ml-2" aria-label="Read more">→</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
