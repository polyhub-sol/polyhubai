"use client";

import { PortfolioSummary } from "@/lib/portfolio";

type Props = {
  summary: PortfolioSummary;
};

/**
 * Component displaying portfolio summary statistics.
 */
export function PortfolioSummaryCard({ summary }: Props) {
  // Defensive checks to ensure all values are valid
  const totalValue = isFinite(summary.totalValue) ? summary.totalValue : 0;
  const availableBalance = isFinite(summary.availableBalance) ? summary.availableBalance : 0;
  const totalRealizedPnl = isFinite(summary.totalRealizedPnl) ? summary.totalRealizedPnl : 0;
  const totalUnrealizedPnl = isFinite(summary.totalUnrealizedPnl) ? summary.totalUnrealizedPnl : 0;
  const winRate = isFinite(summary.winRate) ? summary.winRate : 0;
  const totalPnl = totalRealizedPnl + totalUnrealizedPnl;

  return (
    <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
      <h2 className="mb-4 text-sm font-semibold tracking-tight">Portfolio Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total Value */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Total Value</p>
          <p className="text-lg font-semibold">
            {totalValue.toFixed(4)} SOL
          </p>
        </div>

        {/* Available Balance */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Available</p>
          <p className="text-lg font-semibold text-ov-text-muted">
            {availableBalance.toFixed(4)} SOL
          </p>
        </div>

        {/* Total P&L */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Total P&L</p>
          <p
            className={`text-lg font-semibold ${
              totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {totalPnl.toFixed(4)} SOL
          </p>
        </div>

        {/* Win Rate */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Win Rate</p>
          <p className="text-lg font-semibold">
            {winRate.toFixed(1)}%
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
              totalRealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {totalRealizedPnl.toFixed(4)} SOL
          </p>
        </div>

        {/* Unrealized P&L */}
        <div className="space-y-1">
          <p className="text-[10px] text-ov-text-muted">Unrealized P&L</p>
          <p
            className={`text-sm font-medium ${
              totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {totalUnrealizedPnl.toFixed(4)} SOL
          </p>
        </div>
      </div>
    </div>
  );
}

