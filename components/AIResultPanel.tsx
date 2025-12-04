"use client";

import { ProbabilityBars } from "./ProbabilityBars";
import { ReasoningFeed } from "./ReasoningFeed";

type AiAnalysisResult = {
  ai_probabilities: Record<string, number>;
  market_probabilities: Record<string, number>;
  edge: Record<string, number>;
  reasoning: string;
  bullet_points: string[];
  sources: { title: string; url: string }[];
};

type Props = {
  analysis: AiAnalysisResult | null;
  loading: boolean;
  onRefresh: () => void;
};

/**
 * Displays AI analysis results including probability comparisons and reasoning.
 * Shows probability bars, reasoning text, bullet points, and sources.
 */
/**
 * Main panel displaying AI vs Market comparison with probability bars and reasoning.
 * Provides a refresh button to regenerate AI analysis for the current market.
 */
export function AIResultPanel({ analysis, loading, onRefresh }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ov-text-muted">
          AI vs Market
        </h2>
        {/* Button to manually refresh AI analysis - triggers new OpenAI API call */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Generate new AI forecast for this market"
          className="inline-flex items-center gap-1 rounded-full border border-ov-border/60 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-ov-text-muted hover:border-ov-accent hover:text-white disabled:opacity-50 transition-all duration-150"
        >
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <span className="h-3 w-3 animate-spin rounded-full border border-ov-accent border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            "Re-run AI view"
          )}
        </button>
      </div>

          {/* Display analysis results if available, otherwise show empty state */}
          {analysis ? (
            <>
              <ProbabilityBars
                aiProbabilities={analysis.ai_probabilities}
                marketProbabilities={analysis.market_probabilities}
              />
              <ReasoningFeed
                reasoning={analysis.reasoning}
                bullets={analysis.bullet_points}
                sources={analysis.sources}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-ov-border/55 bg-black/40 p-4 text-sm text-ov-text-muted">
          No AI analysis yet. Click &ldquo;Re-run AI view&rdquo; above to generate a forecast.
        </div>
      )}
    </div>
  );
}

