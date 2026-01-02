'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function RecipeCheckerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setUserId(idFromUrl);
    } else {
      const newId = generateUserId();
      router.replace(`/side-projects/recipe-checker?id=${newId}`);
      setUserId(newId);
    }
  }, [searchParams, router]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <RecipeCheckerApp userId={userId} />
    </div>
  );
}

