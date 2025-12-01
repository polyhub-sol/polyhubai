import { fetchMarketsFromGamma } from "@/lib/polymarket";
import { MarketCard } from "@/components/MarketCard";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  // Fetch top 40 markets by volume from Polymarket Gamma API
  const markets = await fetchMarketsFromGamma(40);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Markets</h1>
          <p className="text-[11px] text-ov-text-muted">
            Live questions from Polymarket Gamma. Sorted roughly by volume.
          </p>
        </div>
        <p className="text-[10px] text-ov-text-muted">
          Research UI only. Trading and wallet features coming soon.
        </p>
      </div>

      {/* Grid of market cards, responsive: 1 col mobile, 2 tablet, 3 desktop */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {markets.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
    </div>
  );
}

