import { SentimentLevel } from "../_types";

// Get sentiment level from Fear & Greed value
export function getSentimentLevel(value: number): SentimentLevel {
  if (value <= 24) return "extreme-fear";
  if (value <= 44) return "fear";
  if (value <= 55) return "neutral";
  if (value <= 74) return "greed";
  return "extreme-greed";
}

// Get color for sentiment level
export function getSentimentColor(level: SentimentLevel): string {
  switch (level) {
    case "extreme-fear":
      return "#dc2626"; // red-600
    case "fear":
      return "#f97316"; // orange-500
    case "neutral":
      return "#6b7280"; // gray-500
    case "greed":
      return "#84cc16"; // lime-500
    case "extreme-greed":
      return "#22c55e"; // green-500
  }
}

// Get color directly from Fear & Greed value
export function getColorFromValue(value: number): string {
  return getSentimentColor(getSentimentLevel(value));
}

// Get sentiment label
export function getSentimentLabel(level: SentimentLevel): string {
  switch (level) {
    case "extreme-fear":
      return "Extreme Fear";
    case "fear":
      return "Fear";
    case "neutral":
      return "Neutral";
    case "greed":
      return "Greed";
    case "extreme-greed":
      return "Extreme Greed";
  }
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Format percentage change
export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

// Format date for chart axis
export function formatChartDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Format date for tooltip
export function formatTooltipDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

