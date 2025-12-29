"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

/**
 * Component for managing wallet deposits and withdrawals.
 */
export function WalletManagement() {
  const { publicKey, connected, deposit, withdraw, getBalance, isDevnet, error, getRpcUrl, setRpcUrl } = useWallet();
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawAddress, setWithdrawAddress] = useState<string>("");
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDeposit = async () => {
    if (!connected || !deposit) return;

    const amount = parseFloat(depositAmount);
    if (!isFinite(amount) || amount <= 0) {
      return;
    }

    setDepositing(true);
    setSuccessMessage(null);

    try {
      const signature = await deposit(amount);
      if (signature) {
        setSuccessMessage(`Deposit successful! Transaction: ${signature.slice(0, 8)}...`);
        setDepositAmount("");
        // Refresh balance after a short delay
        setTimeout(() => {
          getBalance();
        }, 2000);
      }
    } catch (err) {
      console.error("Deposit failed:", err);
    } finally {
      setDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!connected || !withdraw) return;

    const amount = parseFloat(withdrawAmount);
    if (!isFinite(amount) || amount <= 0) {
      return;
    }

    if (!withdrawAddress || withdrawAddress.trim().length === 0) {
      return;
    }

    setWithdrawing(true);
    setSuccessMessage(null);

    try {
      const signature = await withdraw(withdrawAddress.trim(), amount);
      if (signature) {
        setSuccessMessage(`Withdrawal successful! Transaction: ${signature.slice(0, 8)}...`);
        setWithdrawAmount("");
        setWithdrawAddress("");
        // Refresh balance after a short delay
        setTimeout(() => {
          getBalance();
        }, 2000);
      }
    } catch (err) {
      console.error("Withdraw failed:", err);
    } finally {
      setWithdrawing(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight">Wallet Management</h2>
        <p className="text-[11px] text-ov-text-muted/90 mt-0.5">
          Deposit and withdraw SOL from your wallet
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-[11px] text-red-200">
          ⚠️ {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[11px] text-emerald-200">
          ✓ {successMessage}
        </div>
      )}

      {/* RPC Settings */}
      <div className="mb-4 rounded-xl border border-ov-border/55 bg-black/40 p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[10px] text-ov-text-muted mb-1">RPC Endpoint</p>
            <p className="font-mono text-[10px] text-ov-text break-all">
              {getRpcUrl() || "Not set"}
            </p>
            {process.env.NEXT_PUBLIC_SOLANA_RPC_URL && (
              <p className="mt-1 text-[9px] text-ov-text-muted/70">
                Env var set: {process.env.NEXT_PUBLIC_SOLANA_RPC_URL.slice(0, 30)}...
              </p>
            )}
          </div>
          <button
            onClick={() => setShowRpcSettings(!showRpcSettings)}
            className="ml-3 rounded-lg border border-ov-border/55 bg-black/70 px-3 py-1.5 text-[10px] font-medium text-ov-text-muted hover:text-white hover:border-ov-accent transition-all"
          >
            {showRpcSettings ? "Hide" : "Change"}
          </button>
        </div>
        
        {showRpcSettings && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              placeholder="https://api.mainnet-beta.solana.com"
              className="w-full rounded-lg border border-ov-border/55 bg-black/70 px-3 py-2 text-sm font-mono text-ov-text placeholder:text-ov-text-muted focus:border-ov-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (customRpcUrl.trim()) {
                    setRpcUrl(customRpcUrl.trim());
                    setCustomRpcUrl("");
                    setShowRpcSettings(false);
                    setSuccessMessage("RPC URL updated! Refreshing connection...");
                    setTimeout(() => {
                      getBalance();
                      setSuccessMessage(null);
                    }, 1000);
                  }
                }}
                className="flex-1 rounded-lg border border-ov-border/55 bg-black/70 px-3 py-1.5 text-[10px] font-medium text-ov-text-muted hover:text-white hover:border-ov-accent transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("polyhub_custom_rpc_url");
                    window.location.reload();
                  }
                }}
                className="rounded-lg border border-ov-border/55 bg-black/70 px-3 py-1.5 text-[10px] font-medium text-ov-text-muted hover:text-white hover:border-red-400/65 transition-all"
              >
                Reset
              </button>
            </div>
            <p className="text-[9px] text-ov-text-muted/70">
              This will override the environment variable. Changes persist in localStorage.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Deposit Section */}
        <div className="rounded-xl border border-ov-border/55 bg-black/40 p-4">
          <h3 className="mb-3 text-xs font-semibold">Deposit SOL</h3>
          
          {isDevnet ? (
            <>
              <p className="mb-3 text-[10px] text-ov-text-muted">
                Request airdrop on devnet (for testing only)
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[10px] text-ov-text-muted">
                    Amount (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="1.0"
                    className="w-full rounded-lg border border-ov-border/55 bg-black/70 px-3 py-2 text-sm text-ov-text placeholder:text-ov-text-muted focus:border-ov-accent focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={depositing || !depositAmount || parseFloat(depositAmount) <= 0}
                  className="w-full rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-purple px-4 py-2 text-xs font-semibold text-black shadow-ov-glow/90 transition-all hover:shadow-ov-glow/70 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositing ? "Requesting..." : "Request Airdrop"}
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-ov-border/55 bg-black/70 p-4">
              <p className="mb-2 text-[10px] text-ov-text-muted">
                To deposit SOL on mainnet:
              </p>
              <ol className="ml-4 list-decimal space-y-1 text-[10px] text-ov-text-muted">
                <li>Send SOL to your wallet address</li>
                <li>Use a Solana wallet app (Phantom, Solflare, etc.)</li>
                <li>Or use a centralized exchange</li>
              </ol>
              {publicKey && (
                <div className="mt-3 rounded-lg border border-ov-border/55 bg-black/40 p-2">
                  <p className="mb-1 text-[10px] text-ov-text-muted">Your Address:</p>
                  <p className="break-all font-mono text-[10px] text-ov-text">
                    {publicKey.toBase58()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Withdraw Section */}
        <div className="rounded-xl border border-ov-border/55 bg-black/40 p-4">
          <h3 className="mb-3 text-xs font-semibold">Withdraw SOL</h3>
          <p className="mb-3 text-[10px] text-ov-text-muted">
            Send SOL to another Solana address
          </p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[10px] text-ov-text-muted">
                Recipient Address
              </label>
              <input
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="Enter Solana address"
                className="w-full rounded-lg border border-ov-border/55 bg-black/70 px-3 py-2 text-sm font-mono text-ov-text placeholder:text-ov-text-muted focus:border-ov-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-ov-text-muted">
                Amount (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.1"
                className="w-full rounded-lg border border-ov-border/55 bg-black/70 px-3 py-2 text-sm text-ov-text placeholder:text-ov-text-muted focus:border-ov-accent focus:outline-none"
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={
                withdrawing ||
                !withdrawAmount ||
                !withdrawAddress ||
                parseFloat(withdrawAmount) <= 0
              }
              className="w-full rounded-full border border-ov-border/55 bg-black/70 px-4 py-2 text-xs font-semibold text-ov-text-muted transition-all hover:border-red-400/65 hover:text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {withdrawing ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

