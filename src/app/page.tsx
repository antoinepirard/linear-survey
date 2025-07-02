import Image from 'next/image';
import ListItem from '@/components/ListItem';

const highlightsData = [
  {
    title: 'Rasayel Reporting',
    description: 'Lead Platform Team',
    category: '2021 – Present',
    href: '#'
  },  {
    title: 'Rasayel Automations',
    description: 'Product Research & Design',
    category: '2021 – Present',
    href: '#'
  },
  {
    title: 'Rasayel Inbox',
    description: 'Product strategy and development',
    category: 'Product',
    href: '#'
  },
  {
    title: 'GoVocal',
    description: 'Design tool and workflow optimization',
    category: 'Product, Web',
    href: '#'
  },
  {
    title: 'Insights',
    description: 'Data visualization and analytics platform',
    category: 'Web',
    href: '#'
  }
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-20 py-9">
          {/* Header */}
          <div className="pt-9 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <h1 className="text-base font-bold text-slate-900">
              Antoine Pirard
            </h1>
            <p className="text-base font-regular text-slate-600">
              Product design leader
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="text-base font-medium leading-relaxed text-slate-950">
                Product design leader scaling startups from nothing to millions in ARR.
              </p>
              <p className="text-base leading-relaxed text-slate-700">
                — I&apos;m building experiences and teams that allow businesses to scale to their full potential.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="text-base leading-relaxed text-slate-600">
                Over the last 10 years, I&apos;ve helped early-stage startup founders create products from the ground up, 
                led teams and developed successful product strategy. I thrive in strategic chaos clearing and crafting 
                the detailed experiences that make a product feel complete.
              </p>
            </div>
          </div>

          {/* Highlights Section */}
          <ListItem items={highlightsData} title="Highlights" animationDelay="300ms" />

          {/* Company Logos Section */}
          <div className="mt-9 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex gap-12 items-center flex-wrap">
              <div className="h-8 flex items-center">
                <Image 
                  src="/Assets/Logos/Rasayel Logo.svg" 
                  alt="Rasayel" 
                  width={105}
                  height={29}
                />
              </div>
              <div className="h-8 flex items-center">
                <Image 
                  src="/Assets/Logos/GoVocal Logo.svg" 
                  alt="GoVocal" 
                  width={65}
                  height={44}
                />
              </div>
              <div className="h-6 flex items-center">
                <Image 
                  src="/Assets/Logos/CambridgeJBS Logo.svg" 
                  alt="Cambridge Judge Business School" 
                  width={120}
                  height={24}
                />
              </div>
              <div className="h-8 flex items-center">
                <Image 
                  src="/Assets/Logos/CentralApp Logo.svg" 
                  alt="CentralApp" 
                  width={129}
                  height={24}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
