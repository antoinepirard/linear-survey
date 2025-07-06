'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ChevronLeftIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FocusBanner from '@/components/FocusBanner';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import TableOfContents from '@/components/TableOfContents';

// Role evolution chart data
const roleChartData = [
  { period: "H2 2022", strategy: 10, problemDiscovery: 30, solutionDiscovery: 55, implementation: 5 },
  { period: "H1 2023", strategy: 10, problemDiscovery: 35, solutionDiscovery: 50, implementation: 5 },
  { period: "H2 2023", strategy: 15, problemDiscovery: 40, solutionDiscovery: 38, implementation: 7 },
  { period: "H1 2024", strategy: 18, problemDiscovery: 45, solutionDiscovery: 25, implementation: 12 },
  { period: "H2 2024", strategy: 22, problemDiscovery: 40, solutionDiscovery: 23, implementation: 15 },
  { period: "H1 2025", strategy: 25, problemDiscovery: 35, solutionDiscovery: 20, implementation: 20 },
];

const roleChartConfig = {
  strategy: {
    label: "Strategy",
    color: "#1e3a8a", // blue-800
  },
  problemDiscovery: {
    label: "Problem Discovery",
    color: "#1d4ed8", // blue-700
  },
  solutionDiscovery: {
    label: "Solution Discovery",
    color: "#3b82f6", // blue-500
  },
  implementation: {
    label: "Implementation",
    color: "#bfdbfe", // blue-200
  },
} satisfies ChartConfig;

function RoleEvolutionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Evolution Over Time</CardTitle>
        <CardDescription>
          How my focus shifted from hands-on execution to strategic leadership
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={roleChartConfig}>
          <BarChart accessibilityLayer data={roleChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="strategy"
              stackId="a"
              fill="var(--color-strategy)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="problemDiscovery"
              stackId="a"
              fill="var(--color-problemDiscovery)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="solutionDiscovery"
              stackId="a"
              fill="var(--color-solutionDiscovery)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="implementation"
              stackId="a"
              fill="var(--color-implementation)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-wrap justify-center gap-4 mt-4 px-6 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-800" />
          <span className="text-sm text-slate-600">Strategy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-700" />
          <span className="text-sm text-slate-600">Problem Discovery</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-sm text-slate-600">Solution Discovery & Design</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-200" />
          <span className="text-sm text-slate-600">Implementation</span>
        </div>
      </div>
    </Card>
  );
}

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
            Rasayel - Big Picture
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

          {/* Role Evolution */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Role Evolution</h2>
            <div className="bg-white">
              <RoleEvolutionChart />
            </div>
          </section>

          {/* Challenge */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">The Challenge</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                Rasayel faced multiple interconnected challenges that were limiting growth and user adoption:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Fragmented User Experience:</strong> Inconsistent interface patterns across different platform areas created confusion and reduced efficiency</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Scalability Issues:</strong> Rapid feature development without design system foundation led to technical debt and maintenance challenges</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Regional Complexity:</strong> Supporting Arabic RTL layouts and cultural nuances while maintaining global usability standards</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Performance Concerns:</strong> Heavy interfaces impacting user productivity, especially in high-volume support environments</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Solution */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Strategic Solution</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Design System Foundation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Built a comprehensive design system from the ground up, including component libraries, design tokens, and documentation that supported both LTR and RTL layouts seamlessly.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">User-Centered Redesign</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Conducted extensive user research and usability testing to redesign core workflows, focusing on support agent efficiency and customer satisfaction metrics.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Performance Optimization</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Implemented design patterns that reduced cognitive load and improved interface performance, resulting in faster task completion and reduced training time.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Cross-Platform Consistency</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Established design standards that worked across web, mobile, and API integrations, ensuring consistent experience regardless of access point.
                </p>
              </div>
            </div>
          </section>

          {/* Impact */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Business Impact</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                  <div className="text-sm text-slate-600">Faster task completion for support agents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">45%</div>
                  <div className="text-sm text-slate-600">Reduction in user onboarding time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">200%</div>
                  <div className="text-sm text-slate-600">Increase in feature adoption rate</div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-blue-200">
                <p className="text-slate-700 text-center">
                  The redesigned platform contributed to Rasayel&apos;s expansion into new markets and a significant increase in enterprise client acquisition.
                </p>
              </div>
            </div>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Design Process</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Research & Discovery</h3>
                  <p className="text-slate-600 text-sm">Conducted user interviews, analyzed support metrics, and performed competitive analysis to understand pain points and opportunities.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Strategic Planning</h3>
                  <p className="text-slate-600 text-sm">Developed design strategy aligned with business goals, created roadmaps, and established success metrics for the transformation.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">System Design</h3>
                  <p className="text-slate-600 text-sm">Built comprehensive design system with components, patterns, and guidelines that supported rapid, consistent development.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Iterative Implementation</h3>
                  <p className="text-slate-600 text-sm">Rolled out changes incrementally, gathering feedback and refining based on real user behavior and business metrics.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">5</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Scale & Optimize</h3>
                  <p className="text-slate-600 text-sm">Established processes for ongoing optimization, team training, and system evolution to support continued growth.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Learnings */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Key Learnings</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Cultural Design Considerations</h3>
                  <p className="text-slate-600 text-sm">Supporting RTL languages requires more than mirroring layouts - it demands understanding cultural communication patterns and visual hierarchy preferences.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Incremental Transformation</h3>
                  <p className="text-slate-600 text-sm">Large-scale design changes are most successful when implemented gradually, allowing users to adapt while maintaining business continuity.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Cross-Functional Collaboration</h3>
                  <p className="text-slate-600 text-sm">Design system success depends heavily on strong partnerships with engineering, product, and customer success teams from the beginning.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Metrics-Driven Design</h3>
                  <p className="text-slate-600 text-sm">Combining qualitative user feedback with quantitative performance metrics provides the clearest path to impactful design decisions.</p>
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
