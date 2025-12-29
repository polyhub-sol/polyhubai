"use client";

import { WalletProvider } from "@/contexts/WalletContext";

/**
 * Client-side wrapper for WalletProvider.
 * Required because layout.tsx is a server component.
 */
export function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}

