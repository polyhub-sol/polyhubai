"use client";

import { useState, useMemo } from "react";
import { MarketCard } from "@/components/MarketCard";
import type { MarketSummary } from "@/lib/polymarket";

type Props = {
  markets: MarketSummary[];
};

/** Available sorting options for markets */
type SortOption = "volume" | "date";

/**
 * Client component for markets listing page with sorting functionality.
 * Displays markets in a responsive grid with dropdown to sort by volume or end date.
 */
export function MarketsClient({ markets }: Props) {
  // Default to volume sorting to show highest trading volume markets first
  const [sortBy, setSortBy] = useState<SortOption>("volume");

  // Sort markets based on selected criteria using useMemo for performance
  // Re-computes only when markets array or sortBy changes
  // Volume: highest trading volume first (descending)
  // Date: latest end date first (newest markets first)
  const sortedMarkets = useMemo(() => {
    const sorted = [...markets];
    
    if (sortBy === "volume") {
      return sorted.sort((a, b) => {
        const volumeA = a.volume ?? 0;
        const volumeB = b.volume ?? 0;
        return volumeB - volumeA; // Descending - highest volume first
      });
    }
    
    if (sortBy === "date") {
      return sorted.sort((a, b) => {
        const dateA = a.end_date ? new Date(a.end_date).getTime() : 0;
        const dateB = b.end_date ? new Date(b.end_date).getTime() : 0;
        return dateB - dateA; // Latest end date first
      });
    }
    
    return sorted;
  }, [markets, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Markets</h1>
          <p className="text-[11px] text-ov-text-muted">
            Active prediction markets from Polymarket
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-[10px] text-ov-text-muted/90">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-full border border-ov-border/60 bg-black/60 px-3 py-1.5 text-[10px] text-ov-text-muted hover:border-ov-border/80 focus:border-ov-accent focus:outline-none transition-colors cursor-pointer"
          >
            <option value="volume">Volume</option>
            <option value="date">End Date</option>
          </select>
        </div>
      </div>

      {/* Grid of market cards, responsive: 1 col mobile, 2 tablet, 3 desktop */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedMarkets.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
    </div>
  );
}

