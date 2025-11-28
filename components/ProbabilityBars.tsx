"use client";

import { motion } from "framer-motion";

type Props = {
  aiProbabilities: Record<string, number>;
  marketProbabilities: Record<string, number>;
};

/**
 * Renders animated probability bars comparing AI vs market probabilities for each outcome.
 * Uses Framer Motion for smooth animations.
 */
export function ProbabilityBars({ aiProbabilities, marketProbabilities }: Props) {
  // Collect unique outcome labels from both AI and market probability sets
  const labels = Array.from(
    new Set([...Object.keys(aiProbabilities), ...Object.keys(marketProbabilities)])
  );

  return (
        <div className="space-y-3 rounded-2xl border border-ov-border/50 bg-black/60 p-4">
      <div className="flex items-center justify-between text-xs font-semibold text-ov-text-muted">
        <span>Outcome</span>
        <div className="flex gap-4 text-[10px]">
          <span className="text-cyan-300">AI</span>
          <span className="text-purple-300">Market</span>
        </div>
      </div>
      <div className="space-y-3">
        {labels.map((label) => {
          // Extract probabilities for this outcome (default to 0 if not present)
          const ai = aiProbabilities[label] ?? 0;
          const mkt = marketProbabilities[label] ?? 0;

          return (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ov-text-muted">{label}</span>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-cyan-300">
                    AI {Math.round(ai * 100)}%
                  </span>
                  <span className="text-purple-300">
                    Mkt {Math.round(mkt * 100)}%
                  </span>
                </div>
              </div>
              {/* AI probability bar with spring animation */}
              <div className="relative h-3 overflow-hidden rounded-full bg-slate-900/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(ai, 1) * 100}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-accent"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(mkt, 1) * 100}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 20,
                    delay: 0.05,
                  }}
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ov-purple/80 to-ov-purple/50 mix-blend-screen"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

