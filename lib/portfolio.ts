/**
 * Portfolio management utilities for tracking positions, P&L, and performance.
 */

/**
 * Position status.
 */
export type PositionStatus = "open" | "closed" | "pending";

/**
 * Position type (long/short).
 */
export type PositionType = "long" | "short";

/**
 * Portfolio position.
 */
export interface Position {
  /** Unique position ID */
  id: string;
  /** Market ID */
  marketId: string;
  /** Market question */
  marketQuestion: string;
  /** Outcome being traded */
  outcome: string;
  /** Position type */
  type: PositionType;
  /** Entry price (0-1 probability) */
  entryPrice: number;
  /** Current price (0-1 probability) */
  currentPrice: number;
  /** Position size in SOL */
  size: number;
  /** Status */
  status: PositionStatus;
  /** Entry timestamp */
  entryTime: Date;
  /** Exit timestamp (if closed) */
  exitTime?: Date;
  /** Strategy template ID used */
  strategyId?: string;
  /** Realized P&L (if closed) */
  realizedPnl?: number;
  /** Unrealized P&L (if open) */
  unrealizedPnl?: number;
}

/**
 * Portfolio summary statistics.
 */
export interface PortfolioSummary {
  /** Total portfolio value in SOL */
  totalValue: number;
  /** Available balance (not in positions) */
  availableBalance: number;
  /** Total invested in open positions */
  totalInvested: number;
  /** Total realized P&L */
  totalRealizedPnl: number;
  /** Total unrealized P&L */
  totalUnrealizedPnl: number;
  /** Number of open positions */
  openPositions: number;
  /** Number of closed positions */
  closedPositions: number;
  /** Win rate (percentage) */
  winRate: number;
  /** Average return per trade */
  averageReturn: number;
}

/**
 * Portfolio manager for tracking positions and performance.
 */
export class PortfolioManager {
  private positions: Map<string, Position> = new Map();

  /**
   * Add a new position to the portfolio.
   */
  addPosition(position: Position): void {
    // Validate position data
    if (!position.id || !position.marketId || !position.outcome) {
      console.error("Invalid position: missing required fields", position);
      return;
    }

    // Validate numeric fields
    if (
      !isFinite(position.entryPrice) || position.entryPrice < 0 || position.entryPrice > 1 ||
      !isFinite(position.currentPrice) || position.currentPrice < 0 || position.currentPrice > 1 ||
      !isFinite(position.size) || position.size <= 0
    ) {
      console.error("Invalid position: invalid numeric values", position);
      return;
    }

    // Validate entryTime is a valid date
    if (!(position.entryTime instanceof Date) || isNaN(position.entryTime.getTime())) {
      console.error("Invalid position: invalid entryTime", position);
      return;
    }

    this.positions.set(position.id, position);
  }

  /**
   * Update an existing position.
   */
  updatePosition(id: string, updates: Partial<Position>): void {
    const position = this.positions.get(id);
    if (position) {
      this.positions.set(id, { ...position, ...updates });
    }
  }

  /**
   * Close a position and calculate realized P&L.
   */
  closePosition(id: string, exitPrice: number, exitTime: Date = new Date()): void {
    const position = this.positions.get(id);
    if (!position || position.status !== "open") {
      return;
    }

    // Validate exit price is a valid number
    if (!isFinite(exitPrice) || exitPrice < 0 || exitPrice > 1) {
      console.error("Invalid exit price:", exitPrice);
      return;
    }

    const pnl = this.calculatePnl(position.entryPrice, exitPrice, position.size, position.type);
    
    this.updatePosition(id, {
      status: "closed",
      exitTime,
      currentPrice: exitPrice,
      realizedPnl: pnl,
      unrealizedPnl: undefined,
    });
  }

