import { fetchMarketByIdFromGamma } from "@/lib/polymarket";
import { MarketDetailView } from "./view";

type Props = {
  params: { id: string };
};

/**
 * Market detail page displaying individual market analysis.
 * 
 * Fetches market by ID and renders the detail view with AI analysis.
 * Shows 404-style message if market is not found.
 */
export default async function MarketDetailPage({ params }: Props) {
  const market = await fetchMarketByIdFromGamma(params.id);
  
  if (!market) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-ov-text-muted">
        Market not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <MarketDetailView market={market} />
    </div>
  );
}

