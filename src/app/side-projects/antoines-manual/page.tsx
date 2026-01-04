"use client";

import dynamic from "next/dynamic";

const ManualApp = dynamic(
  () =>
    import("./_components/ManualApp").then((mod) => ({
      default: mod.ManualApp,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function AntoinesManualPage() {
  return <ManualApp />;
}

