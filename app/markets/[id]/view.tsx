"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MarketSummary } from "@/lib/polymarket";
import { buildPolymarketUrl } from "@/lib/polymarket";
import { AIResultPanel } from "@/components/AIResultPanel";

type AiAnalysisResult = {
  ai_probabilities: Record<string, number>;
  market_probabilities: Record<string, number>;
  edge: Record<string, number>;
  reasoning: string;
  bullet_points: string[];
  sources: { title: string; url: string }[];
};

type Props = {
  market: MarketSummary;
};

/**
 * Client component that displays market details with AI analysis comparison.
 * Automatically fetches and displays AI probabilities vs market odds.
 */
export function MarketDetailView({ market }: Props) {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const polymarketUrl = buildPolymarketUrl(market);

  // Fetch AI analysis for the current market
  const runAnalysis = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      // POST request to trigger AI analysis for this market
      const res = await fetch(`/api/markets/${market.id}/ai`, {
        method: "POST",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch AI analysis");
      }
      const data = (await res.json()) as AiAnalysisResult;
      setAnalysis(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch AI analysis when the market ID changes
  // This triggers whenever user navigates to a different market detail page
  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market.id]);

  // Find the outcome with the highest market probability
  const bestOutcome =
    [...market.outcomes].sort((a, b) => b.price - a.price)[0] || null;

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-2xl border border-ov-border/55 bg-black/55 p-4 shadow-ov-soft">
        {/* Market metadata badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-ov-text-muted">
            <span className="rounded-full border border-ov-border/50 bg-black/45 px-2 py-0.5">
              {market.category || "Misc"}
            </span>
            {market.end_date && (
              <span className="rounded-full border border-ov-border/50 bg-black/45 px-2 py-0.5">
                Ends: {new Date(market.end_date).toLocaleString()}
              </span>
            )}
            {market.volume != null && (
              <span className="rounded-full border border-ov-border/50 bg-black/45 px-2 py-0.5">
                Volume: $
                {market.volume.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
          </div>

          <Link
            href={polymarketUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open this market on Polymarket"
            className="inline-flex items-center gap-1 rounded-full border border-ov-border/55 bg-white/95 px-3 py-1 text-[11px] font-medium text-black transition-all hover:bg-white shadow-ov-soft hover:shadow-ov-glow/55"
          >
            <span>Open on Polymarket</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>

        <h1 className="text-lg font-semibold tracking-tight leading-snug">
          {market.question}
        </h1>

            {/* Show the outcome with the highest current market probability */}
            {bestOutcome && (
              <p className="text-[12px] text-ov-text-muted/95">
                Current market favorite:{" "}
                <span className="font-semibold text-purple-300">
                  {bestOutcome.label} · {(bestOutcome.price * 100).toFixed(1)}%
                </span>
              </p>
            )}
      </div>

      <AIResultPanel
        analysis={analysis}
        loading={loading}
        onRefresh={runAnalysis}
      />

          {/* Display error message if AI analysis fails */}
          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-[11px] text-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Disclaimer about AI-generated data */}
          <p className="text-[10px] text-ov-text-muted/85">
            ⚠️ AI forecasts are experimental and may be inaccurate. Always verify data independently. Not financial advice.
          </p>
    </div>
  );
}
