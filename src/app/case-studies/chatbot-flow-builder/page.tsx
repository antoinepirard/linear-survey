'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <div className="min-h-screen bg-white relative">
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
            className="inline-flex items-center px-1.5 py-1 bg-white font-mono uppercase font-medium rounded-md text-slate-600 text-xs hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className='font-mono'>2023 - 2024</span>
            </div>
          <h1 className="text-5xl font-bold text-slate-900 mt-6 mb-4 tracking-tight">
            Chatbot Flow Builder
          </h1>
          <p className="text-lg text-slate-700 mb-24">
            Designed and built a visual flow builder to empower teams to create sophisticated chatbot workflows without code.
          </p>
        </header>
      </div>

      {/* Hero Image - Outside main container */}
      <div
        className="mb-16 bg-slate-50 rounded-md overflow-hidden relative mx-auto"
        style={{ 
          height: '500px',
          width: 'calc(896px * 1.15)', // 15% larger than max-w-4xl (896px)
          maxWidth: '90vw' // Responsive fallback
        }}
      >
        <Image
          src="/case-studies/rasayel-big-picture/RS-tickets.jpg"
          alt="Chatbot flow builder interface showing visual workflow design"
          width={1200}
          height={600}
          className="absolute bottom-0 left-0"
          style={{ 
            transform: 'translate(-12%, 25%)'
          }}
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Content */}
        <div className="space-y-16">
          {/* My Role */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">My Role</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed">
                As Product Designer and Frontend Developer, I led the end-to-end design and development of the chatbot flow builder. This involved extensive user research with customer support teams, creating detailed wireframes and prototypes, and implementing the entire frontend experience. I collaborated closely with backend engineers to define the data model and API requirements, while also conducting user testing sessions to validate design decisions throughout the development process.
              </p>
            </div>
          </section>

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Intro</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Before this project, creating chatbot workflows in Rasayel required technical knowledge and manual configuration. Support teams wanted to automate common interactions like greeting customers, routing inquiries, and collecting contact information, but they were limited by complex setup processes and inflexible templates.
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                The chatbot flow builder transformed this experience by providing a visual, drag-and-drop interface that allows teams to design sophisticated conversational flows without writing code. Teams can now create conditional logic, integrate with external systems, and build multi-step workflows that feel natural and responsive to customers. The tool bridges the gap between powerful automation capabilities and user-friendly design, empowering support teams to create better customer experiences independently.
              </p>
            </div>
          </section>

          {/* Why We Built It */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Why We Built It</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                Customer feedback revealed significant pain points with the existing chatbot system:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Technical barriers:</strong> Setting up automated responses required developer involvement and complex configuration files.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Limited flexibility:</strong> Existing templates were rigid and couldn&apos;t adapt to specific business needs or customer contexts.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Poor testing experience:</strong> Teams couldn&apos;t easily test or preview their chatbot flows before deployment.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>No conditional logic:</strong> Bots couldn&apos;t make decisions based on customer responses or previous interactions.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Maintenance overhead:</strong> Updating chatbot behaviors required technical support and often caused downtime.</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                These limitations prevented teams from creating the automated, personalized customer experiences they wanted to deliver.
              </p>
            </div>
          </section>

          {/* Research and Discovery */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Research and Discovery</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                We conducted extensive research with customer support teams and analyzed leading chatbot platforms like Dialogflow, Botpress, and Intercom&apos;s Resolution Bot. Key insights included:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Visual design matters:</strong> Teams responded best to node-based, flowchart-style interfaces that mirror their mental models of conversation flow.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Progressive complexity:</strong> Users wanted to start simple but have access to advanced features like API integrations and complex branching logic.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Real-time preview:</strong> The ability to test flows immediately was crucial for building confidence and catching errors early.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Context awareness:</strong> Successful chatbots needed access to customer history, profile data, and previous conversation context.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* What We Built */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">What We Built</h2>
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Visual Flow Designer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A drag-and-drop interface with nodes for messages, questions, conditions, and actions. Teams can create complex conversation paths by connecting nodes visually, making the logic clear and easy to modify.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Conditional Logic Engine</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Built-in support for if/then logic, customer data lookup, and dynamic response generation. Bots can make decisions based on customer responses, profile information, and conversation history.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Real-time Testing Environment</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Integrated chat simulator that lets teams test their flows immediately. Users can step through conversations, see how conditions are evaluated, and debug issues before deployment.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Template Library</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pre-built flows for common use cases like lead qualification, appointment booking, and FAQ handling. Teams can customize templates or build from scratch using reusable components.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">5. Integration Capabilities</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  API nodes for connecting to external systems, webhook support for real-time data updates, and custom variables for storing and retrieving customer information throughout the conversation.
                </p>
              </div>
            </div>
            
            {/* Technical Implementation */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Technical Implementation</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  The flow builder uses a graph-based data structure to represent conversation flows, with each node containing execution logic and metadata. The frontend leverages React Flow for the visual interface, with custom node types and connection validation. The backend processes flows through a state machine that maintains conversation context and handles branching logic. We built a custom execution engine that can pause, resume, and branch conversations based on real-time conditions and customer inputs.
                </p>
              </div>
            </div>
          </section>

          {/* Challenges */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Challenges</h2>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Balancing simplicity and power</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Creating an interface that was approachable for non-technical users while still supporting complex logic and integrations. We solved this through progressive disclosure and contextual help.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Performance with large flows</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ensuring the visual editor remained responsive with hundreds of nodes and connections. We implemented virtualization and optimized rendering to handle complex flows smoothly.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Real-time execution model</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Building a robust execution engine that could handle interruptions, context switching, and error recovery while maintaining conversation state across multiple customer interactions.
                </p>
              </div>
            </div>
          </section>

          {/* Impact */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Impact</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>90% reduction in time to deploy new chatbot workflows, from days to minutes.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Support teams now create and maintain their own automation without developer involvement.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>40% increase in customer satisfaction for automated interactions due to more natural, contextual conversations.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Became a key differentiator in sales conversations, with prospects specifically requesting the flow builder functionality.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Foundation for advanced features like AI-powered suggestions and automated A/B testing of conversation flows.</span>
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