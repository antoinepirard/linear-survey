'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeftIcon, LinkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabItem } from '@/components/ui/tabs';
import { FancyHeader } from '@/components/FancyHeader';
import { toast } from 'sonner';

const FocusBanner = dynamic(() => import('@/components/FocusBanner'), {
  ssr: false
});

const TableOfContents = dynamic(() => import('@/components/TableOfContents'), {
  loading: () => <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block opacity-0" />
});

export default function ChatbotFlowBuilderCaseStudy() {
  const [showRequirements, setShowRequirements] = useState(false);

  const tabData: TabItem[] = [
    {
      id: 'nodes',
      label: 'Node Design',
      content: (
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
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Node Design</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                    Node design was critical to the builder&apos;s success. Each node needed to be immediately recognizable, easy to configure, and scalable across different complexity levels while maintaining visual consistency.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Visual Hierarchy</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      Established clear visual patterns for different node types through color coding, iconography, and size variations.
                    </p>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>Color System:</strong> Blue for messages, green for conditions, orange for actions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>Icon Language:</strong> Consistent iconography to indicate node function at a glance</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Configuration Patterns</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Developed progressive disclosure patterns where basic configurations were visible, with advanced options accessible through expandable sections.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Connection Logic</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Designed connection points and flow indicators to make logic paths clear, reducing cognitive load when building complex flows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <section className="p-6 md:p-12 pt-6 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Analytics</h2>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                  Analytics design focused on providing actionable insights while maintaining simplicity for non-technical users to understand chatbot performance.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Key Metrics</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Identified and designed visualizations for conversion rates, drop-off points, and user engagement patterns.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Real-time Feedback</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Implemented live analytics to help users understand immediate impact of their chatbot changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'canvas',
      label: 'Canvas',
      content: (
        <section className="p-6 md:p-12 pt-6 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Canvas</h2>
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
              <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Fallbacks</h2>
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


  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast.error('Failed to copy URL');
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 relative" style={{
      backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }}>
      <TableOfContents />
      
      {/* Copy URL Button - Top Right */}
      <motion.div 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50"
      >
        <Button
          onClick={copyUrl}
          variant="outline"
          size="icon"
          className="min-h-[44px] min-w-[44px] bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-150"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </motion.div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <div className="mt-6 md:mt-12 mb-16 md:mb-36 animate-fade-in-up text-center" style={{ animationDelay: '0ms' }}>
          <Link 
            href="/" 
            className="inline-flex items-center px-1.5 py-1 bg-slate-50 font-mono uppercase font-medium rounded-md text-slate-600 text-xs hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>

        <FancyHeader
          dateRange="2023 - 2024"
          title="A Chatbot Builder for the WhatsApp Business API"
          description="Led the design and iteration of a chatbot builder tool integrated with the WhatsApp Business API to enable automated interactions and scale conversations efficiently."
        />
      </div>


      {/* Hero Video - Outside main container */}
      <div
        className="mb-16 mx-auto flex justify-center"
        style={{ 
          maxWidth: '90vw'
        }}
      >
        <video
          src="/Assets/Videos/thebooot.webm"
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-md bg-slate-50 max-w-none md:max-w-[calc(996px*1.15)]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Content */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden">
          {/* Introduction */}
          <section className="p-6 md:p-12 pb-6 md:pb-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Role and Context</h2>
              <p   className="text-slate-700 leading-relaxed">
                As a Product Designer, I was responsible for the design and iteration of a chatbot builder tool integrated with the WhatsApp Business API to enable automated interactions and scale conversations efficiently.
              </p>
              <p className="text-slate-700 leading-relaxed">
                In this case study, I&apos;ll outline key product decisions, design challenges, and how we iterated from proof of concept to a robust automation tool.
              </p>

              <p className="text-slate-700 leading-relaxed">
                The project started as an experiment, to validate the identified demand of automating WhatsApp conversations with a chatbot builder tool. At the time, we didn&apos;t have a clear ICP (Initial Customer Profile). The chatbot ultimaely became a key USP (Unique Selling Proposition) for our platform and we iterated on it for 2.5 years.
              </p>
            </div>
          </section>

          {/* Understanding the Problem */}
          <section className="border-t border-slate-100 p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Understanding the Problem</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 text-base leading-relaxed mb-3 md:mb-4">
                    Chatbots address diverse jobs-to-be-done (JTBD). Conversations vary by goal—lead qualification, data collection, basic support, or integrated workflows. This required a flexible yet intuitive builder.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    We prioritized support use cases initially (pre-pivot to sales-focused ICP) to focus efforts and validate the core functionality before expanding to broader use cases.
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-md p-4 cursor-pointer">
                  <button 
                    onClick={() => setShowRequirements(!showRequirements)}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <h4  className="text-base font-medium text-slate-900 cursor-pointer">How we got there?</h4>
                    <motion.div
                      animate={{ rotate: showRequirements ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showRequirements && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-4">
                          <p className="text-slate-700 text-sm leading-relaxed">
                            At the time, we were doing weekly interviews with customers. Combined with competitor analysis (ManyChat, Chatbot.com, Bird.com) we identified quickly the core problems. To give us a better understanding of the complexity and depht (e.g. fallbacks, conditions, etc.) we also collaborated with some support automation builder agencies to give us pointers.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* Building the Solution */}
          <section className="border-t border-slate-100 p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Building the Solution</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                    We approached development iteratively, starting with a proof of concept and expanding capabilities based on user feedback and market validation.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">V1: Proof of Concept</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        Focused on basics to validate viability. Limited scope to test core feasibility.
                      </p>
                      <ul className="space-y-2 text-slate-600 text-sm">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Triggers:</strong> Inbound only, simple conditions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Messages:</strong> 24-hour window limitation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Actions:</strong> Basic tagging and status changes</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Canvas:</strong> Opinionated layout (later proved limiting)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">V2: Expanded Capabilities</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Expanded nodes for broader use cases. Added HTTP request node to integrate external systems, prioritizing quantity over polish to validate market demand.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">V3: Enhanced Usability</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Emphasized usability for complex flows. Rebuilt canvas with undo/redo, drag-and-drop, zoom, and performance optimizations to handle large bots smoothly.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">V4: Polish and Intelligence</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Polished interactions, added analytics (CTR tracking), CRM integrations, and AI features: nodes for info collection, intent detection, and basic AI agents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Challenges */}
          <section className="border-t border-slate-100 p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">Key Challenges</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                    Building a flexible chatbot builder presented unique challenges that required careful balance between power and usability.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">Feature Prioritization</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Flexibility enabled many use cases, but after core features, research time often exceeded implementation. We bet on high-impact additions serving most customers.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">Flexibility vs. Opinionated Design</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Balanced defaults (e.g., customizable fallbacks) with extensibility. This tension required constant iteration to maintain usability without overwhelming users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Deep Dive Section Header */}
        <div className="mt-16 md:mt-26 mb-6 md:mb-8 text-center" id="deep-dive-section">
          <div className="inline-block group border border-dashed border-slate-300 hover:border-slate-400 transition-all duration-200 p-4 md:p-6 relative">
          {/* Corner squares - visual indicators only */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
          <h2 className="text-4xl md:text-6xl font-medium text-slate-900 tracking-tight">
            Deep Dive
          </h2>
          </div>
        </div>

        {/* Deep Dive: Features */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden">
          <Tabs 
            tabs={tabData} 
            defaultTab="nodes"
          />
        </div>

        {/* Bottom Navigation */}
        <div
          className="mt-16 pt-8 border-t border-slate-200"
        >
          <Link 
            href="/" 
            className="inline-flex items-center px-1.5 py-1 bg-white font-mono font-medium rounded-md text-slate-600 text-sm hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>
      </div>
      
      {/* Focus Banner */}
      <FocusBanner />
    </div>
  );
}