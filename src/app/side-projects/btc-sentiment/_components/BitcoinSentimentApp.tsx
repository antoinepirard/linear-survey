"use client";

import { useState, useEffect, useMemo } from "react";
import { BitcoinChart } from "./BitcoinChart";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { SentimentStats, BuySignal } from "./SentimentStats";
import { ChartDataPoint, TimeRange } from "../_types";
import { getChartData, fetchCurrentPrice } from "../_utils/api";
import {
  formatPrice,
  formatChange,
  getColorFromValue,
  getSentimentLevel,
  getSentimentLabel,
} from "../_utils/sentiment";

export function BitcoinSentimentApp() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  // Get all data (for forward return calculations)
  const allChartData = useMemo(() => getChartData("max"), []);

  // Chart data filtered by time range
  const chartData = useMemo(() => getChartData(timeRange), [timeRange]);

  // Get the most recent Fear & Greed value
  const currentFearGreed =
    chartData.length > 0
      ? chartData[chartData.length - 1].fearGreedValue
      : null;

  // Only fetch current price (the one API call we need)
  useEffect(() => {
    fetchCurrentPrice()
      .then((data) => {
        setCurrentPrice(data.price);
        setPriceChange(data.change24h);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-start justify-between p-4 md:p-6">
        {/* Left: Bitcoin price + Buy signal */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
              BTC/USD
            </span>
          </div>
          {currentPrice !== null ? (
            <>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-white text-2xl md:text-3xl font-mono font-semibold">
                  {formatPrice(currentPrice)}
                </span>
                {priceChange !== null && (
                  <span
                    className={`text-sm font-mono ${
                      priceChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatChange(priceChange)}
                  </span>
                )}
              </div>
              {/* Buy signal based on F&G */}
              {currentFearGreed !== null && (
                <BuySignal fearGreedValue={currentFearGreed} />
              )}
            </>
          ) : (
            <div className="h-9 w-32 bg-white/5 rounded animate-pulse mt-1" />
          )}
        </div>

        {/* Right: Fear & Greed + Time selector */}
        <div className="flex flex-col items-end gap-3">
          {/* Fear & Greed indicator */}
          {currentFearGreed !== null && (
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                F&G
              </span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getColorFromValue(currentFearGreed) }}
              />
              <span
                className="text-sm font-mono font-medium"
                style={{ color: getColorFromValue(currentFearGreed) }}
              >
                {currentFearGreed} ·{" "}
                {getSentimentLabel(getSentimentLevel(currentFearGreed))}
              </span>
            </div>
          )}

          {/* Time range selector */}
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </header>

      {/* Chart area - takes remaining space, full width */}
      <main className="flex-1 min-h-0 [&_*]:outline-none">
        <BitcoinChart data={chartData} allData={allChartData} />
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 px-4 md:px-6 py-3 border-t border-white/5">
        <SentimentStats data={allChartData} />
      </footer>
    </div>
  );
}
