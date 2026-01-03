import { ChartDataPoint, SentimentLevel } from "../_types";
import { getSentimentLevel } from "./sentiment";

export interface SentimentStats {
  level: SentimentLevel;
  label: string;
  avgReturn30d: number;
  avgReturn90d: number;
  avgReturn1y: number;
  sampleCount: number;
  color: string;
}

export interface ForwardReturn {
  return30d: number | null;
  return90d: number | null;
  return1y: number | null;
}

// Get the price at a future date (or closest available)
function getFuturePrice(
  data: ChartDataPoint[],
  currentIndex: number,
  daysAhead: number
): number | null {
  const currentTimestamp = data[currentIndex].timestamp;
  const targetTimestamp = currentTimestamp + daysAhead * 24 * 60 * 60 * 1000;

  // Find closest data point to target
  for (let i = currentIndex + 1; i < data.length; i++) {
    if (data[i].timestamp >= targetTimestamp) {
      return data[i].price;
    }
  }
  return null; // Not enough future data
}

// Calculate forward return from a specific point
export function calculateForwardReturn(
  data: ChartDataPoint[],
  index: number,
  daysAhead: number
): number | null {
  const currentPrice = data[index].price;
  const futurePrice = getFuturePrice(data, index, daysAhead);

  if (futurePrice === null) return null;
  return ((futurePrice - currentPrice) / currentPrice) * 100;
}

// Get forward returns for a specific data point
export function getForwardReturns(
  allData: ChartDataPoint[],
  pointDate: string
): ForwardReturn {
  const index = allData.findIndex((d) => d.date === pointDate);
  if (index === -1) return { return30d: null, return90d: null, return1y: null };

  return {
    return30d: calculateForwardReturn(allData, index, 30),
    return90d: calculateForwardReturn(allData, index, 90),
    return1y: calculateForwardReturn(allData, index, 365),
  };
}

// Calculate average returns by sentiment level
export function calculateSentimentStats(data: ChartDataPoint[]): SentimentStats[] {
  const buckets: Record<
    SentimentLevel,
    { returns30d: number[]; returns90d: number[]; returns1y: number[] }
  > = {
    "extreme-fear": { returns30d: [], returns90d: [], returns1y: [] },
    fear: { returns30d: [], returns90d: [], returns1y: [] },
    neutral: { returns30d: [], returns90d: [], returns1y: [] },
    greed: { returns30d: [], returns90d: [], returns1y: [] },
    "extreme-greed": { returns30d: [], returns90d: [], returns1y: [] },
  };

  // Calculate forward returns for each point
  for (let i = 0; i < data.length; i++) {
    const level = getSentimentLevel(data[i].fearGreedValue);

    const ret30d = calculateForwardReturn(data, i, 30);
    const ret90d = calculateForwardReturn(data, i, 90);
    const ret1y = calculateForwardReturn(data, i, 365);

    if (ret30d !== null) buckets[level].returns30d.push(ret30d);
    if (ret90d !== null) buckets[level].returns90d.push(ret90d);
    if (ret1y !== null) buckets[level].returns1y.push(ret1y);
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const colors: Record<SentimentLevel, string> = {
    "extreme-fear": "#dc2626",
    fear: "#f97316",
    neutral: "#6b7280",
    greed: "#84cc16",
    "extreme-greed": "#22c55e",
  };

  const labels: Record<SentimentLevel, string> = {
    "extreme-fear": "Extreme Fear",
    fear: "Fear",
    neutral: "Neutral",
    greed: "Greed",
    "extreme-greed": "Extreme Greed",
  };

  return (
    ["extreme-fear", "fear", "neutral", "greed", "extreme-greed"] as SentimentLevel[]
  ).map((level) => ({
    level,
    label: labels[level],
    avgReturn30d: avg(buckets[level].returns30d),
    avgReturn90d: avg(buckets[level].returns90d),
    avgReturn1y: avg(buckets[level].returns1y),
    sampleCount: buckets[level].returns90d.length,
    color: colors[level],
  }));
}

// Get historical return for current sentiment value
export function getHistoricalReturnForSentiment(
  data: ChartDataPoint[],
  currentFearGreed: number,
  daysAhead: number = 90
): { avgReturn: number; sampleCount: number } {
  const tolerance = 10; // +/- 10 points
  const similarPoints: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const fgDiff = Math.abs(data[i].fearGreedValue - currentFearGreed);
    if (fgDiff <= tolerance) {
      const ret = calculateForwardReturn(data, i, daysAhead);
      if (ret !== null) similarPoints.push(ret);
    }
  }

  const avg =
    similarPoints.length > 0
      ? similarPoints.reduce((a, b) => a + b, 0) / similarPoints.length
      : 0;

  return { avgReturn: avg, sampleCount: similarPoints.length };
}

// Calculate Pearson correlation coefficient
export function calculateCorrelation(data: ChartDataPoint[], daysAhead: number = 90): number {
  const pairs: { fg: number; ret: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const ret = calculateForwardReturn(data, i, daysAhead);
    if (ret !== null) {
      pairs.push({ fg: data[i].fearGreedValue, ret });
    }
  }

  if (pairs.length < 10) return 0;

  const n = pairs.length;
  const sumFg = pairs.reduce((a, b) => a + b.fg, 0);
  const sumRet = pairs.reduce((a, b) => a + b.ret, 0);
  const sumFgRet = pairs.reduce((a, b) => a + b.fg * b.ret, 0);
  const sumFg2 = pairs.reduce((a, b) => a + b.fg * b.fg, 0);
  const sumRet2 = pairs.reduce((a, b) => a + b.ret * b.ret, 0);

  const numerator = n * sumFgRet - sumFg * sumRet;
  const denominator = Math.sqrt(
    (n * sumFg2 - sumFg * sumFg) * (n * sumRet2 - sumRet * sumRet)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

// Find extreme fear zones (consecutive days of extreme fear)
export function findExtremeFearZones(
  data: ChartDataPoint[]
): { start: string; end: string; minFg: number }[] {
  const zones: { start: string; end: string; minFg: number }[] = [];
  let zoneStart: string | null = null;
  let minFg = 100;

  for (let i = 0; i < data.length; i++) {
    const isExtremeFear = data[i].fearGreedValue <= 25;

    if (isExtremeFear) {
      if (zoneStart === null) {
        zoneStart = data[i].date;
        minFg = data[i].fearGreedValue;
      } else {
        minFg = Math.min(minFg, data[i].fearGreedValue);
      }
    } else if (zoneStart !== null) {
      zones.push({ start: zoneStart, end: data[i - 1].date, minFg });
      zoneStart = null;
      minFg = 100;
    }
  }

  // Close final zone if still open
  if (zoneStart !== null) {
    zones.push({ start: zoneStart, end: data[data.length - 1].date, minFg });
  }

  return zones;
}

