"use client";

import dynamic from "next/dynamic";

const BitcoinSentimentApp = dynamic(
  () =>
    import("./_components/BitcoinSentimentApp").then((mod) => ({
      default: mod.BitcoinSentimentApp,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function BitcoinSentimentPage() {
  return <BitcoinSentimentApp />;
}

