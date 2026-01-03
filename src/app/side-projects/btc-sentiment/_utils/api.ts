import {
  BitcoinPricePoint,
  FearGreedDataPoint,
  ChartDataPoint,
  CoinGeckoMarketChartResponse,
  AlternativeMeFngResponse,
  TimeRange,
} from "../_types";

// CoinGecko free tier: max 365 days
function getDaysForRange(range: TimeRange): number {
  switch (range) {
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 365;
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

// In-memory cache - stores max range (1Y) and filters for shorter ranges
interface DataCache {
  prices: BitcoinPricePoint[];
  fearGreed: FearGreedDataPoint[];
  timestamp: number;
}

let dataCache: DataCache | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (data is historical, doesn't change)

function isCacheValid(): boolean {
  return dataCache !== null && Date.now() - dataCache.timestamp < CACHE_DURATION;
}

// Fetch Bitcoin prices - always fetches 1Y and filters client-side
async function fetchRawBitcoinPrices(): Promise<BitcoinPricePoint[]> {
  const response = await fetch("/api/btc-sentiment/prices?days=365");
  
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

// Fetch Fear & Greed - always fetches 1Y and filters client-side
async function fetchRawFearGreed(): Promise<FearGreedDataPoint[]> {
  const response = await fetch("/api/btc-sentiment/fear-greed?limit=365");
  
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

// Load all data into cache (once per hour)
async function ensureCacheLoaded(): Promise<void> {
  if (isCacheValid()) return;

  const [prices, fearGreed] = await Promise.all([
    fetchRawBitcoinPrices(),
    fetchRawFearGreed(),
  ]);

  dataCache = {
    prices,
    fearGreed,
    timestamp: Date.now(),
  };
}

// Get Bitcoin prices for a time range (filters from cache)
export async function fetchBitcoinPrices(range: TimeRange): Promise<BitcoinPricePoint[]> {
  await ensureCacheLoaded();
  
  const days = getDaysForRange(range);
  const filtered = filterByDays(dataCache!.prices, days);
  const maxPoints = days <= 90 ? days : 200;
  
  return sampleData(filtered, maxPoints);
}

// Get Fear & Greed for a time range (filters from cache)
export async function fetchFearGreedIndex(range: TimeRange): Promise<FearGreedDataPoint[]> {
  await ensureCacheLoaded();
  
  const days = getDaysForRange(range);
  return filterByDays(dataCache!.fearGreed, days);
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

// Clear cache (for manual refresh)
export function clearCache() {
  dataCache = null;
}
