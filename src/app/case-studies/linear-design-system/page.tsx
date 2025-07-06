'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeftIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TableOfContents from '@/components/TableOfContents';
import FocusBanner from '@/components/FocusBanner';

export default function LinearDesignSystemCaseStudy() {
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.3 }}
        className="fixed top-6 right-6 z-50"
      >
        <Button
          onClick={copyUrl}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-150"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Copy URL
        </Button>
      </motion.div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <Link 
            href="/" 
            className="inline-flex items-center px-1.5 py-1 bg-white font-medium rounded-md text-slate-600 text-sm hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mt-40 mb-4">
            Rasayel Reporting 2.0
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Tackled many small and big issues from first principles, helping support managers better understand their agents&apos; performance.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="bg-slate-100 px-3 py-1 rounded-full">Design System</span>
            <span>2023 - 2024</span>
            <a 
              href="https://linear.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
            >
              View Live →
            </a>
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.2 }}
          className="prose prose-slate max-w-none"
        >
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Overview</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Linear needed a comprehensive design system to maintain consistency across their rapidly growing product suite. 
              I led the creation of a scalable component library that would serve as the foundation for all future design and development work.
            </p>
          </section>

          {/* Problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Problem</h2>
            
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Business Goal
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Rasayel is a vital communication tool for businesses to support and sell, so giving our customers clear insights into their communication is crucial. For sales teams, we were mainly covered reporting wise by data logged in to the team&apos;s CRMs (i.e. Hubspot), but for support teams, clear metrics were a blockers customers voiced increasingly, as well as a blocker closing deals for our sales team.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                User Pain
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We started getting more and more emails like that; many overlapping problems, some central to reporting, others just related issues. It was chaotic, customers were highlighting many gaps in our current reports & adjacent workflows — we urgently needed to discover what was valuable for us to build, and why.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Problem Discovery</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                After aligning with our CEO and sales team on the demand for better reports for support team for which we got clear signals. From there, I figured I needed a full picture of the problems
              </p>
              <ol className="space-y-3 text-slate-600 mb-6">
                <li><strong>1. What were the key JTBDs for our customers?</strong> (e.g. why do they want reports at the first place?)</li>
                <li><strong>2. What were preventing them to get value out our current reports?</strong> (e.g. gaps in our reports or missing operational features?)</li>
              </ol>
              <p className="text-slate-600 leading-relaxed">
                As a consequence, I did proceed to look at all insights we got, attempting to find patterns between whom was asking for the feedback and why.
              </p>
            </div>
          </section>

          {/* Solution */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Solution</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              I developed a comprehensive design system that included foundational elements, reusable components, 
              and clear documentation. The system was built with both designers and developers in mind, 
              ensuring seamless handoff and implementation.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-slate-200 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Design Tokens</h3>
                <p className="text-slate-600 text-sm">
                  Established consistent color palettes, typography scales, spacing systems, and elevation patterns.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Component Library</h3>
                <p className="text-slate-600 text-sm">
                  Created 50+ reusable components with variants, states, and comprehensive documentation.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Documentation</h3>
                <p className="text-slate-600 text-sm">
                  Built interactive documentation with usage guidelines, code examples, and design principles.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Tooling</h3>
                <p className="text-slate-600 text-sm">
                  Developed Figma plugins and development tools to streamline the design-to-code workflow.
                </p>
              </div>
            </div>
          </section>

          {/* Impact */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Impact</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                  <div className="text-sm text-slate-600">Faster development cycles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
                  <div className="text-sm text-slate-600">Component reusability</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-sm text-slate-600">Design-dev alignment</div>
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Process</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Audit & Research</h3>
                  <p className="text-slate-600 text-sm">
                    Conducted comprehensive audit of existing UI patterns and interviewed stakeholders to understand pain points.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Foundation</h3>
                  <p className="text-slate-600 text-sm">
                    Established design tokens and foundational elements including color, typography, and spacing systems.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Components</h3>
                  <p className="text-slate-600 text-sm">
                    Built component library starting with atomic elements and progressing to complex patterns.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Documentation</h3>
                  <p className="text-slate-600 text-sm">
                    Created comprehensive documentation with usage guidelines, examples, and implementation details.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Adoption</h3>
                  <p className="text-slate-600 text-sm">
                    Rolled out system across teams with training sessions and ongoing support for implementation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Learnings */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Key Learnings</h2>
            <div className="bg-slate-50 p-6 rounded-lg">
              <ul className="space-y-3 text-slate-600">
                <li>• Early stakeholder buy-in is crucial for successful design system adoption</li>
                <li>• Documentation quality directly impacts system usage and consistency</li>
                <li>• Regular maintenance and updates are essential for long-term success</li>
                <li>• Cross-functional collaboration improves both design and technical outcomes</li>
              </ul>
            </div>
          </section>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-slate-200"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </motion.div>
      </div>
      
      {/* Focus Banner */}
      <FocusBanner />
    </div>
  );
}
