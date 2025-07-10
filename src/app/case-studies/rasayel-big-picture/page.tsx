'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ChevronLeftIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProjectsTable from '@/components/ProjectsTable';

const FocusBanner = dynamic(() => import('@/components/FocusBanner'), {
  ssr: false
});

const TableOfContents = dynamic(() => import('@/components/TableOfContents'), {
  loading: () => <div className="w-8 h-8 bg-slate-100 rounded animate-pulse" />
});




export default function RasayelBigPictureCaseStudy() {
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
            <span className='font-mono'>2022 - 2025</span>
            </div>
          <h1 className="text-5xl font-bold text-slate-900 mt-6 mb-4 tracking-tight">
            3 years of building
          </h1>
          <p className="text-lg text-slate-700 mb-24">
            3 years of building Rasayel, a WhatsApp native platform for sales and customer support.
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
          alt="Rasayel inbox tickets interface showing customer support workflow"
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
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Overview</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed">
I started at Rasayel as a Senior Product Designer but ended up leading the platform team. Turns out when you&apos;re moving fast, going back and forth with engineers takes forever. So I just started coding the prototypes myself—way faster and the end result was better. Along the way I had to figure out the product roadmap, make strategic calls, and keep the engineering team aligned. We rebuilt the whole user experience and created proper design systems for a customer support platform used by thousands of businesses across the Middle East.
              </p>
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Projects</h2>
            <ProjectsTable />
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
