'use client';

import dynamic from 'next/dynamic';

const RecipeCheckerApp = dynamic(
  () =>
    import('./_components/RecipeCheckerApp').then((mod) => ({
      default: mod.RecipeCheckerApp,
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

export default function RecipeCheckerPage() {
  return (
    <div className="min-h-screen bg-stone-100">
      <RecipeCheckerApp />
    </div>
  );
}

