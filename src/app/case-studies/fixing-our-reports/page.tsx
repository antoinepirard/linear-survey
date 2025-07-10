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

export default function FixingOurReportsCaseStudy() {
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
            Fixing our Reports
          </h1>
          <p className="text-lg text-slate-700 mb-24">
            Rebuilt reporting system from ground up to deliver reliable, actionable insights for support teams.
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
          {/* My Role */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">My Role</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed">
                During this project, I was Lead Product while also maintaining my responsibilities as Product Designer. I managed the overall product direction, coordinated engineers working on other projects, and stayed hands-on with this rebuild—talking to customers, digging through support conversations, and gathering feedback from support and sales. I led the discovery process, facilitated team discussions, prototyped solutions, and worked directly on the frontend, handing over PRs to engineers. I was also responsible for communicating our progress and changes back to customers.
              </p>
            </div>
          </section>

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Intro</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Rasayel is a WhatsApp first messaging platform used by sales and support teams to handle customer conversations. Before this project, Rasayel&apos;s reporting system was unreliable and often led to confusion: key metrics like first response time and resolution time were either inaccurate or impossible to trust. Support teams, who rely on these numbers to track performance and improve customer experience, found themselves second-guessing the data or building manual workarounds.
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                This project was about rebuilding reporting from the ground up so that support teams could finally get reliable, actionable insights. We focused on the support use case because that&apos;s where the pain was most acute, but we made sure not to break things for sales teams. The goal was to deliver fast, visible improvements while setting things up for long-term scalability. We tackled deep technical issues (like how sessions are defined and measured) and UX gaps (like making metrics transparent and exportable) to restore trust and operational visibility.
              </p>
            </div>
          </section>

          {/* Why We Did It */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Why We Did It</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                Before this project, Rasayel&apos;s reporting was unreliable and didn&apos;t reflect how support teams actually worked. Customers like Marn, Mazeed, and Alternative Airlines flagged a range of issues:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Misleading metrics:</strong> Resolution and response times were inflated by off-hours, away time, and follow-ups.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Broken session logic:</strong> Sessions could stay open forever, so metrics didn&apos;t have meaningful boundaries.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>No transparency:</strong> Teams couldn&apos;t see or audit the raw data behind the numbers.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Unfair attribution:</strong> Agents weren&apos;t properly credited for reassigned conversations.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Poor export and filtering:</strong> Teams wanted to slice data by agent, team, tag, or export it for audits.</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                These issues led to a breakdown in trust. Some teams built manual workarounds, others stopped using the reports, and some even considered switching platforms.
              </p>
            </div>
          </section>

          {/* How We Got Here */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">How We Got Here: Customer Problems and Industry Research</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                We started by digging into customer feedback (Marn, Mazeed, Nomod, Alternative Airlines, Jazp) and comparing how leading platforms like Intercom, Zendesk, and Freshdesk handle sessions, inactivity, and metric calculation. Key takeaways:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Sessions:</strong> Other platforms use session resets or auto-close rules to keep metrics accurate, but definitions vary. We needed a clear, transparent session model that fit our customers&apos; workflows.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Idle time:</strong> Industry best practice is to exclude off-hours, away periods, and long follow-ups from active metrics.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Attribution:</strong> Fair credit for agents and teams is a must, especially for reassigned or multi-agent conversations.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Configurability:</strong> Teams want control over inactivity windows, working hours, and what counts toward metrics.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* What We Changed */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">What We Changed</h2>
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Sessions, Redefined</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sessions now start on a new or reopened conversation and end on manual closure or after 24 hours of inactivity (configurable). Each session is a self-contained unit, so metrics like resolution time and first response time are accurate and auditable.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Excluding Irrelevant Time</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We exclude non-working hours, away time, and long follow-ups (&gt;24h) from metrics by default. Short follow-ups (&lt;24h) keep the session open but subtract the waiting time from active handling.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Accurate Attribution</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Last-touch agent gets credit for resolution; we can also track first-touch for fairness. Bot/API time is excluded from human metrics, but teams can include it if they need.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Raw Data, Filtering, and Exports</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Teams can view and export raw session and conversation data. Filtering by team, agent, tag, and time range is now possible.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">5. Auto-Reassignment for Away Agents</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If an agent is marked away and a new message arrives, the conversation is automatically reassigned to someone available (if enabled per team). Away time is tracked and excluded from performance metrics.
                </p>
              </div>
            </div>
            
            {/* Technical Foundation */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Technical Foundation</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  We built a new session ledger—a persistent, event-sourced record of every session&apos;s lifecycle. This ledger stores all relevant events (messages, assignments, status changes, presence updates), making it possible to recalculate metrics even if business rules change later. This fixes the old issues with data drift, missing context, and inability to reprocess history.
                </p>
              </div>
            </div>
          </section>

          {/* Challenges */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Challenges</h2>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">1. No session ledger (initially)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Metrics were inferred from scattered logs, making them fragile and hard to audit. Building the new ledger required backfilling millions of sessions and aligning all reporting logic to the new structure.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Trust recovery</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  After years of unreliable data, we had to rebuild customer confidence. We focused on transparency—showing raw data, clear metric definitions, and in-app documentation.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Timeline pressure</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We had just a few weeks to ship a credible v1. We prioritized foundational fixes and shipped iteratively, adding features like exports and filters in later phases.
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
                  <span>Customers now trust and use the reports again. Marn and Mazeed called out the improved accuracy and transparency.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Teams can audit, export, and filter their own data, and finally use metrics for coaching and staffing.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>The new foundation supports future improvements like CSAT, advanced ticketing, and AI-driven insights.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Internally, we have a single source of truth for sessions and metrics, making further changes safer and faster.</span>
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
