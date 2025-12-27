import { fetchMarketsFromGamma } from "@/lib/polymarket";
import { MarketsClient } from "./MarketsClient";

// Force dynamic rendering to ensure fresh market data on each request
export const dynamic = "force-dynamic";

/**
 * Markets listing page displaying active prediction markets from Polymarket.
 * 
 * Fetches top 40 markets by volume and passes them to client component
 * for sorting and interactive display.
 */
export default async function MarketsPage() {
  // Fetch top 40 markets by volume from Polymarket Gamma API
  const markets = await fetchMarketsFromGamma(40);

  return <MarketsClient markets={markets} />;
}

