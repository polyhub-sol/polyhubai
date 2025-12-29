/**
 * Strategy templates for automated trading without manual key management.
 * Templates define trading rules and risk parameters that can be applied to markets.
 */

/**
 * Risk level for strategy execution.
 */
export type RiskLevel = "conservative" | "moderate" | "aggressive";

/**
 * Strategy trigger condition.
 */
export type TriggerCondition = "ai_edge" | "market_mispricing" | "volume_spike" | "time_based";

/**
 * Base strategy template configuration.
 */
export interface StrategyTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Display name */
  name: string;
  /** Description of what the strategy does */
  description: string;
  /** Risk level */
  riskLevel: RiskLevel;
  /** Minimum AI edge required (as percentage, e.g., 0.05 = 5%) */
  minEdge: number;
  /** Maximum position size as percentage of portfolio */
  maxPositionSize: number;
  /** Trigger condition for executing trades */
  triggerCondition: TriggerCondition;
  /** Whether to use stop-loss */
  useStopLoss: boolean;
  /** Stop-loss percentage (if enabled) */
  stopLossPercent?: number;
  /** Maximum number of concurrent positions */
  maxPositions: number;
}

/**
 * Predefined strategy templates that users can select.
 */
export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: "conservative-ai-edge",
    name: "Conservative AI Edge",
    description: "Only trade when AI shows a strong edge (>10%) over market odds. Low risk, high confidence trades.",
    riskLevel: "conservative",
    minEdge: 0.10,
    maxPositionSize: 0.05, // 5% of portfolio
    triggerCondition: "ai_edge",
    useStopLoss: true,
    stopLossPercent: 0.15, // 15% stop loss
    maxPositions: 3,
  },
  {
    id: "moderate-mispricing",
    name: "Moderate Mispricing",
    description: "Capture moderate mispricing opportunities with 5-10% AI edge. Balanced risk/reward.",
    riskLevel: "moderate",
    minEdge: 0.05,
    maxPositionSize: 0.10, // 10% of portfolio
    triggerCondition: "market_mispricing",
    useStopLoss: true,
    stopLossPercent: 0.20, // 20% stop loss
    maxPositions: 5,
  },
  {
    id: "aggressive-volume",
    name: "Aggressive Volume Play",
    description: "High-risk strategy targeting volume spikes with 3%+ edge. Larger positions, higher volatility.",
    riskLevel: "aggressive",
    minEdge: 0.03,
    maxPositionSize: 0.20, // 20% of portfolio
    triggerCondition: "volume_spike",
    useStopLoss: false,
    maxPositions: 10,
  },
  {
    id: "time-based-dca",
    name: "Time-Based DCA",
    description: "Dollar-cost averaging approach with time-based triggers. Spreads risk over time.",
    riskLevel: "moderate",
    minEdge: 0.04,
    maxPositionSize: 0.08, // 8% of portfolio
    triggerCondition: "time_based",
    useStopLoss: true,
    stopLossPercent: 0.18,
    maxPositions: 7,
  },
];

/**
 * Get a strategy template by ID.
 */
export function getStrategyTemplate(id: string): StrategyTemplate | undefined {
  return STRATEGY_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get all strategy templates filtered by risk level.
 */
export function getStrategyTemplatesByRisk(riskLevel: RiskLevel): StrategyTemplate[] {
  return STRATEGY_TEMPLATES.filter((template) => template.riskLevel === riskLevel);
}

/**
 * Validate strategy template configuration.
 */
export function validateStrategyTemplate(template: Partial<StrategyTemplate>): string[] {
  const errors: string[] = [];

  if (!template.name || template.name.trim().length === 0) {
    errors.push("Strategy name is required");
  }

  if (template.minEdge !== undefined && (template.minEdge < 0 || template.minEdge > 1)) {
    errors.push("Minimum edge must be between 0 and 1 (0% to 100%)");
  }

  if (template.maxPositionSize !== undefined && (template.maxPositionSize < 0 || template.maxPositionSize > 1)) {
    errors.push("Max position size must be between 0 and 1 (0% to 100%)");
  }

  if (template.useStopLoss && template.stopLossPercent !== undefined) {
    if (template.stopLossPercent < 0 || template.stopLossPercent > 1) {
      errors.push("Stop loss percentage must be between 0 and 1 (0% to 100%)");
    }
  }

  if (template.maxPositions !== undefined && template.maxPositions < 1) {
    errors.push("Max positions must be at least 1");
  }

  return errors;
}

/**
 * Create a custom strategy template.
 */
export function createCustomStrategyTemplate(
  name: string,
  description: string,
  config: Omit<StrategyTemplate, "id" | "name" | "description">
): StrategyTemplate {
  const id = `custom-${Date.now()}`;
  return {
    id,
    name,
    description,
    ...config,
  };
}

