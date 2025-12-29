import { StrategyTemplate, TriggerCondition } from "./strategyTemplates";

/**
 * Market analysis data for strategy evaluation.
 */
export interface MarketAnalysis {
  /** Market ID */
  marketId: string;
  /** AI probability for each outcome */
  aiProbabilities: Record<string, number>;
  /** Market probability for each outcome */
  marketProbabilities: Record<string, number>;
  /** Calculated edge for each outcome (AI - Market) */
  edges: Record<string, number>;
  /** Current trading volume */
  volume: number;
  /** Market end date */
  endDate: Date;
}

/**
 * Strategy execution decision.
 */
export interface StrategyDecision {
  /** Whether to execute the trade */
  shouldExecute: boolean;
  /** Recommended outcome to trade */
  outcome?: string;
  /** Recommended position size (as percentage of portfolio) */
  positionSize?: number;
  /** Reason for the decision */
  reason: string;
  /** Calculated edge for the recommended outcome */
  edge?: number;
}

/**
 * Strategy engine that evaluates market conditions against strategy templates.
 */
export class StrategyEngine {
  /**
   * Evaluate a market against a strategy template.
   */
  static evaluate(
    market: MarketAnalysis,
    template: StrategyTemplate
  ): StrategyDecision {
    // Check if edges object is empty
    if (!market.edges || Object.keys(market.edges).length === 0) {
      return {
        shouldExecute: false,
        reason: "No edge data available for this market",
      };
    }

    // Find the outcome with the highest edge
    const bestOutcome = Object.entries(market.edges).reduce(
      (best, [outcome, edge]) => {
        return edge > best.edge ? { outcome, edge } : best;
      },
      { outcome: "", edge: -Infinity }
    );

    // Check if we found a valid outcome
    if (!bestOutcome.outcome || !isFinite(bestOutcome.edge) || bestOutcome.edge === -Infinity) {
      return {
        shouldExecute: false,
        reason: "No valid edge found for any outcome",
      };
    }

    // Check if edge meets minimum requirement
    if (bestOutcome.edge < template.minEdge) {
      return {
        shouldExecute: false,
        reason: `Edge (${(bestOutcome.edge * 100).toFixed(1)}%) below minimum required (${(template.minEdge * 100).toFixed(1)}%)`,
      };
    }

    // Check trigger conditions
    if (!this.checkTriggerCondition(market, template.triggerCondition)) {
      return {
        shouldExecute: false,
        reason: `Trigger condition not met: ${template.triggerCondition}`,
      };
    }

    // Calculate position size based on edge and risk level
    const positionSize = this.calculatePositionSize(bestOutcome.edge, template);

    return {
      shouldExecute: true,
      outcome: bestOutcome.outcome,
      positionSize,
      edge: bestOutcome.edge,
      reason: `Strong edge detected: ${(bestOutcome.edge * 100).toFixed(1)}% on ${bestOutcome.outcome}`,
    };
  }

  /**
   * Check if trigger condition is met.
   */
  private static checkTriggerCondition(
    market: MarketAnalysis,
    condition: TriggerCondition
  ): boolean {
    switch (condition) {
      case "ai_edge":
        // Always true if we got here (edge already checked)
        return true;

      case "market_mispricing":
        // Check if there's significant mispricing
        const edgeValues = Object.values(market.edges).filter((e) => isFinite(e));
        if (edgeValues.length === 0) return false;
        const maxEdge = Math.max(...edgeValues);
        return maxEdge > 0.05;

      case "volume_spike":
        // In a real implementation, compare against historical volume
        // For now, just check if volume is above a threshold
        return isFinite(market.volume) && market.volume > 10000;

      case "time_based":
        // Check if market is within a certain time window
        if (!market.endDate || !(market.endDate instanceof Date) || isNaN(market.endDate.getTime())) {
          return false;
        }
        const daysUntilEnd = (market.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return isFinite(daysUntilEnd) && daysUntilEnd > 1 && daysUntilEnd < 30;

      default:
        return false;
    }
  }

  /**
   * Calculate position size based on edge and risk parameters.
   */
  private static calculatePositionSize(
    edge: number,
    template: StrategyTemplate
  ): number {
    // Validate inputs
    if (!isFinite(edge) || !isFinite(template.maxPositionSize) || !isFinite(template.minEdge) || template.minEdge <= 0) {
      return 0;
    }

    // Base position size from template
    let positionSize = template.maxPositionSize;

    // Adjust based on edge strength (stronger edge = larger position, up to max)
    const edgeMultiplier = Math.min(edge / template.minEdge, 1.5);
    positionSize = positionSize * edgeMultiplier;

    // Adjust based on risk level
    const riskMultiplier = {
      conservative: 0.8,
      moderate: 1.0,
      aggressive: 1.2,
    }[template.riskLevel];

    positionSize = positionSize * riskMultiplier;

    // Cap at max position size and ensure it's a valid number
    const finalSize = Math.min(Math.max(0, positionSize), template.maxPositionSize);
    return isFinite(finalSize) ? finalSize : 0;
  }

  /**
   * Check if a new position would exceed max positions limit.
   */
  static canOpenNewPosition(
    currentPositions: number,
    template: StrategyTemplate
  ): boolean {
    return currentPositions < template.maxPositions;
  }

  /**
   * Check if stop loss should be triggered.
   */
  static checkStopLoss(
    entryPrice: number,
    currentPrice: number,
    template: StrategyTemplate
  ): boolean {
    if (!template.useStopLoss || !template.stopLossPercent) {
      return false;
    }

    // Validate inputs and prevent division by zero
    if (!isFinite(entryPrice) || !isFinite(currentPrice) || entryPrice === 0) {
      return false;
    }

    const lossPercent = Math.abs((currentPrice - entryPrice) / entryPrice);
    return isFinite(lossPercent) && lossPercent >= template.stopLossPercent;
  }
}

