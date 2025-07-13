'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeftIcon, LinkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FocusBanner = dynamic(() => import('@/components/FocusBanner'), {
  ssr: false
});

const TableOfContents = dynamic(() => import('@/components/TableOfContents'), {
  loading: () => <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block opacity-0" />
});

export default function ChatbotFlowBuilderCaseStudy() {
  const [isSelected, setIsSelected] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('nodes');
  
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
        className="fixed top-6 right-6 z-50"
      >
        <Button
          onClick={copyUrl}
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-150"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </motion.div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <div className="mt-12 mb-36 animate-fade-in-up text-center" style={{ animationDelay: '0ms' }}>
          <Link 
            href="/" 
            className="inline-flex items-center px-1.5 py-1 bg-slate-50 font-mono uppercase font-medium rounded-md text-slate-600 text-xs hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>

        {/* Header */}
        <header 
          ref={headerRef}
          className={`mb-12 text-center group border border-dashed transition-all duration-200 p-6 -m-6 relative cursor-move select-none ${
            isSelected 
              ? 'border-orange-500' 
              : 'border-slate-300 hover:border-slate-400'
          } ${isDragging ? 'transition-none' : ''}`}
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
          ></div>
          <div 
            className={`absolute -top-1 -right-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
              isSelected 
                ? 'bg-orange-500' 
                : 'bg-slate-300 group-hover:bg-slate-400'
            }`}
          ></div>
          <div 
            className={`absolute -bottom-1 -left-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
              isSelected 
                ? 'bg-orange-500' 
                : 'bg-slate-300 group-hover:bg-slate-400'
            }`}
          ></div>
          <div 
            className={`absolute -bottom-1 -right-1 w-2 h-2 transition-colors duration-200 pointer-events-none ${
              isSelected 
                ? 'bg-orange-500' 
                : 'bg-slate-300 group-hover:bg-slate-400'
            }`}
          ></div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className='font-mono'>2023 - 2024</span>
            </div>
          <h1 className="text-5xl font-bold text-slate-900 mt-6 mb-4 tracking-tight">
            A Chatbot Builder for the WhatsApp Business API
          </h1>
          <p className="text-lg text-slate-700 mb-12">
            Led the design and iteration of a chatbot builder tool integrated with the WhatsApp Business API to enable automated interactions and scale conversations efficiently.
          </p>
        </header>
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
          className="h-auto rounded-md bg-slate-50"
          style={{
            maxWidth: 'calc(996px * 1.15)' // 15% larger than max-w-4xl (896px)
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Content */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden">
          {/* Introduction */}
          <section className="p-12 pb-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Role and Context</h2>
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
          <section className="border-t border-slate-100 p-12">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Understanding the Problem</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 text-base leading-relaxed mb-4">
                    Chatbots address diverse jobs-to-be-done (JTBD). Conversations vary by goal—lead qualification, data collection, basic support, or integrated workflows. This required a flexible yet intuitive builder.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    We prioritized support use cases initially (pre-pivot to sales-focused ICP) to focus efforts and validate the core functionality before expanding to broader use cases.
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-md p-4 hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
                  <button 
                    onClick={() => setShowRequirements(!showRequirements)}
                    className="flex items-center justify-between w-full text-left group cursor-pointer"
                  >
                    <h4  className="text-base font-medium text-slate-900 cursor-pointer">How we got there?</h4>
                    <motion.div
                      animate={{ rotate: showRequirements ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
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
          <section className="border-t border-slate-100 p-12">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Building the Solution</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    We approached development iteratively, starting with a proof of concept and expanding capabilities based on user feedback and market validation.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
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
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">V2: Expanded Capabilities</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Expanded nodes for broader use cases. Added HTTP request node to integrate external systems, prioritizing quantity over polish to validate market demand.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">V3: Enhanced Usability</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Emphasized usability for complex flows. Rebuilt canvas with undo/redo, drag-and-drop, zoom, and performance optimizations to handle large bots smoothly.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">V4: Polish and Intelligence</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Polished interactions, added analytics (CTR tracking), CRM integrations, and AI features: nodes for info collection, intent detection, and basic AI agents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Challenges */}
          <section className="border-t border-slate-100 p-12">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Key Challenges</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-6">
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

        {/* Deep Dive: Node Design */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden mt-16">
          {/* Node Design Section */}
          <section className="p-12">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Deep Dive: Node Design</h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Node design was critical to the builder's success. Each node needed to be immediately recognizable, easy to configure, and scalable across different complexity levels while maintaining visual consistency.
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
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
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