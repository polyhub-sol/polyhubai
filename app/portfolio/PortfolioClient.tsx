"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { PortfolioManager, PortfolioSummary } from "@/lib/portfolio";
import { PortfolioSummaryCard } from "@/components/PortfolioSummary";
import { PositionCard } from "@/components/PositionCard";
import Link from "next/link";

/**
 * Client component for portfolio management page.
 * Displays portfolio summary, positions, and performance metrics.
 */
export function PortfolioClient() {
  const { publicKey, connected, connect, getBalance } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [portfolioManager] = useState(() => new PortfolioManager());
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [positionsUpdateKey, setPositionsUpdateKey] = useState(0);

  // Load balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      getBalance().then(setBalance);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, getBalance]);

  // Update portfolio summary
  useEffect(() => {
    const availableBalance = balance || 0;
    const summary = portfolioManager.calculateSummary(availableBalance);
    setPortfolioSummary(summary);
  }, [balance, portfolioManager]);

  const handleClosePosition = (positionId: string) => {
    // In a real implementation, this would close the position on-chain
    // For now, we'll just update the local state
    const position = portfolioManager.getPosition(positionId);
    if (position && position.status === "open") {
      portfolioManager.closePosition(positionId, position.currentPrice);
      const availableBalance = balance || 0;
      const summary = portfolioManager.calculateSummary(availableBalance);
      setPortfolioSummary(summary);
      // Force re-render to update positions list
      setPositionsUpdateKey((prev) => prev + 1);
    }
  };

  // Recalculate positions when update key changes (forces re-render when positions change)
  const openPositions = portfolioManager.getOpenPositions();
  const closedPositions = portfolioManager.getClosedPositions();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold tracking-tight">Portfolio</h1>
        <p className="text-[11px] text-ov-text-muted/90 mt-1">
          Track your positions, P&L, and trading performance
        </p>
      </div>

      {!connected ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-ov-border/55 bg-black/55 p-12 shadow-ov-soft">
          <svg
            className="h-16 w-16 text-ov-text-muted/50 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-lg font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-sm text-ov-text-muted mb-6 text-center max-w-md">
            Connect your embedded wallet to view your portfolio and track your trading positions.
          </p>
          <button
            onClick={connect}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-purple px-5 py-2 text-sm font-semibold text-black shadow-ov-glow/90 transition-all hover:shadow-ov-glow/70 hover:scale-[1.02]"
          >
            Connect Wallet
          </button>
          <Link
            href="/agent-manager"
            className="mt-4 text-[11px] text-ov-text-muted hover:text-ov-accent transition-colors"
          >
            Or manage strategies in Agent Manager →
          </Link>
        </div>
      ) : (
        <>
          {/* Portfolio Summary */}
          {portfolioSummary && (
            <div className="mb-6">
              <PortfolioSummaryCard summary={portfolioSummary} />
            </div>
          )}

          {/* Wallet Info */}
          <div className="mb-6 rounded-2xl border border-ov-border/55 bg-black/55 p-4 shadow-ov-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-ov-text-muted mb-1">Wallet Address</p>
                <p className="font-mono text-sm text-ov-text">
                  {publicKey ? `${publicKey.toBase58().slice(0, 12)}...${publicKey.toBase58().slice(-12)}` : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-ov-text-muted mb-1">Available Balance</p>
                <p className="text-sm font-semibold">
                  {balance !== null && isFinite(balance) ? `${balance.toFixed(4)} SOL` : balance === null ? "Loading..." : "Error"}
                </p>
              </div>
            </div>
          </div>

          {/* Positions Tabs */}
          <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Positions</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("open")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    activeTab === "open"
                      ? "bg-gradient-to-r from-ov-accent-soft to-ov-purple text-black"
                      : "border border-ov-border/55 bg-black/40 text-ov-text-muted hover:text-white"
                  }`}
                >
                  Open ({openPositions.length})
                </button>
                <button
                  onClick={() => setActiveTab("closed")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    activeTab === "closed"
                      ? "bg-gradient-to-r from-ov-accent-soft to-ov-purple text-black"
                      : "border border-ov-border/55 bg-black/40 text-ov-text-muted hover:text-white"
                  }`}
                >
                  Closed ({closedPositions.length})
                </button>
              </div>
            </div>

            {/* Positions List */}
            {activeTab === "open" ? (
              openPositions.length > 0 ? (
                <div className="space-y-3" key={positionsUpdateKey}>
                  {openPositions.map((position) => (
                    <PositionCard
                      key={position.id}
                      position={position}
                      onClose={handleClosePosition}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-ov-border/55 bg-black/40 p-8 text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-ov-text-muted/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-ov-text-muted">
                    No open positions
                  </p>
                  <p className="mt-1 text-[10px] text-ov-text-muted/70">
                    Your open trading positions will appear here
                  </p>
                </div>
              )
            ) : closedPositions.length > 0 ? (
              <div className="space-y-3" key={positionsUpdateKey}>
                {closedPositions.map((position) => (
                  <PositionCard key={position.id} position={position} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-ov-border/55 bg-black/40 p-8 text-center">
                <svg
                  className="mx-auto h-10 w-10 text-ov-text-muted/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-sm text-ov-text-muted">
                  No closed positions
                </p>
                <p className="mt-1 text-[10px] text-ov-text-muted/70">
                  Your closed trading positions will appear here
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-3">
            <Link
              href="/agent-manager"
              className="flex-1 rounded-full border border-ov-border/55 bg-black/70 px-4 py-2 text-center text-xs font-medium text-ov-text-muted hover:text-white hover:border-ov-accent hover:bg-black/90 transition-all"
            >
              Manage Strategies
            </Link>
            <Link
              href="/markets"
              className="flex-1 rounded-full border border-ov-border/55 bg-black/70 px-4 py-2 text-center text-xs font-medium text-ov-text-muted hover:text-white hover:border-ov-accent hover:bg-black/90 transition-all"
            >
              Browse Markets
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

