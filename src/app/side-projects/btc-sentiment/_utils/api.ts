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
      return 2500; // ~7 years, safe for CoinGecko
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

// Per-range cache
const cache = new Map<TimeRange, {
  prices: BitcoinPricePoint[];
  fearGreed: FearGreedDataPoint[];
  timestamp: number;
}>();

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Check if cache is valid
function isCacheValid(range: TimeRange): boolean {
  const cached = cache.get(range);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

// Fetch Bitcoin prices for a specific range
export async function fetchBitcoinPrices(range: TimeRange): Promise<BitcoinPricePoint[]> {
  // Check cache
  if (isCacheValid(range)) {
    return cache.get(range)!.prices;
  }

  const days = getDaysForRange(range);
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

  const prices = data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));

  // Sample based on time range
  const maxPoints = range === "30d" ? 30 : range === "90d" ? 90 : 200;
  return sampleData(prices, maxPoints);
}

// Fetch Fear & Greed for a specific range
export async function fetchFearGreedIndex(range: TimeRange): Promise<FearGreedDataPoint[]> {
  // Check cache
  if (isCacheValid(range)) {
    return cache.get(range)!.fearGreed;
  }

  const days = getDaysForRange(range);
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

  // Cache the results
  cache.set(range, {
    prices,
    fearGreed,
    timestamp: Date.now(),
  });

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
  cache.clear();
}
