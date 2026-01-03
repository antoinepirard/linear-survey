import {
  BitcoinPricePoint,
  FearGreedDataPoint,
  ChartDataPoint,
  TimeRange,
} from "../_types";

// Import static historical data (no API calls needed!)
import btcPricesData from "../_data/btc-prices.json";
import fearGreedData from "../_data/fear-greed.json";

const btcPrices: BitcoinPricePoint[] = btcPricesData;
const fearGreed: FearGreedDataPoint[] = fearGreedData;

// Get days count for each time range
function getDaysForRange(range: TimeRange): number | "max" {
  switch (range) {
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 365;
    case "2y": return 730;
    case "3y": return 1095;
    case "5y": return 1825;
    case "max": return "max";
  }
}

// Sample data to reduce points for chart performance
function sampleData<T>(data: T[], maxPoints: number): T[] {
  if (data.length <= maxPoints) return data;
  
  const step = Math.floor(data.length / maxPoints);
  const sampled: T[] = [];
  
  for (let i = 0; i < data.length; i += step) {
    sampled.push(data[i]);
  }
  
  // Always include the last point
  if (sampled.length > 0 && sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1]);
  }
  
  return sampled;
}

// Filter data to a specific number of days from now
function filterByDays<T extends { timestamp: number }>(data: T[], days: number | "max"): T[] {
  if (days === "max") return data;
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
  return data.filter((d) => d.timestamp >= cutoffTime);
}

// Get Bitcoin prices for a time range (from static data - instant!)
export function fetchBitcoinPrices(range: TimeRange): BitcoinPricePoint[] {
  const days = getDaysForRange(range);
  const filtered = filterByDays(btcPrices, days);
  
  // Sample for chart performance
  const maxPoints = typeof days === "number" && days <= 90 ? days : 300;
  return sampleData(filtered, maxPoints);
}

// Get Fear & Greed for a time range (from static data - instant!)
export function fetchFearGreedIndex(range: TimeRange): FearGreedDataPoint[] {
  const days = getDaysForRange(range);
  return filterByDays(fearGreed, days);
}

// Merge Bitcoin prices with Fear & Greed data by date
export function mergeChartData(
  prices: BitcoinPricePoint[],
  fearGreedPoints: FearGreedDataPoint[]
): ChartDataPoint[] {
  const fgMap = new Map<string, FearGreedDataPoint>();
  fearGreedPoints.forEach((fg) => {
    const dateKey = new Date(fg.timestamp).toISOString().split("T")[0];
    fgMap.set(dateKey, fg);
  });

  return prices
    .map((price) => {
      const dateKey = new Date(price.timestamp).toISOString().split("T")[0];
      const fg = fgMap.get(dateKey);

      return {
        date: dateKey,
        timestamp: price.timestamp,
        price: price.price,
        fearGreedValue: fg?.value ?? 50,
        fearGreedClassification: fg?.classification ?? "Neutral",
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

// Get chart data for a specific range (synchronous - no API calls!)
export function getChartData(range: TimeRange): ChartDataPoint[] {
  const prices = fetchBitcoinPrices(range);
  const fg = fetchFearGreedIndex(range);
  return mergeChartData(prices, fg);
}

// Get current Bitcoin price (only API call needed - for live price)
export async function fetchCurrentPrice(): Promise<{
  price: number;
  change24h: number;
}> {
  const response = await fetch("/api/btc-sentiment/current");
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    price: data.bitcoin.usd,
    change24h: data.bitcoin.usd_24h_change,
  };
}
