import {
  BitcoinPricePoint,
  FearGreedDataPoint,
  ChartDataPoint,
  CoinGeckoMarketChartResponse,
  AlternativeMeFngResponse,
  TimeRange,
} from "../_types";

// Get days count for each time range
function getDaysForRange(range: TimeRange): number {
  switch (range) {
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "1y":
      return 365;
    case "2y":
      return 730;
    case "3y":
      return 1095;
    case "5y":
      return 1825;
    case "max":
      return 3650;
  }
}

// Filter data to a specific time range
function filterByDays<T extends { timestamp: number }>(data: T[], days: number): T[] {
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
  return data.filter((d) => d.timestamp >= cutoffTime);
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

// Cache for the full dataset (fetched once)
let pricesCache: BitcoinPricePoint[] | null = null;
let fearGreedCache: FearGreedDataPoint[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all Bitcoin price history (max range) - called once
async function fetchAllBitcoinPrices(): Promise<BitcoinPricePoint[]> {
  // Return cached if fresh
  if (pricesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return pricesCache;
  }

  // Fetch max range (will get ~2000 daily points)
  const response = await fetch(`/api/btc-sentiment/prices?days=max`);
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("429: Rate limited. Please wait a moment.");
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data: CoinGeckoMarketChartResponse = await response.json();
  
  if ('error' in data) {
    throw new Error(data.error as string);
  }

  pricesCache = data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));
  cacheTimestamp = Date.now();
  
  return pricesCache;
}

// Fetch all Fear & Greed history - called once
async function fetchAllFearGreed(): Promise<FearGreedDataPoint[]> {
  // Return cached if fresh
  if (fearGreedCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return fearGreedCache;
  }

  // Fetch max available (~2500 days)
  const response = await fetch(`/api/btc-sentiment/fear-greed?limit=2500`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: AlternativeMeFngResponse = await response.json();

  fearGreedCache = data.data.map((item) => ({
    timestamp: parseInt(item.timestamp) * 1000,
    value: parseInt(item.value),
    classification: item.value_classification,
  }));
  
  return fearGreedCache;
}

// Get Bitcoin prices for a specific range (from cache)
export async function fetchBitcoinPrices(range: TimeRange): Promise<BitcoinPricePoint[]> {
  const allPrices = await fetchAllBitcoinPrices();
  const days = getDaysForRange(range);
  return filterByDays(allPrices, days);
}

// Get Fear & Greed for a specific range (from cache)
export async function fetchFearGreedIndex(range: TimeRange): Promise<FearGreedDataPoint[]> {
  const allFearGreed = await fetchAllFearGreed();
  const days = getDaysForRange(range);
  return filterByDays(allFearGreed, days);
}

// Merge Bitcoin prices with Fear & Greed data by date
export function mergeChartData(
  prices: BitcoinPricePoint[],
  fearGreed: FearGreedDataPoint[]
): ChartDataPoint[] {
  // Create a map of Fear & Greed values by date (YYYY-MM-DD)
  const fgMap = new Map<string, FearGreedDataPoint>();
  fearGreed.forEach((fg) => {
    const dateKey = new Date(fg.timestamp).toISOString().split("T")[0];
    fgMap.set(dateKey, fg);
  });

  // Merge with price data
  const merged = prices
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

  // Sample for chart performance (max 300 points)
  return sampleData(merged, 300);
}

// Fetch chart data for a specific range
export async function fetchChartData(range: TimeRange): Promise<ChartDataPoint[]> {
  const [prices, fearGreed] = await Promise.all([
    fetchBitcoinPrices(range),
    fetchFearGreedIndex(range),
  ]);

  return mergeChartData(prices, fearGreed);
}

// Get current Bitcoin price and 24h change
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

// Clear cache (useful for manual refresh)
export function clearCache() {
  pricesCache = null;
  fearGreedCache = null;
  cacheTimestamp = 0;
}
