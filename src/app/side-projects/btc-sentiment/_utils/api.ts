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
      return 3650; // ~10 years, CoinGecko will return all available
  }
}

// Sample data to reduce points for longer time ranges
function sampleData<T>(data: T[], maxPoints: number): T[] {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  const sampled: T[] = [];
  
  for (let i = 0; i < data.length; i += step) {
    sampled.push(data[i]);
  }
  
  // Always include the last point
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1]);
  }
  
  return sampled;
}

// Fetch Bitcoin price history via internal API route
export async function fetchBitcoinPrices(
  range: TimeRange
): Promise<BitcoinPricePoint[]> {
  const days = getDaysForRange(range);
  const response = await fetch(`/api/btc-sentiment/prices?days=${days}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: CoinGeckoMarketChartResponse = await response.json();

  const prices = data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));

  // Sample to max 500 points for performance
  return sampleData(prices, 500);
}

// Fetch Fear & Greed Index history via internal API route
export async function fetchFearGreedIndex(
  range: TimeRange
): Promise<FearGreedDataPoint[]> {
  const days = getDaysForRange(range);
  const response = await fetch(`/api/btc-sentiment/fear-greed?limit=${days}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: AlternativeMeFngResponse = await response.json();

  return data.data.map((item) => ({
    timestamp: parseInt(item.timestamp) * 1000, // Convert to milliseconds
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
        fearGreedValue: fg?.value ?? 50, // Default to neutral if no data
        fearGreedClassification: fg?.classification ?? "Neutral",
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

// Fetch all data and merge
export async function fetchChartData(
  range: TimeRange
): Promise<ChartDataPoint[]> {
  const [prices, fearGreed] = await Promise.all([
    fetchBitcoinPrices(range),
    fetchFearGreedIndex(range),
  ]);

  return mergeChartData(prices, fearGreed);
}

// Get current Bitcoin price and 24h change via internal API route
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
