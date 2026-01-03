import { NextResponse } from "next/server";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Max data points to return based on time range
function getMaxPoints(days: number): number {
  if (days <= 30) return 30; // Daily for 1 month
  if (days <= 90) return 90; // Daily for 3 months
  if (days <= 365) return 120; // ~3 days per point for 1 year
  if (days <= 730) return 150; // ~5 days per point for 2 years
  if (days <= 1095) return 180; // ~6 days per point for 3 years
  return 200; // ~9 days per point for 5+ years
}

// Sample data to reduce points
function sampleData(prices: [number, number][], maxPoints: number): [number, number][] {
  if (prices.length <= maxPoints) return prices;
  
  const step = Math.floor(prices.length / maxPoints);
  const sampled: [number, number][] = [];
  
  for (let i = 0; i < prices.length; i += step) {
    sampled.push(prices[i]);
  }
  
  // Always include the last point
  if (sampled.length > 0 && sampled[sampled.length - 1] !== prices[prices.length - 1]) {
    sampled.push(prices[prices.length - 1]);
  }
  
  return sampled;
}

// Cache duration based on time range (longer ranges = longer cache)
function getCacheDuration(days: number): number {
  if (days <= 30) return 300; // 5 minutes
  if (days <= 90) return 900; // 15 minutes
  if (days <= 365) return 3600; // 1 hour
  return 7200; // 2 hours for long ranges
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "90";
  const daysNum = parseInt(days, 10);

  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: getCacheDuration(daysNum) },
      }
    );

    if (response.status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CoinGecko error response:", errorText);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Sample data server-side to reduce payload
    const maxPoints = getMaxPoints(daysNum);
    const sampledPrices = sampleData(data.prices, maxPoints);
    
    return NextResponse.json({
      prices: sampledPrices,
      market_caps: [],
      total_volumes: [],
    });
  } catch (error) {
    console.error("Error fetching Bitcoin prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch Bitcoin prices" },
      { status: 500 }
    );
  }
}
