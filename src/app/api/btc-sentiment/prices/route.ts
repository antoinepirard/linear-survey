import { NextResponse } from "next/server";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Historical data doesn't change - cache for 24 hours
const CACHE_DURATION = 86400; // 24 hours in seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days") || "365";
  
  const daysNum = daysParam === "max" ? 2500 : parseInt(daysParam, 10);

  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${daysNum}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: CACHE_DURATION },
      }
    );

    if (response.status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!response.ok) {
      console.error("CoinGecko error:", response.status);
      return NextResponse.json(
        { error: `CoinGecko API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    
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
