import { NextResponse } from "next/server";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Cache duration based on time range (aggressive caching since data is daily)
function getCacheDuration(days: number): number {
  if (days <= 30) return 600; // 10 min for short ranges
  if (days <= 90) return 1800; // 30 min
  if (days <= 365) return 3600; // 1 hour
  return 7200; // 2 hours for long ranges (data is daily anyway)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days") || "90";
  
  // Parse days - use number for CoinGecko (max becomes a large number)
  const daysNum = daysParam === "max" ? 2500 : parseInt(daysParam, 10);

  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${daysNum}`,
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
        { 
          status: 429,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CoinGecko error response:", errorText);
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
