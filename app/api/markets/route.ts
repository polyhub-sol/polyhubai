import { NextResponse } from "next/server";
import { fetchMarketsFromGamma } from "@/lib/polymarket";

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

