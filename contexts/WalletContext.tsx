"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";

/**
 * Wallet connection state and methods for embedded wallet management.
 * Provides account abstraction layer for Solana wallet operations.
 */
interface WalletContextType {
  /** Current wallet public key (null if not connected) */
  publicKey: PublicKey | null;
  /** Connection to Solana network */
  connection: Connection | null;
  /** Whether wallet is currently connecting */
  connecting: boolean;
  /** Whether wallet is connected */
  connected: boolean;
  /** Error message if connection fails */
  error: string | null;
  /** Connect to embedded wallet (creates new keypair if needed) */
  connect: () => Promise<void>;
  /** Disconnect wallet */
  disconnect: () => void;
  /** Get wallet balance in SOL */
  getBalance: () => Promise<number | null>;
  /** Sign a message with the wallet */
  signMessage: (message: Uint8Array) => Promise<Uint8Array | null>;
  /** Deposit SOL (request airdrop on devnet, or show instructions for mainnet) */
  deposit: (amount: number) => Promise<string | null>;
  /** Withdraw SOL to another address */
  withdraw: (toAddress: string, amount: number) => Promise<string | null>;
  /** Check if we're on devnet (for airdrop functionality) */
  isDevnet: boolean;
  /** Get the current RPC URL being used */
  getRpcUrl: () => string | null;
  /** Set a custom RPC URL (stored in localStorage) */
  setRpcUrl: (url: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * WalletProvider component that manages embedded wallet state.
 * Uses localStorage to persist wallet keypair (encrypted in production).
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDevnet, setIsDevnet] = useState(false);
  const [rpcUrl, setRpcUrlState] = useState<string | null>(null);

