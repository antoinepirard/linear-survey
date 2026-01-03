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
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 365;
    case "2y": return 730;
    case "3y": return 1095;
    case "5y": return 1825;
    case "max": return 2500;
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
function filterByDays<T extends { timestamp: number }>(data: T[], days: number): T[] {
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
  return data.filter((d) => d.timestamp >= cutoffTime);
}

// Cache structure - we store the longest fetched range
interface DataCache {
  prices: BitcoinPricePoint[];
  fearGreed: FearGreedDataPoint[];
  maxDays: number; // The range we fetched (e.g., 1095 for 3Y)
  timestamp: number;
}

let dataCache: DataCache | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Check if cache can serve this range
function canServFromCache(days: number): boolean {
  if (!dataCache) return false;
  if (Date.now() - dataCache.timestamp > CACHE_DURATION) return false;
  return days <= dataCache.maxDays;
}

// Fetch raw Bitcoin prices from API
async function fetchRawBitcoinPrices(days: number): Promise<BitcoinPricePoint[]> {
  const response = await fetch(`/api/btc-sentiment/prices?days=${days}`);
  
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

  return data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));
}

// Fetch raw Fear & Greed from API
async function fetchRawFearGreed(days: number): Promise<FearGreedDataPoint[]> {
  const response = await fetch(`/api/btc-sentiment/fear-greed?limit=${days}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: AlternativeMeFngResponse = await response.json();

  return data.data.map((item) => ({
    timestamp: parseInt(item.timestamp) * 1000,
    value: parseInt(item.value),
    classification: item.value_classification,
  }));
}

// Main function to get prices - uses cache smartly
export async function fetchBitcoinPrices(range: TimeRange): Promise<BitcoinPricePoint[]> {
  const days = getDaysForRange(range);
  
  // If cache can serve this range, filter from cache
  if (canServFromCache(days)) {
    const filtered = filterByDays(dataCache!.prices, days);
    const maxPoints = days <= 90 ? days : 200;
    return sampleData(filtered, maxPoints);
  }

  // Need to fetch - get the data for requested range
  const prices = await fetchRawBitcoinPrices(days);
  
  // Update cache with this data
  if (!dataCache || days > dataCache.maxDays) {
    dataCache = {
      prices,
      fearGreed: dataCache?.fearGreed || [],
      maxDays: days,
      timestamp: Date.now(),
    };
  }

  const maxPoints = days <= 90 ? days : 200;
  return sampleData(prices, maxPoints);
}

// Main function to get Fear & Greed - uses cache smartly
export async function fetchFearGreedIndex(range: TimeRange): Promise<FearGreedDataPoint[]> {
  const days = getDaysForRange(range);
  
  // If cache can serve this range, filter from cache
  if (canServFromCache(days) && dataCache!.fearGreed.length > 0) {
    return filterByDays(dataCache!.fearGreed, days);
  }

  // Need to fetch
  const fearGreed = await fetchRawFearGreed(days);
  
  // Update cache
  if (dataCache && days <= dataCache.maxDays) {
    dataCache.fearGreed = fearGreed;
  } else if (!dataCache) {
    dataCache = {
      prices: [],
      fearGreed,
      maxDays: days,
      timestamp: Date.now(),
    };
  }

  return filterByDays(fearGreed, days);
}

// Merge Bitcoin prices with Fear & Greed data by date
export function mergeChartData(
  prices: BitcoinPricePoint[],
  fearGreed: FearGreedDataPoint[]
): ChartDataPoint[] {
  const fgMap = new Map<string, FearGreedDataPoint>();
  fearGreed.forEach((fg) => {
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

// Clear cache
export function clearCache() {
  dataCache = null;
}
