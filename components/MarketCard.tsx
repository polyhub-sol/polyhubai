"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MarketSummary } from "@/lib/polymarket";
import { buildPolymarketUrl } from "@/lib/polymarket";

type Props = {
  market: MarketSummary;
};

export function MarketCard({ market }: Props) {
  const bestOutcome =
    [...market.outcomes].sort((a, b) => b.price - a.price)[0] || null;

  const polymarketUrl = buildPolymarketUrl(market);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex h-full flex-col rounded-2xl border border-ov-border/80 bg-gradient-to-br from-black/80 via-ov-bg-soft/90 to-black/80 p-4 shadow-ov-soft cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border border-ov-border/80 bg-black/60 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-ov-text-muted">
              {market.category || "Misc"}
            </span>
            {bestOutcome && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                Market: {bestOutcome.label} ·{" "}
                {(bestOutcome.price * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold">
            {market.question}
          </h3>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-ov-text-muted">
        {market.end_date && (
          <span className="rounded-full border border-ov-border/60 bg-black/40 px-2 py-0.5">
            Ends: {new Date(market.end_date).toLocaleDateString()}
          </span>
        )}
        {market.volume != null && (
          <span className="rounded-full border border-ov-border/60 bg-black/40 px-2 py-0.5">
            Volume: $
            {market.volume.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-[11px] text-ov-text-muted">
          Click to see AI probabilities vs the market, or open the original on
          Polymarket.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={polymarketUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open this market on Polymarket"
            className="inline-flex items-center rounded-full border border-ov-border/70 bg-black/70 px-3 py-1.5 text-[10px] font-medium text-ov-text-muted hover:text-white hover:border-purple-400/80 hover:bg-black/90 transition"
          >
            <span>Polymarket</span>
            <span aria-hidden className="ml-1 text-[10px]">
              ↗
            </span>
          </Link>
          <Link
            href={`/markets/${encodeURIComponent(market.id)}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-purple-400 to-cyan-300 px-4 py-1.5 text-xs font-semibold leading-tight text-black transition-all"
          >
            <span>AI View</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
