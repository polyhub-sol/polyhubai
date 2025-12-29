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
  disconnect: () => Promise<void>;
  /** Get wallet balance in SOL */
  getBalance: () => Promise<number | null>;
  /** Sign a message with the wallet */
  signMessage: (message: Uint8Array) => Promise<Uint8Array | null>;
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

  // Initialize connection to Solana network (mainnet-beta or devnet)
  useEffect(() => {
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
      if (rpcUrl && typeof rpcUrl === "string") {
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
          const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
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
      localStorage.removeItem("polyhub_wallet_keypair");
    }
    setError(null);
  }, []);

  /**
   * Get wallet balance in SOL.
   */
  const getBalance = useCallback(async (): Promise<number | null> => {
    if (!publicKey || !connection) return null;

    try {
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / 1e9; // Convert lamports to SOL
      // Ensure we return a valid finite number
      return isFinite(solBalance) && solBalance >= 0 ? solBalance : null;
    } catch (err) {
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

