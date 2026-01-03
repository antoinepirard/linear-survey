"use client";

import { useState, useEffect, useCallback } from "react";
import { BitcoinChart } from "./BitcoinChart";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { ChartDataPoint, TimeRange } from "../_types";
import { fetchChartData, fetchCurrentPrice, clearCache } from "../_utils/api";
import {
  formatPrice,
  formatChange,
  getColorFromValue,
  getSentimentLevel,
  getSentimentLabel,
} from "../_utils/sentiment";

export function BitcoinSentimentApp() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the most recent Fear & Greed value from chart data
  const currentFearGreed = chartData.length > 0 
    ? chartData[chartData.length - 1].fearGreedValue 
    : null;

  const loadData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      clearCache();
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch chart data (uses internal cache - only hits API on first load)
      const data = await fetchChartData(timeRange);
      setChartData(data);

      // Fetch current price
      const priceData = await fetchCurrentPrice();
      setCurrentPrice(priceData.price);
      setPriceChange(priceData.change24h);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load data";
      
      if (errorMessage.includes("429")) {
        setError("Rate limited. Please wait a moment and try again.");
      } else {
        setError("Failed to load data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get date range for footer
  const dateRange = chartData.length > 0
    ? `${chartData[0].date} — ${chartData[chartData.length - 1].date}`
    : "";

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-start justify-between p-4 md:p-6">
        {/* Left: Bitcoin price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
              BTC/USD
            </span>
          </div>
          {currentPrice !== null ? (
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
                {currentFearGreed} · {getSentimentLabel(getSentimentLevel(currentFearGreed))}
              </span>
            </div>
          )}

          {/* Time range selector */}
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </header>

      {/* Chart area - takes remaining space, full width */}
      <main className="flex-1 min-h-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              <span className="text-white/30 text-xs font-mono">Loading data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-red-500/80 text-sm font-mono text-center max-w-xs">{error}</span>
              <button
                onClick={() => loadData(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <BitcoinChart data={chartData} />
        )}
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 px-4 md:px-6 py-3 flex items-center justify-between border-t border-white/5">
        <span className="text-white/20 text-xs font-mono">
          {dateRange}
        </span>
        <span className="text-white/20 text-xs font-mono">
          Data: CoinGecko · Alternative.me
        </span>
      </footer>
    </div>
  );
}
