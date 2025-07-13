'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ChevronLeftIcon, LinkIcon } from '@heroicons/react/24/outline';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
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

      <div className="max-w-4xl mx-auto px-6">
        {/* Content */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl p-8 space-y-16">
          {/* Background */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Background: Why Build a Chatbot?</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed">
                Businesses using WhatsApp needed to scale conversations efficiently. Manual handling limited growth, so automation was essential. The goal: enable automated interactions to qualify leads, collect data, handle support FAQs, and execute workflows, freeing teams for high-value tasks.
              </p>
            </div>
          </section>

          {/* Problem Complexity */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Problem Complexity</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Chatbots address diverse jobs-to-be-done (JTBD). Conversations vary by goal—lead qualification, data collection, basic support, or integrated workflows. This required a flexible yet intuitive builder.
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                We prioritized support use cases initially (pre-pivot to sales-focused ICP) to focus efforts and validate the core functionality before expanding to broader use cases.
              </p>
            </div>
          </section>

          {/* Research and Initial Scope */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Research and Initial Scope</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                We interviewed agencies using competitors (ManyChat, Chatbot.com, Bird.com) to analyze strengths and weaknesses. Key insights:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Triggers to start flows.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Messages with interactive elements (e.g., buttons, links).</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Workflow actions for automation.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Visual representation for easy editing.</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                To differentiate, we leveraged synergies with our ICP and existing product strengths, avoiding direct feature parity.
              </p>
            </div>
          </section>

          {/* V1: Proof of Concept */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">V1: Proof of Concept</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                Focused on basics to validate viability:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Triggers:</strong> Inbound only, with simple conditions.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Messages:</strong> Limited to 24-hour interactive window; ignored expired conversations initially to avoid workflow complexity.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Workflow Actions:</strong> Basic tagging and status changes.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Visual Representation:</strong> Opinionated canvas with enforced alignment for readability (later proved limiting).</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                This version tested core feasibility but lacked depth.
              </p>
            </div>
          </section>

          {/* Iterations: V2 and Beyond */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Iterations: V2 and Beyond</h2>
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">V2: Expanded Capabilities</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Expanded nodes for broader use cases. Added HTTP request node to integrate external systems, prioritizing quantity over polish to validate market demand.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">V3: Enhanced Usability</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Emphasized usability for complex flows. Rebuilt canvas with undo/redo, drag-and-drop, zoom, and performance optimizations to handle large bots smoothly.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">V4: Polish and Intelligence</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Polished interactions (e.g., improved fallbacks), added analytics (e.g., CTR tracking), CRM integrations, and AI features: nodes for info collection, intent detection, and basic AI agents.
                </p>
              </div>
            </div>
          </section>

          {/* Key Challenges */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Key Challenges</h2>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Feature Prioritization</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Flexibility enabled many use cases, but after core features, research time often exceeded implementation. We bet on high-impact additions serving most customers.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Flexibility vs. Opinionated Design</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Balanced defaults (e.g., customizable fallbacks) with extensibility. This tension required constant iteration to maintain usability without overwhelming users.
                </p>
              </div>
            </div>
          </section>

          {/* Outcomes and Lessons */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Outcomes and Lessons</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                The builder evolved from POC to robust tool, enabling scalable WhatsApp automation. Key learnings:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Start narrow:</strong> Focus on core use cases before expanding to avoid feature bloat.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Iterate based on user feedback:</strong> Real usage patterns often differ from initial assumptions.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Balance opinionated defaults with flexibility:</strong> Provide good defaults while allowing customization.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Align design with business needs:</strong> This approach drove adoption and business value.</span>
                </li>
              </ul>
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