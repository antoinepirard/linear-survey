'use client';

import dynamic from 'next/dynamic';

const SourdoughApp = dynamic(
  () =>
    import('./_components/SourdoughApp').then((mod) => ({
      default: mod.SourdoughApp,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function SourdoughPage() {
  return <SourdoughApp />;
}

