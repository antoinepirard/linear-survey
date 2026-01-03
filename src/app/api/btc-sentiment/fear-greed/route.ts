import { NextResponse } from "next/server";

const ALTERNATIVE_ME_BASE_URL = "https://api.alternative.me/fng";
const MAX_FNG_DAYS = 2500;

// Historical data doesn't change - cache for 24 hours
const CACHE_DURATION = 86400; // 24 hours in seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = parseInt(searchParams.get("limit") || "365", 10);
  const limit = Math.min(requestedLimit, MAX_FNG_DAYS);

  try {
    const response = await fetch(
      `${ALTERNATIVE_ME_BASE_URL}/?limit=${limit}&format=json`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: CACHE_DURATION },
      }
    );

    if (!response.ok) {
      console.error("Alternative.me error:", response.status);
      return NextResponse.json(
        { error: `Alternative.me API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Fear & Greed index:", error);
    return NextResponse.json(
      { error: "Failed to fetch Fear & Greed index" },
      { status: 500 }
    );
  }
}
