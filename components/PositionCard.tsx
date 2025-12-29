"use client";

import { Position } from "@/lib/portfolio";

type Props = {
  position: Position;
  onClose?: (id: string) => void;
};

/**
 * Component displaying a single portfolio position.
 */
export function PositionCard({ position, onClose }: Props) {
  const pnl = position.status === "open" ? position.unrealizedPnl : position.realizedPnl;
  const pnlPercent =
    position.status === "open"
      ? position.entryPrice > 0 && isFinite(position.entryPrice) && isFinite(position.currentPrice)
        ? ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100
        : 0
      : position.realizedPnl && position.size > 0 && isFinite(position.realizedPnl) && isFinite(position.size)
        ? (position.realizedPnl / position.size) * 100
        : 0;

  return (
    <div className="rounded-xl border border-ov-border/55 bg-black/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                position.status === "open"
                  ? "bg-emerald-500/12 text-emerald-300"
                  : "bg-ov-text-muted/12 text-ov-text-muted"
              }`}
            >
              {position.status.toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                position.type === "long"
                  ? "bg-blue-500/12 text-blue-300"
                  : "bg-purple-500/12 text-purple-300"
              }`}
            >
              {position.type.toUpperCase()}
            </span>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold">{position.marketQuestion}</h3>
          <p className="text-[11px] text-ov-text-muted">Outcome: {position.outcome}</p>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <p className="text-ov-text-muted">Entry Price</p>
              <p className="font-medium">{(position.entryPrice * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-ov-text-muted">Current Price</p>
              <p className="font-medium">
                {position.status === "open"
                  ? (position.currentPrice * 100).toFixed(1)
                  : position.exitTime
                    ? (position.currentPrice * 100).toFixed(1)
                    : "N/A"}
                %
              </p>
            </div>
            <div>
              <p className="text-ov-text-muted">Size</p>
              <p className="font-medium">{position.size.toFixed(4)} SOL</p>
            </div>
            <div>
              <p className="text-ov-text-muted">P&L</p>
              <p
                className={`font-semibold ${
                  (pnl || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {pnl !== undefined ? `${pnl >= 0 ? "+" : ""}${pnl.toFixed(4)} SOL` : "N/A"}
              </p>
            </div>
          </div>

          {pnlPercent !== undefined && (
            <div className="pt-1">
              <p className="text-[10px] text-ov-text-muted">
                Return:{" "}
                <span
                  className={`font-medium ${
                    pnlPercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {pnlPercent >= 0 ? "+" : ""}
                  {pnlPercent.toFixed(2)}%
                </span>
              </p>
            </div>
          )}
        </div>

        {position.status === "open" && onClose && (
          <button
            onClick={() => onClose(position.id)}
            className="rounded-full border border-ov-border/55 bg-black/70 px-3 py-1.5 text-[10px] font-medium text-ov-text-muted hover:text-white hover:border-red-400/65 hover:bg-black/90 transition-all"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

