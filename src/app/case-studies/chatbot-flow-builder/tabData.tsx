import Image from 'next/image';
import { TabItem } from '@/components/ui/tabs';

export const tabData: TabItem[] = [
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