import { NextResponse } from "next/server";
import { fetchMarketsFromGamma } from "@/lib/polymarket";

/**
 * GET /api/markets
 * 
 * Returns a list of active markets from Polymarket Gamma API.
 * Markets are sorted by trading volume in descending order.
 * 
 * @param request - Next.js request object with optional query params
 * @param request.searchParams.limit - Maximum number of markets to return (default: 40)
 * @returns JSON array of MarketSummary objects or error response
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "40") || 40;

  try {
    const markets = await fetchMarketsFromGamma(limit);
    return NextResponse.json(markets);
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ error: e?.message ?? "Failed to fetch markets" }),
      { status: 500 }
    );
  }
}

