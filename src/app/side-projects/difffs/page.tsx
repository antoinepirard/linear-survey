"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const DifffsApp = dynamic(
  () => import("./_components/DifffsApp").then((mod) => ({ default: mod.DifffsApp })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-pulse">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <div className="w-5 h-5 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
);

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-pulse">
          <span className="text-sm font-bold text-white">D</span>
        </div>
        <div className="w-5 h-5 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function DifffsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DifffsApp />
    </Suspense>
  );
}

