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

interface BitcoinChartProps {
  data: ChartDataPoint[];
}

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const sentimentColor = getColorFromValue(data.fearGreedValue);
  const sentimentLevel = getSentimentLevel(data.fearGreedValue);

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
    </div>
  );
}

export function BitcoinChart({ data }: BitcoinChartProps) {
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
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
          minTickGap={60}
        />

        <YAxis
          domain={yDomain}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace" }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          width={50}
        />

        <Tooltip
          content={<CustomTooltip />}
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
