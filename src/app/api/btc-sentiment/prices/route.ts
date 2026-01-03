import { NextResponse } from "next/server";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "90";

  try {
    // CoinGecko auto-adjusts granularity based on days:
    // 1-2 days: 5-minute intervals
    // 3-90 days: hourly
    // 90+ days: daily
    // Don't specify interval param - let it auto-adjust
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CoinGecko error response:", errorText);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Bitcoin prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch Bitcoin prices" },
      { status: 500 }
    );
  }
}
