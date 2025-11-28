import { NextResponse } from "next/server";
import { fetchMarketByIdFromGamma } from "@/lib/polymarket";

type Params = { params: { id: string } };

/**
 * GET /api/markets/[id]
 * Returns a single market by ID from Polymarket Gamma API.
 * Returns 404 if market is not found.
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

