"use client";

import { useMemo } from "react";
import { ChartDataPoint } from "../_types";
import {
  calculateSentimentStats,
  calculateCorrelation,
  SentimentStats as Stats,
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
  const correlation = useMemo(() => calculateCorrelation(data, 90), [data]);

  // Only show extreme fear, fear, greed, extreme greed (skip neutral)
  const relevantStats = stats.filter(
    (s) => s.level !== "neutral" && s.sampleCount > 10
  );

  return (
    <div className="flex items-center gap-4">
      {/* Stats by sentiment */}
      <div className="flex items-center gap-1">
        <span className="text-white/30 text-[10px] font-mono mr-1">
          Avg 90d return:
        </span>
        {relevantStats.map((stat) => (
          <div
            key={stat.level}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <span className="text-white/40 text-[10px] font-mono">
              {stat.level === "extreme-fear"
                ? "XF"
                : stat.level === "fear"
                ? "F"
                : stat.level === "greed"
                ? "G"
                : "XG"}
            </span>
            <span
              className={`text-[10px] font-mono font-medium ${
                stat.avgReturn90d >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatReturn(stat.avgReturn90d)}
            </span>
          </div>
        ))}
      </div>

      {/* Correlation indicator */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono">
        <span className="text-white/30">Correlation:</span>
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

