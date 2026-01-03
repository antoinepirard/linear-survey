import { NextResponse } from "next/server";

const ALTERNATIVE_ME_BASE_URL = "https://api.alternative.me/fng";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "90";

  try {
    const response = await fetch(
      `${ALTERNATIVE_ME_BASE_URL}/?limit=${limit}&format=json`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
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

