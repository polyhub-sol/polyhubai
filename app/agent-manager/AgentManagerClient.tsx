"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { STRATEGY_TEMPLATES, getStrategyTemplate } from "@/lib/strategyTemplates";
import { PortfolioManager, PortfolioSummary } from "@/lib/portfolio";
import { PortfolioSummaryCard } from "@/components/PortfolioSummary";
import { PositionCard } from "@/components/PositionCard";

/**
 * Client component for agent manager with wallet integration and strategy management.
 */
export function AgentManagerClient() {
  const { publicKey, connected, connect, disconnect, getBalance } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [portfolioManager] = useState(() => new PortfolioManager());
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);

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

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setBalance(null);
  };

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold tracking-tight">Agent Manager</h1>
        <p className="text-[11px] text-ov-text-muted/90 mt-1">
          Manage embedded wallets, strategy templates, and automated trading agents
        </p>
      </div>

      {/* Wallet Connection Section */}
      <div className="mb-6 rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Wallet Connection</h2>
            <p className="text-[11px] text-ov-text-muted/90 mt-0.5">
              Connect your embedded Solana wallet to start trading
            </p>
          </div>
        </div>

        {!connected ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ov-border/55 bg-black/40 p-8">
            <svg
              className="h-12 w-12 text-ov-text-muted/50"
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
            <div className="text-center">
              <p className="text-sm font-medium text-ov-text-muted mb-2">
                No wallet connected
              </p>
              <p className="text-[11px] text-ov-text-muted/70 mb-4">
                Connect your embedded wallet to manage strategies and track your portfolio
              </p>
              <button
                onClick={handleConnect}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-purple px-5 py-2 text-sm font-semibold text-black shadow-ov-glow/90 transition-all hover:shadow-ov-glow/70 hover:scale-[1.02]"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-ov-border/55 bg-black/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-ov-text-muted mb-1">Wallet Address</p>
                  <p className="font-mono text-sm text-ov-text">
                    {publicKey ? `${publicKey.toBase58().slice(0, 8)}...${publicKey.toBase58().slice(-8)}` : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-ov-text-muted mb-1">Balance</p>
                  <p className="text-sm font-semibold">
                    {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="rounded-full border border-ov-border/55 bg-black/70 px-4 py-2 text-xs font-medium text-ov-text-muted hover:text-white hover:border-red-400/65 hover:bg-black/90 transition-all"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Portfolio Summary */}
      {connected && portfolioSummary && (
        <div className="mb-6">
          <PortfolioSummaryCard summary={portfolioSummary} />
        </div>
      )}

      {/* Strategy Templates Section */}
      {connected && (
        <div className="mb-6 rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-tight">Strategy Templates</h2>
            <p className="text-[11px] text-ov-text-muted/90 mt-0.5">
              Select a pre-configured trading strategy template (no manual key management required)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {STRATEGY_TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => handleStrategySelect(template.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedStrategy === template.id
                    ? "border-ov-accent bg-ov-accent/10"
                    : "border-ov-border/55 bg-black/40 hover:border-ov-border/75"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{template.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      template.riskLevel === "conservative"
                        ? "bg-emerald-500/12 text-emerald-300"
                        : template.riskLevel === "moderate"
                          ? "bg-amber-500/12 text-amber-300"
                          : "bg-red-500/12 text-red-300"
                    }`}
                  >
                    {template.riskLevel}
                  </span>
                </div>
                <p className="mb-3 text-[11px] text-ov-text-muted">{template.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-ov-text-muted">
                  <div>
                    <span className="font-medium">Min Edge:</span> {(template.minEdge * 100).toFixed(0)}%
                  </div>
                  <div>
                    <span className="font-medium">Max Position:</span> {(template.maxPositionSize * 100).toFixed(0)}%
                  </div>
                  <div>
                    <span className="font-medium">Max Positions:</span> {template.maxPositions}
                  </div>
                  <div>
                    <span className="font-medium">Stop Loss:</span>{" "}
                    {template.useStopLoss ? `${(template.stopLossPercent || 0) * 100}%` : "None"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedStrategy && (
            <div className="mt-4 rounded-xl border border-ov-accent/50 bg-ov-accent/5 p-4">
              <p className="text-sm font-medium text-ov-accent mb-2">
                Selected: {getStrategyTemplate(selectedStrategy)?.name}
              </p>
              <p className="text-[11px] text-ov-text-muted">
                This strategy will be used for automated trading. Configure additional settings in the agent configuration panel.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Active Positions */}
      {connected && portfolioManager.getOpenPositions().length > 0 && (
        <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-tight">Active Positions</h2>
            <p className="text-[11px] text-ov-text-muted/90 mt-0.5">
              Your current open trading positions
            </p>
          </div>
          <div className="space-y-3">
            {portfolioManager.getOpenPositions().map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

