"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "../_types";
import {
  getColorFromValue,
  formatPrice,
  formatChartDate,
  formatTooltipDate,
  getSentimentLevel,
  getSentimentLabel,
} from "../_utils/sentiment";
import { getForwardReturns } from "../_utils/analytics";

interface BitcoinChartProps {
  data: ChartDataPoint[];
  allData: ChartDataPoint[]; // Full dataset for forward return calculations
}

// Custom tooltip component with forward returns
function CustomTooltip({
  active,
  payload,
  allData,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
  allData: ChartDataPoint[];
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const sentimentColor = getColorFromValue(data.fearGreedValue);
  const sentimentLevel = getSentimentLevel(data.fearGreedValue);
  
  // Calculate forward returns
  const forwardReturns = getForwardReturns(allData, data.date);

  return (
    <div className="bg-zinc-900/95 border border-white/10 rounded-lg px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-white/50 text-xs font-mono mb-1">
        {formatTooltipDate(data.date)}
      </p>
      <p className="text-white text-lg font-mono font-semibold">
        {formatPrice(data.price)}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: sentimentColor }}
        />
        <span className="text-xs font-mono" style={{ color: sentimentColor }}>
          {getSentimentLabel(sentimentLevel)} ({data.fearGreedValue})
        </span>
      </div>
      
      {/* Forward returns */}
      {(forwardReturns.return30d !== null || forwardReturns.return90d !== null) && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-white/30 text-[10px] font-mono mb-1">Return after:</p>
          <div className="flex gap-3 text-xs font-mono">
            {forwardReturns.return30d !== null && (
              <div>
                <span className="text-white/40">30d: </span>
                <span className={forwardReturns.return30d >= 0 ? "text-green-400" : "text-red-400"}>
                  {forwardReturns.return30d >= 0 ? "+" : ""}{forwardReturns.return30d.toFixed(0)}%
                </span>
              </div>
            )}
            {forwardReturns.return90d !== null && (
              <div>
                <span className="text-white/40">90d: </span>
                <span className={forwardReturns.return90d >= 0 ? "text-green-400" : "text-red-400"}>
                  {forwardReturns.return90d >= 0 ? "+" : ""}{forwardReturns.return90d.toFixed(0)}%
                </span>
              </div>
            )}
            {forwardReturns.return1y !== null && (
              <div>
                <span className="text-white/40">1y: </span>
                <span className={forwardReturns.return1y >= 0 ? "text-green-400" : "text-red-400"}>
                  {forwardReturns.return1y >= 0 ? "+" : ""}{forwardReturns.return1y.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function BitcoinChart({ data, allData }: BitcoinChartProps) {
  // Calculate gradient stops based on sentiment values
  const gradientStops = useMemo(() => {
    if (data.length === 0) return [];

    return data.map((point, index) => ({
      offset: `${(index / (data.length - 1)) * 100}%`,
      color: getColorFromValue(point.fearGreedValue),
    }));
  }, [data]);

  // Get the dominant sentiment color for the stroke
  const dominantColor = useMemo(() => {
    if (data.length === 0) return "#6b7280";

    // Use the most recent sentiment color
    const recentData = data.slice(-7);
    const avgValue =
      recentData.reduce((sum, d) => sum + d.fearGreedValue, 0) /
      recentData.length;
    return getColorFromValue(avgValue);
  }, [data]);

  // Calculate Y-axis domain with some padding
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100000];

    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white/30 font-mono text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, bottom: 30, left: 0 }}
      >
        <defs>
          <linearGradient id="sentimentGradient" x1="0" y1="0" x2="1" y2="0">
            {gradientStops.map((stop, index) => (
              <stop
                key={index}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={0.8}
              />
            ))}
          </linearGradient>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dominantColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={dominantColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace" }}
          tickFormatter={formatChartDate}
          interval="preserveStartEnd"
          minTickGap={80}
        />

        <YAxis domain={yDomain} hide />

        <Tooltip
          content={<CustomTooltip allData={allData} />}
          cursor={{
            stroke: "rgba(255,255,255,0.1)",
            strokeWidth: 1,
          }}
        />

        <Area
          type="monotone"
          dataKey="price"
          stroke="url(#sentimentGradient)"
          strokeWidth={2}
          fill="url(#fillGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
