import { NextResponse } from "next/server";
import { fetchMarketByIdFromGamma } from "@/lib/polymarket";

type Params = { params: { id: string } };

/**
 * GET /api/markets/[id]
 * 
 * Returns a single market by its unique ID from Polymarket Gamma API.
 * Used when viewing a specific market's detail page.
 * 
 * Route Parameters:
 * - id: Unique market identifier from Polymarket
 * 
 * @param params - Route params containing the market ID
 * @returns JSON response with MarketSummary object, or 404 if not found
 */
export async function GET(_: Request, { params }: Params) {
  const market = await fetchMarketByIdFromGamma(params.id);
  if (!market) {
    return new NextResponse(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }
  return NextResponse.json(market);
}

