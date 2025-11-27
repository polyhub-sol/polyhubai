import { NextResponse } from "next/server";
import { fetchMarketByIdFromGamma } from "@/lib/polymarket";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const market = await fetchMarketByIdFromGamma(params.id);
  if (!market) {
    return new NextResponse(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }
  return NextResponse.json(market);
}

