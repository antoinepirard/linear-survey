"use client";

import { useMemo } from "react";
import { ChartDataPoint } from "../_types";
import { calculateSentimentStats } from "../_utils/analytics";

interface SentimentStatsProps {
  data: ChartDataPoint[];
}

export function SentimentStats({ data }: SentimentStatsProps) {
  const stats = useMemo(() => calculateSentimentStats(data), [data]);

  const fearStats = stats.find((s) => s.level === "extreme-fear");
  const greedStats = stats.find((s) => s.level === "extreme-greed");

  if (!fearStats || !greedStats) return null;

  return (
    <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
      <span>Avg 1Y return:</span>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span>Extreme Fear</span>
        <span className="text-green-400 font-medium">
          +{fearStats.avgReturn1y.toFixed(0)}%
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>Extreme Greed</span>
        <span className="text-green-400 font-medium">
          +{greedStats.avgReturn1y.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// Buy signal component for header
export function BuySignal({ fearGreedValue }: { fearGreedValue: number }) {
  let signal: { label: string; color: string; description: string };

  if (fearGreedValue <= 25) {
    signal = {
      label: "Strong Buy",
      color: "text-green-400",
      description: "Extreme fear = historically best entries",
    };
  } else if (fearGreedValue <= 45) {
    signal = {
      label: "Buy",
      color: "text-green-400/70",
      description: "Fear = good entry opportunity",
    };
  } else if (fearGreedValue <= 55) {
    signal = {
      label: "Neutral",
      color: "text-white/50",
      description: "Wait for better entry",
    };
  } else if (fearGreedValue <= 75) {
    signal = {
      label: "Caution",
      color: "text-orange-400",
      description: "Greed = higher risk entry",
    };
  } else {
    signal = {
      label: "High Risk",
      color: "text-red-400",
      description: "Extreme greed = worst entries historically",
    };
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className={`text-xs font-mono font-medium ${signal.color}`}>
        {signal.label}
      </span>
      <span className="text-[10px] font-mono text-white/30">
        {signal.description}
      </span>
    </div>
  );
}
