import Image from 'next/image';
import { TabItem } from '@/components/ui/tabs';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const NodeDesignContent = () => {
  const [showAll, setShowAll] = useState(false);
  
  return (
    <>
        {/* Node Evolution Image */}
        <div className="px-6 md:px-12 pt-6 md:pt-8 pb-4">
          <div className="relative">
            <Image
              src="/case-studies/chatbot/node-evolution.png"
              alt="Interactive Message Node Evolution"
              width={1200}
              height={400}
              className="w-full h-auto rounded-lg border border-slate-100"
            />
            <p className="text-xs text-slate-500 font-mono mt-2">
              Evolution of the Interactive Message Node that can contain buttons
            </p>
          </div>
        </div>

        <section className="p-6 md:p-12 pt-6 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 md:mb-4">Node Design</h2>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                The node architecture formed the foundation of the chatbot builder, making its design paramount to the platform&apos;s success. This presented several inherent challenges that required careful consideration. First, we needed to identify the right nodes that addressed specific user needs at the appropriate level of granularity. Second, these nodes had to be intuitively designed - easy to use and satisfying to interact with, especially considering that workflows could contain dozens or even hundreds of nodes. The user experience of each individual node was crucial to the overall platform usability. Through iterative development, we continuously refined the node system based on user feedback and learnings to achieve the optimal balance of functionality and usability.
                </p>
              </div>
              
              <p className="text-slate-700 mb-4">Key tradeoffs and issues</p>
              
              <div className="relative">
                <div className={`space-y-4 transition-all duration-300 ${!showAll ? 'max-h-80 overflow-hidden' : ''}`}>
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Actions on Nodes vs Separated</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Since flows were mostly conversational initially, we decided to have actions (like closing the conversation) on the message nodes. This ended up being confusing for some, but especially didn&apos;t make the life of our users easy as (1) they didn&apos;t know they had to do so and (2) their needs evolved to be sometimes more operational (e.g. close conversation after assigning).
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Fallbacks at the Node Level</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We quickly understood that fallbacks were the core of bots (essentially &quot;what if user does x&quot;). My initial intuition was that having fallback separated from nodes was better for the UX since they had 1 place to set them up, and I found that the ability to manage fallbacks differently dependent on the node or where you are in the flow was overkilled. This quickly proved itself to be wrong and as a consequence we placed contextual fallback on the nodes.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Lack of Design System</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We started with message nodes, but as we expanded use cases, created many nodes. Nodes started looking differently and nothing was consistent. As a consequence, we rethought the visual anatomy of a node. We did it over multiple internal iteration with our front end engineer.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Editing Experience</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    This is something I still remain unsatisfied with, but we had to decide what, if anything could be edited from the canvas in opposition to be edited in the sidebar. We had different paths, opening a sidebar, a popover over the node in the canvas, or direct inline node editing on the canvas. Of course editing on the node itself came with the issue of zoom levels. Editing in the sidebar was making you lose some context. So we ended up going for a mix, some key infos/high frequency actions could be taken from the canvas on the node itself, but the rest had to be done in the sidebar or popover.
                  </p>
                </div>
                </div>
                
                {/* Fade overlay when collapsed */}
                {!showAll && (
                  <div className="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                )}
                
                {/* Expand/Collapse button */}
                <div className="mt-4 flex justify-center relative z-10 bg-white pt-2">
                  <button 
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center rounded gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{showAll ? 'Show less' : 'Show more'}</span>
                    <motion.div
                      animate={{ rotate: showAll ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </motion.div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

const AnalyticsContent = () => {
  const [showAll, setShowAll] = useState(false);
  
  return (
    <>
        {/* Analytics Image */}
        <div className="px-6 md:px-12 pt-6 md:pt-8 pb-4">
          <div className="relative">
            <Image
              src="/case-studies/chatbot/compnent-analytics (1).png"
              alt="Key path analytics component"
              width={1200}
              height={400}
              className="w-full h-auto rounded-lg border border-slate-100"
            />
            <p className="text-xs text-slate-500 font-mono mt-2">
              Key path analytics component
            </p>
          </div>
        </div>

        <section className="p-6 md:p-12 pt-6 md:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 md:mb-4">Analytics</h2>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                The analytics goal was initially fuzzy, but from first principles, when you build a bot, you don&apos;t do it for the sake of it - you do it with an objective in mind (e.g., book more demos, answer questions). The ultimate goal was to measure effectiveness, but we quickly realized there were two key jobs: measuring the outcome and chatbot performance evaluation. Customers wanted to know if the conversation flow was efficient, requiring insights into conversion rates and drop-off points to iterate effectively. This dual purpose shaped our entire analytics approach.
              </p>
            </div>
            
            <p className="text-slate-700 mb-4">Key challenges and decisions</p>
            
            <div className="relative">
              <div className={`space-y-4 transition-all duration-300 ${!showAll ? 'max-h-80 overflow-hidden' : ''}`}>
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Scope and Priorities</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    The biggest challenge was figuring out what actually mattered. We discovered two distinct use cases: measuring business outcomes (like meetings booked) and evaluating chatbot performance (conversion through flows, drop-off analysis). While bots are usually part of larger funnels, users considered them a good proxy for outcomes, leading us to prioritize flow performance metrics first.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Relativity</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Numbers could be relative to either the total amount of users who entered the flow or relative to the node before. Since flows can be very flexible and complex, we needed to be explicit about our choice. We decided to provide both perspectives but defaulted to showing relative to flow entry, as this gave users the clearest picture of overall conversion performance.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Unique vs Total Users</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Some users could go multiple times through the same flow, creating a divergence between unique and total users. This was particularly challenging for repeat interactions. As a default, we went for unique runs since it&apos;s more telling of user behavior patterns, but we still highlighted total runs to make differences apparent and give users the full picture.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Flow Versioning and Data Persistence</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    When flows were edited, we had to decide whether to keep data and show change impact, or create version history. We chose version history to maintain data integrity, but this means small edits (like fixing typos) create new versions and clear previous data. While this maintains accuracy, it&apos;s not ideal for minor changes - there were more graceful ways to handle this that we decided to scope out.
                  </p>
                </div>
              </div>
              
              {/* Fade overlay when collapsed */}
              {!showAll && (
                <div className="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              )}
              
              {/* Expand/Collapse button */}
              <div className="mt-4 flex justify-center relative z-10 bg-white pt-2">
                <button 
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center rounded gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{showAll ? 'Show less' : 'Show more'}</span>
                  <motion.div
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const tabData: TabItem[] = [
  {
    id: 'nodes',
    label: 'Node Design',
    content: <NodeDesignContent />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    content: <AnalyticsContent />
  },
  {
    id: 'canvas',
    label: 'Canvas',
    content: (
      <section className="p-6 md:p-12 pt-6 md:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 md:mb-4">Canvas</h2>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                Canvas design evolved from a restrictive layout to a flexible workspace that could handle complex flows while remaining intuitive for beginners.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Performance Optimization</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Rebuilt canvas with virtualization and efficient rendering to handle large chatbot flows smoothly.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Navigation Features</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Added zoom, pan, minimap, and search functionality to help users navigate complex automation flows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    id: 'fallbacks',
    label: 'Fallbacks',
    content: (
      <section className="p-6 md:p-12 pt-6 md:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 md:mb-4">Fallbacks</h2>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                Fallback system design ensured graceful handling of unexpected user inputs while maintaining conversation flow and providing escape routes.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Default Behaviors</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Designed intelligent defaults for common fallback scenarios while allowing customization for specific use cases.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Escalation Paths</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Created clear escalation mechanisms to human agents when chatbot responses were insufficient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
];