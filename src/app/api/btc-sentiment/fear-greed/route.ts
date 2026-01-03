import { NextResponse } from "next/server";

const ALTERNATIVE_ME_BASE_URL = "https://api.alternative.me/fng";

// Fear & Greed Index started Feb 1, 2018 - max ~2500 days of data
const MAX_FNG_DAYS = 2500;

// Cache duration based on limit
function getCacheDuration(limit: number): number {
  if (limit <= 30) return 300; // 5 minutes
  if (limit <= 90) return 900; // 15 minutes
  if (limit <= 365) return 3600; // 1 hour
  return 7200; // 2 hours for long ranges
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = parseInt(searchParams.get("limit") || "90", 10);
  
  // Cap at max available data
  const limit = Math.min(requestedLimit, MAX_FNG_DAYS);

  try {
    const response = await fetch(
      `${ALTERNATIVE_ME_BASE_URL}/?limit=${limit}&format=json`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: getCacheDuration(limit) },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Alternative.me error response:", errorText);
      throw new Error(`Alternative.me API error: ${response.status}`);
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
