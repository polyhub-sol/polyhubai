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

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
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

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market.id]);

  const bestOutcome =
    [...market.outcomes].sort((a, b) => b.price - a.price)[0] || null;

  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-2xl border border-ov-border/80 bg-black/60 p-4 shadow-ov-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-ov-text-muted">
            <span className="rounded-full border border-ov-border/70 bg-black/60 px-2 py-0.5">
              {market.category || "Misc"}
            </span>
            {market.end_date && (
              <span className="rounded-full border border-ov-border/70 bg-black/60 px-2 py-0.5">
                Ends: {new Date(market.end_date).toLocaleString()}
              </span>
            )}
            {market.volume != null && (
              <span className="rounded-full border border-ov-border/70 bg-black/60 px-2 py-0.5">
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
            className="inline-flex items-center gap-1 rounded-full border border-ov-border/70 bg-white/90 px-3 py-1 text-[11px] font-medium text-black transition hover:bg-white shadow-ov-soft hover:shadow-ov-glow/50"
          >
            <span>Open on Polymarket</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>

        <h1 className="text-lg font-semibold tracking-tight">
          {market.question}
        </h1>

        {bestOutcome && (
          <p className="text-[12px] text-ov-text-muted">
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

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
          {error}
        </div>
      )}

      <p className="text-[10px] text-ov-text-muted">
        PolyHubAI uses AI to generate probabilities and explanations. This may
        be inaccurate or outdated relative to Polymarket&apos;s live markets.
        Do not rely on this data for actual trades.
      </p>
    </div>
  );
}