  /**
   * Update current prices for open positions and calculate unrealized P&L.
   */
  updatePrices(priceUpdates: Record<string, number>): void {
    for (const [id, position] of this.positions.entries()) {
      if (position.status === "open" && priceUpdates[position.marketId]) {
        const currentPrice = priceUpdates[position.marketId];
        
        // Validate price is a valid number between 0 and 1 (probability)
        if (!isFinite(currentPrice) || currentPrice < 0 || currentPrice > 1) {
          console.warn(`Invalid price update for position ${id}:`, currentPrice);
          continue;
        }

        const unrealizedPnl = this.calculatePnl(
          position.entryPrice,
          currentPrice,
          position.size,
          position.type
        );

        this.updatePosition(id, {
          currentPrice,
          unrealizedPnl,
        });
      }
    }
  }

  /**
   * Calculate P&L for a position.
   */
  private calculatePnl(
    entryPrice: number,
    currentPrice: number,
    size: number,
    type: PositionType
  ): number {
    // Validate inputs are finite numbers
    if (!isFinite(entryPrice) || !isFinite(currentPrice) || !isFinite(size)) {
      return 0;
    }

    if (type === "long") {
      // Profit when price goes up
      return (currentPrice - entryPrice) * size;
    } else {
      // Profit when price goes down (short)
      return (entryPrice - currentPrice) * size;
    }
  }

  /**
   * Get all positions.
   */
  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  /**
   * Get open positions.
   */
  getOpenPositions(): Position[] {
    return this.getPositions().filter((p) => p.status === "open");
  }

  /**
   * Get closed positions.
   */
  getClosedPositions(): Position[] {
    return this.getPositions().filter((p) => p.status === "closed");
  }

  /**
   * Get position by ID.
   */
  getPosition(id: string): Position | undefined {
    return this.positions.get(id);
  }

  /**
   * Get positions by market ID.
   */
  getPositionsByMarket(marketId: string): Position[] {
    return this.getPositions().filter((p) => p.marketId === marketId);
  }

  /**
   * Calculate portfolio summary.
   */
  calculateSummary(availableBalance: number): PortfolioSummary {
    // Ensure availableBalance is a valid number
    const validBalance = isFinite(availableBalance) ? availableBalance : 0;

    const openPositions = this.getOpenPositions();
    const closedPositions = this.getClosedPositions();

    const totalInvested = openPositions.reduce((sum, p) => {
      const size = isFinite(p.size) ? p.size : 0;
      return sum + size;
    }, 0);
    const totalRealizedPnl = closedPositions.reduce(
      (sum, p) => {
        const pnl = p.realizedPnl && isFinite(p.realizedPnl) ? p.realizedPnl : 0;
        return sum + pnl;
      },
      0
    );
    const totalUnrealizedPnl = openPositions.reduce(
      (sum, p) => {
        const pnl = p.unrealizedPnl && isFinite(p.unrealizedPnl) ? p.unrealizedPnl : 0;
        return sum + pnl;
      },
      0
    );

    const totalValue = validBalance + totalInvested + totalUnrealizedPnl;

    const winningTrades = closedPositions.filter((p) => (p.realizedPnl || 0) > 0).length;
    const winRate = closedPositions.length > 0 ? (winningTrades / closedPositions.length) * 100 : 0;

    const averageReturn =
      closedPositions.length > 0 ? totalRealizedPnl / closedPositions.length : 0;

    return {
      totalValue: isFinite(totalValue) ? totalValue : 0,
      availableBalance: validBalance,
      totalInvested: isFinite(totalInvested) ? totalInvested : 0,
      totalRealizedPnl: isFinite(totalRealizedPnl) ? totalRealizedPnl : 0,
      totalUnrealizedPnl: isFinite(totalUnrealizedPnl) ? totalUnrealizedPnl : 0,
      openPositions: openPositions.length,
      closedPositions: closedPositions.length,
      winRate: isFinite(winRate) ? winRate : 0,
      averageReturn: isFinite(averageReturn) ? averageReturn : 0,
    };
  }

  /**
   * Remove a position (for cleanup).
   */
  removePosition(id: string): void {
    this.positions.delete(id);
  }

  /**
   * Clear all positions (use with caution).
   */
  clear(): void {
    this.positions.clear();
  }
}

