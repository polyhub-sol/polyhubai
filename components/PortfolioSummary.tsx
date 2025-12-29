"use client";

import { PortfolioSummary } from "@/lib/portfolio";

type Props = {
  summary: PortfolioSummary;
};

/**
 * Component displaying portfolio summary statistics.
 */
export function PortfolioSummaryCard({ summary }: Props) {
  return (
    <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
      <h2 className="mb-4 text-sm font-semibold tracking-tight">Portfolio Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total Value */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Total Value</p>
          <p className="text-lg font-semibold">
            {summary.totalValue.toFixed(4)} SOL
          </p>
        </div>

        {/* Available Balance */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Available</p>
          <p className="text-lg font-semibold text-ov-text-muted">
            {summary.availableBalance.toFixed(4)} SOL
          </p>
        </div>

        {/* Total P&L */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Total P&L</p>
          <p
            className={`text-lg font-semibold ${
              summary.totalRealizedPnl + summary.totalUnrealizedPnl >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {(summary.totalRealizedPnl + summary.totalUnrealizedPnl).toFixed(4)} SOL
          </p>
        </div>

        {/* Win Rate */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Win Rate</p>
          <p className="text-lg font-semibold">
            {summary.winRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Open Positions */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Open Positions</p>
          <p className="text-sm font-medium">{summary.openPositions}</p>
        </div>

        {/* Closed Positions */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Closed Positions</p>
          <p className="text-sm font-medium">{summary.closedPositions}</p>
        </div>

        {/* Realized P&L */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Realized P&L</p>
          <p
            className={`text-sm font-medium ${
              summary.totalRealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {summary.totalRealizedPnl.toFixed(4)} SOL
          </p>
        </div>

        {/* Unrealized P&L */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Unrealized P&L</p>
          <p
            className={`text-sm font-medium ${
              summary.totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {summary.totalUnrealizedPnl.toFixed(4)} SOL
          </p>
        </div>
      </div>
    </div>
  );
}

