'use client';

import dynamic from 'next/dynamic';

const StrategyTreeApp = dynamic(
  () =>
    import('./_components/StrategyTreeApp').then((mod) => ({
      default: mod.StrategyTreeApp,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
);

export default function StrategyTreePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <StrategyTreeApp />
    </div>
  );
}

