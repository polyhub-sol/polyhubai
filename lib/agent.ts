/**
 * Agent management types and interfaces.
 * Handles agent deployment, testing, usage, and marketplace functionality.
 */

import { StrategyTemplate } from "./strategyTemplates";

export type AgentStatus = "draft" | "testing" | "active" | "paused" | "sold" | "archived";
export type TestStatus = "pending" | "running" | "completed" | "failed";

export interface Agent {
  id: string;
  name: string;
  description: string;
  strategyTemplateId: string;
  strategyTemplate?: StrategyTemplate;
  status: AgentStatus;
  createdAt: Date;
  updatedAt: Date;
  deployedAt?: Date;
  ownerAddress: string;
  
  // Configuration
  config: {
    minEdge: number;
    maxPositionSize: number;
    maxPositions: number;
    useStopLoss: boolean;
    stopLossPercent?: number;
  };
  
  // Performance metrics
  performance: {
    totalTrades: number;
    winningTrades: number;
    totalPnl: number;
    winRate: number;
    averageReturn: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
  };
  
  // Testing data
  testResults?: {
    status: TestStatus;
    startDate: Date;
    endDate?: Date;
    testDuration?: number; // in seconds
    simulatedTrades: number;
    simulatedPnl: number;
    simulatedWinRate: number;
    errors?: string[];
  };
  
  // Marketplace data
  marketplace?: {
    listed: boolean;
    price?: number; // in SOL
    listedAt?: Date;
    buyerAddress?: string;
    soldAt?: Date;
  };
}

export interface AgentDeploymentConfig {
  name: string;
  description: string;
  strategyTemplateId: string;
  config: {
    minEdge: number;
    maxPositionSize: number;
    maxPositions: number;
    useStopLoss: boolean;
    stopLossPercent?: number;
  };
}

export interface AgentTestConfig {
  agentId: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  markets?: string[]; // Optional: test on specific markets
}

export interface AgentTestResult {
  agentId: string;
  status: TestStatus;
  startDate: Date;
  endDate: Date;
  duration: number;
  simulatedTrades: number;
  simulatedPnl: number;
  simulatedWinRate: number;
  errors: string[];
  tradeHistory: Array<{
    marketId: string;
    outcome: string;
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    timestamp: Date;
  }>;
}

/**
 * Agent Manager class for managing agent lifecycle.
 * Persists agents to localStorage for client-side storage.
 */
export class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private storageKey = "polyhub_agents";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load agents from localStorage.
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const agentsArray = JSON.parse(stored) as Agent[];
        agentsArray.forEach((agent) => {
          // Convert date strings back to Date objects
          agent.createdAt = new Date(agent.createdAt);
          agent.updatedAt = new Date(agent.updatedAt);
          if (agent.deployedAt) {
            agent.deployedAt = new Date(agent.deployedAt);
          }
          if (agent.testResults?.startDate) {
            agent.testResults.startDate = new Date(agent.testResults.startDate);
          }
          if (agent.testResults?.endDate) {
            agent.testResults.endDate = new Date(agent.testResults.endDate);
          }
          if (agent.marketplace?.listedAt) {
            agent.marketplace.listedAt = new Date(agent.marketplace.listedAt);
          }
          if (agent.marketplace?.soldAt) {
            agent.marketplace.soldAt = new Date(agent.marketplace.soldAt);
          }
          this.agents.set(agent.id, agent);
        });
      }
    } catch (err) {
      console.error("Failed to load agents from storage:", err);
    }
  }

  /**
   * Save agents to localStorage.
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const agentsArray = Array.from(this.agents.values());
      localStorage.setItem(this.storageKey, JSON.stringify(agentsArray));
    } catch (err) {
      console.error("Failed to save agents to storage:", err);
    }
  }

  /**
   * Create a new agent from a deployment config.
   */
  createAgent(config: AgentDeploymentConfig, ownerAddress: string): Agent {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const agent: Agent = {
      id,
      name: config.name,
      description: config.description,
      strategyTemplateId: config.strategyTemplateId,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerAddress,
      config: config.config,
      performance: {
        totalTrades: 0,
        winningTrades: 0,
        totalPnl: 0,
        winRate: 0,
        averageReturn: 0,
      },
    };

    this.agents.set(id, agent);
    this.saveToStorage();
    return agent;
  }

  /**
   * Get an agent by ID.
   */
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * Get all agents owned by an address.
   */
  getAgentsByOwner(ownerAddress: string): Agent[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.ownerAddress === ownerAddress
    );
  }

  /**
   * Get all agents.
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get active agents.
   */
  getActiveAgents(): Agent[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.status === "active"
    );
  }

  /**
   * Get agents listed in marketplace.
   */
  getMarketplaceAgents(): Agent[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.marketplace?.listed === true && agent.status !== "sold"
    );
  }

  /**
   * Update agent status.
   */
  updateAgentStatus(id: string, status: AgentStatus): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.status = status;
    agent.updatedAt = new Date();
    
    if (status === "active" && !agent.deployedAt) {
      agent.deployedAt = new Date();
    }

    this.saveToStorage();
    return true;
  }

  /**
   * Update agent test results.
   */
  updateTestResults(id: string, testResults: AgentTestResult): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.testResults = {
      status: testResults.status,
      startDate: testResults.startDate,
      endDate: testResults.endDate,
      testDuration: testResults.duration,
      simulatedTrades: testResults.simulatedTrades,
      simulatedPnl: testResults.simulatedPnl,
      simulatedWinRate: testResults.simulatedWinRate,
      errors: testResults.errors,
    };

    agent.updatedAt = new Date();
    this.saveToStorage();
    return true;
  }

  /**
   * Update agent performance metrics.
   */
  updatePerformance(
    id: string,
    performance: Partial<Agent["performance"]>
  ): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.performance = {
      ...agent.performance,
      ...performance,
    };

    agent.updatedAt = new Date();
    this.saveToStorage();
    return true;
  }

  /**
   * List agent in marketplace.
   */
  listAgent(id: string, price: number): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    if (agent.status === "sold") {
      return false; // Can't list a sold agent
    }

    agent.marketplace = {
      listed: true,
      price,
      listedAt: new Date(),
    };

    agent.updatedAt = new Date();
    this.saveToStorage();
    return true;
  }

  /**
   * Remove agent from marketplace.
   */
  unlistAgent(id: string): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    if (agent.marketplace) {
      agent.marketplace.listed = false;
    }

    agent.updatedAt = new Date();
    this.saveToStorage();
    return true;
  }

  /**
   * Sell agent to a buyer.
   */
  sellAgent(id: string, buyerAddress: string): boolean {
    const agent = this.agents.get(id);
    if (!agent || !agent.marketplace?.listed) return false;

    agent.marketplace.buyerAddress = buyerAddress;
    agent.marketplace.soldAt = new Date();
    agent.marketplace.listed = false;
    agent.status = "sold";
    agent.ownerAddress = buyerAddress; // Transfer ownership
    agent.updatedAt = new Date();

    this.saveToStorage();
    return true;
  }

  /**
   * Delete an agent.
   */
  deleteAgent(id: string): boolean {
    const deleted = this.agents.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }
}

