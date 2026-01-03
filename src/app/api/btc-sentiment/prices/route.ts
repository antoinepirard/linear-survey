import { NextResponse } from "next/server";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days") || "90";
  
  // Convert "max" to actual days for CoinGecko
  const days = daysParam === "max" ? "max" : daysParam;

  try {
    // CoinGecko auto-adjusts granularity:
    // 1-2 days: 5-minute intervals
    // 3-90 days: hourly
    // 90+ days: daily
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
        },
        // Cache for 1 hour since we only fetch once
        next: { revalidate: 3600 },
      }
    );

    if (response.status === 429) {
      // Don't cache rate limit errors
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { 
          status: 429,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CoinGecko error response:", errorText);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return raw data - let client handle filtering/sampling
    return NextResponse.json({
      prices: data.prices,
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
