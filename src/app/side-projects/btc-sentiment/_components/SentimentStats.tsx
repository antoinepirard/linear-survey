"use client";

import { useMemo } from "react";
import { ChartDataPoint } from "../_types";
import {
  calculateSentimentStats,
  calculateCorrelation,
} from "../_utils/analytics";

interface SentimentStatsProps {
  data: ChartDataPoint[];
}

function formatReturn(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(0)}%`;
}

export function SentimentStats({ data }: SentimentStatsProps) {
  const stats = useMemo(() => calculateSentimentStats(data), [data]);
  const correlation = useMemo(() => calculateCorrelation(data, 365), [data]);

  // Only show extreme fear and extreme greed for cleaner comparison
  const fearStats = stats.find((s) => s.level === "extreme-fear");
  const greedStats = stats.find((s) => s.level === "extreme-greed");

  if (!fearStats || !greedStats) return null;

  return (
    <div className="flex items-center gap-6 text-[10px] font-mono">
      {/* Extreme Fear stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: fearStats.color }}
          />
          <span className="text-white/50">Extreme Fear</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30">1Y return:</span>
          <span
            className={`font-medium ${
              fearStats.avgReturn1y >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {formatReturn(fearStats.avgReturn1y)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30">Win rate:</span>
          <span className="font-medium text-green-400">
            {fearStats.winRate1y.toFixed(0)}%
          </span>
        </div>
      </div>

      <span className="text-white/20">vs</span>

      {/* Extreme Greed stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: greedStats.color }}
          />
          <span className="text-white/50">Extreme Greed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30">1Y return:</span>
          <span
            className={`font-medium ${
              greedStats.avgReturn1y >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {formatReturn(greedStats.avgReturn1y)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30">Win rate:</span>
          <span
            className={`font-medium ${
              greedStats.winRate1y >= 50 ? "text-green-400" : "text-red-400"
            }`}
          >
            {greedStats.winRate1y.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Correlation */}
      <div className="flex items-center gap-1.5 text-white/30 border-l border-white/10 pl-4">
        <span>1Y Correlation:</span>
        <span
          className={`font-medium ${
            correlation < -0.1
              ? "text-green-400"
              : correlation > 0.1
              ? "text-red-400"
              : "text-white/50"
          }`}
        >
          {correlation.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// Compact version for header
export function HistoricalContext({
  currentFearGreed,
  historicalReturn,
  sampleCount,
}: {
  currentFearGreed: number;
  historicalReturn: number;
  sampleCount: number;
}) {
  if (sampleCount < 5) return null;

  return (
    <div className="text-[10px] font-mono text-white/40 mt-1">
      Historically,{" "}
      <span
        className={historicalReturn >= 0 ? "text-green-400/80" : "text-red-400/80"}
      >
        {historicalReturn >= 0 ? "+" : ""}
        {historicalReturn.toFixed(0)}%
      </span>{" "}
      avg return after 90d
      <span className="text-white/20"> (n={sampleCount})</span>
    </div>
  );
}
