// Bitcoin price data point
export interface BitcoinPricePoint {
  timestamp: number;
  price: number;
}

// Fear & Greed data point
export interface FearGreedDataPoint {
  timestamp: number;
  value: number;
  classification: string;
}

// Combined data point for the chart
export interface ChartDataPoint {
  date: string;
  timestamp: number;
  price: number;
  fearGreedValue: number;
  fearGreedClassification: string;
}

// API response types
export interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface AlternativeMeFngResponse {
  data: {
    value: string;
    value_classification: string;
    timestamp: string;
  }[];
}

// Time range options (full history available via static data)
export type TimeRange = "30d" | "90d" | "1y" | "2y" | "3y" | "5y" | "max";

export interface TimeRangeOption {
  value: TimeRange;
  label: string;
  days: number | "max";
}

// Sentiment classification
export type SentimentLevel =
  | "extreme-fear"
  | "fear"
  | "neutral"
  | "greed"
  | "extreme-greed";
