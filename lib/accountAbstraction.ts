import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";

/**
 * Account abstraction utilities for simplified wallet operations.
 * Provides high-level functions that abstract away low-level Solana transaction details.
 */

/**
 * Transfer SOL from one account to another.
 * @param connection - Solana RPC connection
 * @param fromPubkey - Source public key
 * @param toPubkey - Destination public key
 * @param amount - Amount in SOL (not lamports)
 * @returns Transaction object ready to be signed and sent
 */
export function createTransferTransaction(
  connection: Connection,
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amount: number
): Transaction {
  // Validate amount is a positive finite number
  if (!isFinite(amount) || amount <= 0) {
    throw new Error("Transfer amount must be a positive number");
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  return transaction;
}

/**
 * Get account balance in SOL.
 * @param connection - Solana RPC connection
 * @param pubkey - Account public key
 * @returns Balance in SOL
 */
export async function getAccountBalance(
  connection: Connection,
  pubkey: PublicKey
): Promise<number> {
  if (!connection || !pubkey) {
    throw new Error("Connection and public key are required");
  }

  try {
    const balance = await connection.getBalance(pubkey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    // Ensure we return a valid finite number
    if (!isFinite(solBalance) || solBalance < 0) {
      return 0;
    }
    
    return solBalance;
  } catch (err) {
    console.error("Failed to get account balance:", err);
    return 0;
  }
}

/**
 * Check if an account exists and has been initialized.
 * @param connection - Solana RPC connection
 * @param pubkey - Account public key
 * @returns True if account exists
 */
export async function accountExists(
  connection: Connection,
  pubkey: PublicKey
): Promise<boolean> {
  try {
    const accountInfo = await connection.getAccountInfo(pubkey);
    return accountInfo !== null;
  } catch {
    return false;
  }
}

/**
 * Request airdrop for development/testing (devnet only).
 * @param connection - Solana RPC connection
 * @param pubkey - Account public key
 * @param amount - Amount in SOL to airdrop
 * @returns Transaction signature
 */
export async function requestAirdrop(
  connection: Connection,
  pubkey: PublicKey,
  amount: number = 1
): Promise<string> {
  if (!connection || !pubkey) {
    throw new Error("Connection and public key are required");
  }

  if (!isFinite(amount) || amount <= 0) {
    throw new Error("Airdrop amount must be a positive number");
  }

  try {
    const signature = await connection.requestAirdrop(pubkey, amount * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature, "confirmed");
    return signature;
  } catch (err) {
    console.error("Failed to request airdrop:", err);
    throw err;
  }
}

/**
 * Account abstraction wrapper for common operations.
 * Simplifies wallet interactions without exposing keypair management.
 */
export class AccountAbstraction {
  constructor(
    private connection: Connection,
    private publicKey: PublicKey
  ) {}

  /**
   * Get current account balance.
   */
  async getBalance(): Promise<number> {
    return getAccountBalance(this.connection, this.publicKey);
  }

  /**
   * Check if account exists.
   */
  async exists(): Promise<boolean> {
    return accountExists(this.connection, this.publicKey);
  }

  /**
   * Create a transfer transaction to another account.
   */
  createTransfer(toPubkey: PublicKey, amount: number): Transaction {
    return createTransferTransaction(this.connection, this.publicKey, toPubkey, amount);
  }

  /**
   * Get the public key for this account.
   */
  getPublicKey(): PublicKey {
    return this.publicKey;
  }

  /**
   * Get the public key as a string.
   */
  getPublicKeyString(): string {
    return this.publicKey.toBase58();
  }
}