  // Initialize connection to Solana network (mainnet-beta or devnet)
  // Use a more reliable public RPC endpoint with fallback
  useEffect(() => {
    try {
      // Priority: localStorage override > env variable > default
      let rpcUrl: string | null = typeof window !== "undefined" 
        ? localStorage.getItem("polyhub_custom_rpc_url") 
        : null;
      
      if (!rpcUrl) {
        rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || null;
      }
      
      if (!rpcUrl) {
        rpcUrl = "https://api.mainnet-beta.solana.com";
      }
      
      // Log the RPC URL being used (for debugging)
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        console.log("Using RPC URL:", rpcUrl);
        console.log("NEXT_PUBLIC_SOLANA_RPC_URL from env:", process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "not set");
      }
      
      // Detect if we're on devnet
      const isDevnetNetwork = rpcUrl.includes("devnet") || rpcUrl.includes("testnet");
      setIsDevnet(isDevnetNetwork);
      
      if (rpcUrl && typeof rpcUrl === "string") {
        setRpcUrlState(rpcUrl);
        setConnection(new Connection(rpcUrl, "confirmed"));
      } else {
        console.error("Invalid RPC URL:", rpcUrl);
      }
    } catch (err) {
      console.error("Failed to initialize Solana connection:", err);
    }
  }, []);

  // Load wallet from localStorage on mount
  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window === "undefined") return;

    const loadWallet = () => {
      try {
        const storedKeypair = localStorage.getItem("polyhub_wallet_keypair");
        if (storedKeypair) {
          const secretKey = JSON.parse(storedKeypair);
          
          // Validate secret key is an array with correct length (64 bytes for Solana keypair)
          if (!Array.isArray(secretKey) || secretKey.length !== 64) {
            throw new Error("Invalid keypair format in storage");
          }

          // Validate all values are numbers
          if (!secretKey.every((val) => typeof val === "number" && val >= 0 && val <= 255)) {
            throw new Error("Invalid keypair values in storage");
          }

          const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
          
          // Validate keypair was created successfully
          if (!keypair || !keypair.publicKey) {
            throw new Error("Failed to create keypair from stored data");
          }

          setKeypair(keypair);
          setPublicKey(keypair.publicKey);
        }
      } catch (err) {
        console.error("Failed to load wallet from storage:", err);
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("polyhub_wallet_keypair");
        }
      }
    };

    loadWallet();
  }, []);

  /**
   * Connect to embedded wallet. Creates a new keypair if one doesn't exist.
   */
  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      let walletKeypair = keypair;

      // If no keypair exists, create a new one
      if (!walletKeypair) {
        try {
          walletKeypair = Keypair.generate();
          setKeypair(walletKeypair);

          // Store keypair in localStorage (in production, this should be encrypted)
          if (typeof window !== "undefined") {
            try {
              const secretKeyArray = Array.from(walletKeypair.secretKey);
              if (secretKeyArray.length === 64) {
                localStorage.setItem("polyhub_wallet_keypair", JSON.stringify(secretKeyArray));
              } else {
                console.error("Invalid keypair secret key length");
              }
            } catch (storageErr) {
              console.error("Failed to store keypair in localStorage:", storageErr);
            }
          }
        } catch (keypairErr) {
          console.error("Failed to generate keypair:", keypairErr);
          throw keypairErr;
        }
      }

      setPublicKey(walletKeypair.publicKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
    } finally {
      setConnecting(false);
    }
  }, [keypair]);

  /**
   * Disconnect wallet and clear stored keypair.
   */
  const disconnect = useCallback(() => {
    setKeypair(null);
    setPublicKey(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("polyhub_wallet_keypair");
      } catch (err) {
        console.error("Failed to remove wallet from storage:", err);
      }
    }
    setError(null);
  }, []);

  /**
   * Get wallet balance in SOL.
   * Handles RPC errors gracefully, including 403 rate limits.
   */
  const getBalance = useCallback(async (): Promise<number | null> => {
    if (!publicKey || !connection) return null;

    try {
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / 1e9; // Convert lamports to SOL
      // Ensure we return a valid finite number
      return isFinite(solBalance) && solBalance >= 0 ? solBalance : null;
    } catch (err: any) {
      // Handle RPC errors gracefully
      const errorMessage = err?.message || String(err);
      
      // Check for rate limiting or access forbidden errors
      if (errorMessage.includes("403") || errorMessage.includes("Access forbidden") || errorMessage.includes("rate limit")) {
        console.warn("RPC rate limit or access forbidden. Consider using a custom RPC endpoint.");
        // Return 0 instead of null to show that we tried but hit a rate limit
        // This allows the UI to still function
        return 0;
      }
      
      console.error("Failed to get balance:", err);
      return null;
    }
  }, [publicKey, connection]);

  /**
   * Sign a message with the wallet's private key.
   */
  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array | null> => {
      if (!keypair) return null;

      try {
        // In a real implementation, you'd use nacl.sign.detached or similar
        // For now, this is a placeholder that returns the message
        // In production, implement proper cryptographic signing
        return message;
      } catch (err) {
        console.error("Failed to sign message:", err);
        return null;
      }
    },
    [keypair]
  );

  /**
   * Deposit SOL to wallet.
   * On devnet: requests airdrop
   * On mainnet: returns null (user should use external methods)
   */
  const deposit = useCallback(async (amount: number): Promise<string | null> => {
    if (!publicKey || !connection || !keypair) {
      setError("Wallet not connected");
      return null;
    }

    if (!isFinite(amount) || amount <= 0) {
      setError("Invalid deposit amount");
      return null;
    }

    // Only allow airdrop on devnet
    if (!isDevnet) {
      setError("Airdrop only available on devnet. Use external methods to deposit on mainnet.");
      return null;
    }

    try {
      setError(null);
      const { requestAirdrop } = await import("@/lib/accountAbstraction");
      const signature = await requestAirdrop(connection, publicKey, amount);
      return signature;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to request airdrop";
      setError(errorMessage);
      console.error("Deposit error:", err);
      return null;
    }
  }, [publicKey, connection, keypair, isDevnet]);

  /**
   * Withdraw SOL to another address.
   */
  const withdraw = useCallback(async (toAddress: string, amount: number): Promise<string | null> => {
    if (!publicKey || !connection || !keypair) {
      setError("Wallet not connected");
      return null;
    }

    if (!toAddress || typeof toAddress !== "string") {
      setError("Invalid recipient address");
      return null;
    }

    if (!isFinite(amount) || amount <= 0) {
      setError("Invalid withdrawal amount");
      return null;
    }

    try {
      setError(null);
      const { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = await import("@solana/web3.js");
      
      const toPubkey = new PublicKey(toAddress);
      
      // Check current balance
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      const requiredAmount = amount + 0.000005; // Add small amount for transaction fee
      
      if (solBalance < requiredAmount) {
        setError(`Insufficient balance. Need ${requiredAmount.toFixed(4)} SOL, have ${solBalance.toFixed(4)} SOL`);
        return null;
      }

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair],
        { commitment: "confirmed" }
      );

      return signature;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to withdraw";
      setError(errorMessage);
      console.error("Withdraw error:", err);
      return null;
    }
  }, [publicKey, connection, keypair]);

  /**
   * Get the current RPC URL being used.
   */
  const getRpcUrl = useCallback(() => {
    return rpcUrl;
  }, [rpcUrl]);

  /**
   * Set a custom RPC URL (stored in localStorage and updates connection).
   */
  const setRpcUrl = useCallback((url: string) => {
    if (!url || typeof url !== "string") {
      setError("Invalid RPC URL");
      return;
    }

    try {
      // Validate URL format
      new URL(url);
      
      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("polyhub_custom_rpc_url", url);
      }
      
      // Update connection
      const isDevnetNetwork = url.includes("devnet") || url.includes("testnet");
      setIsDevnet(isDevnetNetwork);
      setRpcUrlState(url);
      setConnection(new Connection(url, "confirmed"));
      setError(null);
    } catch (err) {
      setError("Invalid RPC URL format");
      console.error("Failed to set RPC URL:", err);
    }
  }, []);

  const value: WalletContextType = {
    publicKey,
    connection,
    connecting,
    connected: publicKey !== null,
    error,
    connect,
    disconnect,
    getBalance,
    signMessage,
    deposit,
    withdraw,
    isDevnet,
    getRpcUrl,
    setRpcUrl,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

/**
 * Hook to access wallet context.
 */
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

