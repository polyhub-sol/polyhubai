"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { STRATEGY_TEMPLATES, getStrategyTemplate, StrategyTemplate } from "@/lib/strategyTemplates";
import { AgentManager, Agent, AgentDeploymentConfig, AgentStatus, AgentTestConfig } from "@/lib/agent";
import Link from "next/link";

/**
 * Client component for agent deployment, testing, usage, and marketplace.
 */
export function AgentsClient() {
  const { publicKey, connected, connect, error: walletError, connecting } = useWallet();
  const [agentManager] = useState(() => new AgentManager());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState<"deploy" | "my-agents" | "marketplace">("deploy");
  
  // Deployment form state
  const [deploymentConfig, setDeploymentConfig] = useState<Partial<AgentDeploymentConfig>>({
    name: "",
    description: "",
    strategyTemplateId: "",
    config: {
      minEdge: 0.05,
      maxPositionSize: 0.1,
      maxPositions: 5,
      useStopLoss: true,
      stopLossPercent: 0.1,
    },
  });
  
  // Testing state
  const [testingAgent, setTestingAgent] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState<number>(0);
  
  // Marketplace state
  const [listingPrice, setListingPrice] = useState<string>("");
  const [listingAgent, setListingAgent] = useState<string | null>(null);

  // Load agents on mount and when wallet connects
  const loadAgents = useCallback(() => {
    if (connected && publicKey) {
      // Create a new instance to reload from storage
      const manager = new AgentManager();
      const userAgents = manager.getAgentsByOwner(publicKey.toBase58());
      setAgents(userAgents);
    } else {
      setAgents([]);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // Load marketplace agents (refresh on tab change)
  const [marketplaceAgents, setMarketplaceAgents] = useState<Agent[]>([]);
  
  useEffect(() => {
    const manager = new AgentManager();
    setMarketplaceAgents(manager.getMarketplaceAgents());
  }, [activeTab]);

  const handleDeploy = useCallback(() => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    if (!deploymentConfig.name || !deploymentConfig.strategyTemplateId) {
      alert("Please fill in all required fields");
      return;
    }

    const config: AgentDeploymentConfig = {
      name: deploymentConfig.name!,
      description: deploymentConfig.description || "",
      strategyTemplateId: deploymentConfig.strategyTemplateId!,
      config: {
        minEdge: deploymentConfig.config?.minEdge || 0.05,
        maxPositionSize: deploymentConfig.config?.maxPositionSize || 0.1,
        maxPositions: deploymentConfig.config?.maxPositions || 5,
        useStopLoss: deploymentConfig.config?.useStopLoss || false,
        stopLossPercent: deploymentConfig.config?.stopLossPercent,
      },
    };

    agentManager.createAgent(config, publicKey.toBase58());
    loadAgents();
    
    // Reset form
    setDeploymentConfig({
      name: "",
      description: "",
      strategyTemplateId: "",
      config: {
        minEdge: 0.05,
        maxPositionSize: 0.1,
        maxPositions: 5,
        useStopLoss: true,
        stopLossPercent: 0.1,
      },
    });
    
    setActiveTab("my-agents");
    alert(`Agent "${agent.name}" deployed successfully!`);
  }, [connected, publicKey, deploymentConfig, agentManager]);

  const handleTest = useCallback(async (agentId: string) => {
    setTestingAgent(agentId);
    setTestProgress(0);
    
    // Simulate testing progress
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate test execution (in real implementation, this would run actual backtests)
    setTimeout(() => {
      clearInterval(interval);
      setTestProgress(100);
      
      // Simulate test results
      const agent = agentManager.getAgent(agentId);
      if (agent) {
        agentManager.updateTestResults(agentId, {
          agentId,
          status: "completed",
          startDate: new Date(Date.now() - 86400000), // 1 day ago
          endDate: new Date(),
          duration: 60,
          simulatedTrades: Math.floor(Math.random() * 50) + 10,
          simulatedPnl: (Math.random() - 0.3) * 1000,
          simulatedWinRate: Math.random() * 0.3 + 0.5,
          errors: [],
          tradeHistory: [],
        });
        
        loadAgents();
      }
      
      setTestingAgent(null);
      setTestProgress(0);
      alert("Test completed! Check the results in My Agents.");
    }, 5000);
  }, [agentManager, publicKey]);

  const handleActivate = useCallback((agentId: string) => {
    if (agentManager.updateAgentStatus(agentId, "active")) {
      loadAgents();
      alert("Agent activated!");
    }
  }, [agentManager, loadAgents]);

  const handlePause = useCallback((agentId: string) => {
    if (agentManager.updateAgentStatus(agentId, "paused")) {
      loadAgents();
      alert("Agent paused!");
    }
  }, [agentManager, loadAgents]);

  const handleList = useCallback((agentId: string) => {
    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    if (agentManager.listAgent(agentId, price)) {
      loadAgents();
      setListingPrice("");
      setListingAgent(null);
      alert("Agent listed in marketplace!");
    }
  }, [listingPrice, agentManager, loadAgents]);

  const handleBuy = useCallback((agentId: string) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const agent = agentManager.getAgent(agentId);
    if (!agent || !agent.marketplace?.listed || !agent.marketplace?.price) {
      alert("Agent not available for purchase");
      return;
    }

    if (agentManager.sellAgent(agentId, publicKey.toBase58())) {
      loadAgents();
      alert(`Agent "${agent.name}" purchased successfully!`);
    }
  }, [connected, publicKey, agentManager, loadAgents]);

  const selectedTemplate = deploymentConfig.strategyTemplateId
    ? getStrategyTemplate(deploymentConfig.strategyTemplateId)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Agent Deployment & Marketplace</h1>
        <p className="text-sm text-ov-text-muted">
          Deploy, test, activate, and sell trading agents
        </p>
      </div>

      {/* Wallet Connection */}
      {!connected ? (
        <div className="mb-6 rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
          <p className="text-sm text-ov-text-muted mb-4">
            Connect your wallet to deploy and manage agents
          </p>
          <button
            onClick={connect}
            disabled={connecting}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-purple px-5 py-2 text-sm font-semibold text-black shadow-ov-glow/90 transition-all hover:shadow-ov-glow/70 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
          {walletError && (
            <p className="mt-3 text-xs text-red-400">{walletError}</p>
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-ov-border/55">
            <button
              onClick={() => setActiveTab("deploy")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "deploy"
                  ? "border-b-2 border-ov-accent text-ov-accent"
                  : "text-ov-text-muted hover:text-ov-text"
              }`}
            >
              Deploy Agent
            </button>
            <button
              onClick={() => setActiveTab("my-agents")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "my-agents"
                  ? "border-b-2 border-ov-accent text-ov-accent"
                  : "text-ov-text-muted hover:text-ov-text"
              }`}
            >
              My Agents ({agents.length})
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "marketplace"
                  ? "border-b-2 border-ov-accent text-ov-accent"
                  : "text-ov-text-muted hover:text-ov-text"
              }`}
            >
              Marketplace ({marketplaceAgents.length})
            </button>
          </div>

          {/* Deploy Tab */}
          {activeTab === "deploy" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
                <h2 className="text-lg font-semibold mb-4">Deploy New Agent</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ov-text-muted mb-2">
                      Agent Name *
                    </label>
                    <input
                      type="text"
                      value={deploymentConfig.name || ""}
                      onChange={(e) =>
                        setDeploymentConfig({ ...deploymentConfig, name: e.target.value })
                      }
                      placeholder="My Trading Agent"
                      className="w-full rounded-lg border border-ov-border/55 bg-black/40 px-4 py-2 text-sm text-ov-text placeholder:text-ov-text-muted focus:border-ov-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ov-text-muted mb-2">
                      Description
                    </label>
                    <textarea
                      value={deploymentConfig.description || ""}
                      onChange={(e) =>
                        setDeploymentConfig({ ...deploymentConfig, description: e.target.value })
                      }
                      placeholder="Describe what this agent does..."
                      rows={3}
                      className="w-full rounded-lg border border-ov-border/55 bg-black/40 px-4 py-2 text-sm text-ov-text placeholder:text-ov-text-muted focus:border-ov-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ov-text-muted mb-2">
                      Strategy Template *
                    </label>
                    <select
                      value={deploymentConfig.strategyTemplateId || ""}
                      onChange={(e) =>
                        setDeploymentConfig({ ...deploymentConfig, strategyTemplateId: e.target.value })
                      }
                      className="w-full rounded-lg border border-ov-border/55 bg-black/40 px-4 py-2 text-sm text-ov-text focus:border-ov-accent focus:outline-none"
                    >
                      <option value="">Select a strategy template...</option>
                      {STRATEGY_TEMPLATES.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.riskLevel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTemplate && (
                    <div className="rounded-xl border border-ov-border/55 bg-black/40 p-4">
                      <h3 className="text-sm font-semibold mb-2">{selectedTemplate.name}</h3>
                      <p className="text-xs text-ov-text-muted mb-3">{selectedTemplate.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-ov-text-muted">Risk Level:</span>{" "}
                          <span className="text-ov-text capitalize">{selectedTemplate.riskLevel}</span>
                        </div>
                        <div>
                          <span className="text-ov-text-muted">Min Edge:</span>{" "}
                          <span className="text-ov-text">{(selectedTemplate.minEdge * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-ov-text-muted">Max Position Size:</span>{" "}
                          <span className="text-ov-text">{(selectedTemplate.maxPositionSize * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-ov-text-muted">Max Positions:</span>{" "}
                          <span className="text-ov-text">{selectedTemplate.maxPositions}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ov-text-muted mb-2">
                        Min Edge (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={deploymentConfig.config?.minEdge || 0.05}
                        onChange={(e) =>
                          setDeploymentConfig({
                            ...deploymentConfig,
                            config: {
                              ...deploymentConfig.config!,
                              minEdge: parseFloat(e.target.value) || 0.05,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-ov-border/55 bg-black/40 px-4 py-2 text-sm text-ov-text focus:border-ov-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ov-text-muted mb-2">
                        Max Position Size (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={deploymentConfig.config?.maxPositionSize || 0.1}
                        onChange={(e) =>
                          setDeploymentConfig({
                            ...deploymentConfig,
                            config: {
                              ...deploymentConfig.config!,
                              maxPositionSize: parseFloat(e.target.value) || 0.1,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-ov-border/55 bg-black/40 px-4 py-2 text-sm text-ov-text focus:border-ov-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleDeploy}
                    className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-purple px-5 py-2 text-sm font-semibold text-black shadow-ov-glow/90 transition-all hover:shadow-ov-glow/70 hover:scale-[1.02]"
                  >
                    Deploy Agent
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* My Agents Tab */}
          {activeTab === "my-agents" && (
            <div className="space-y-4">
              {agents.length === 0 ? (
                <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 text-center">
                  <p className="text-sm text-ov-text-muted">No agents deployed yet. Deploy your first agent!</p>
                </div>
              ) : (
                agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onTest={handleTest}
                    onActivate={handleActivate}
                    onPause={handlePause}
                    onList={handleList}
                    testingAgent={testingAgent}
                    testProgress={testProgress}
                    listingAgent={listingAgent}
                    listingPrice={listingPrice}
                    onSetListingAgent={setListingAgent}
                    onSetListingPrice={setListingPrice}
                  />
                ))
              )}
            </div>
          )}

          {/* Marketplace Tab */}
          {activeTab === "marketplace" && (
            <div className="space-y-4">
              {marketplaceAgents.length === 0 ? (
                <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 text-center">
                  <p className="text-sm text-ov-text-muted">No agents available in marketplace</p>
                </div>
              ) : (
                marketplaceAgents.map((agent) => (
                  <MarketplaceAgentCard
                    key={agent.id}
                    agent={agent}
                    onBuy={handleBuy}
                    isOwner={connected && publicKey?.toBase58() === agent.ownerAddress}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Agent card component for displaying agent details and actions.
 */
function AgentCard({
  agent,
  onTest,
  onActivate,
  onPause,
  onList,
  testingAgent,
  testProgress,
  listingAgent,
  listingPrice,
  onSetListingAgent,
  onSetListingPrice,
}: {
  agent: Agent;
  onTest: (id: string) => void;
  onActivate: (id: string) => void;
  onPause: (id: string) => void;
  onList: (id: string) => void;
  testingAgent: string | null;
  testProgress: number;
  listingAgent: string | null;
  listingPrice: string;
  onSetListingAgent: (id: string | null) => void;
  onSetListingPrice: (price: string) => void;
}) {
  const isTesting = testingAgent === agent.id;
  const isListing = listingAgent === agent.id;

  return (
    <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
          <p className="text-xs text-ov-text-muted mb-2">{agent.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className={`px-2 py-1 rounded-full ${
              agent.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
              agent.status === "testing" ? "bg-blue-500/20 text-blue-400" :
              agent.status === "paused" ? "bg-amber-500/20 text-amber-400" :
              "bg-ov-border/20 text-ov-text-muted"
            }`}>
              {agent.status}
            </span>
            <span className="text-ov-text-muted">
              Created: {new Date(agent.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {agent.testResults && agent.testResults.status === "completed" && (
        <div className="mb-4 rounded-xl border border-ov-border/55 bg-black/40 p-4">
          <h4 className="text-xs font-semibold mb-2">Test Results</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-ov-text-muted">Trades:</span>{" "}
              <span className="text-ov-text">{agent.testResults.simulatedTrades}</span>
            </div>
            <div>
              <span className="text-ov-text-muted">P&L:</span>{" "}
              <span className={agent.testResults.simulatedPnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                {agent.testResults.simulatedPnl >= 0 ? "+" : ""}
                {agent.testResults.simulatedPnl.toFixed(2)} SOL
              </span>
            </div>
            <div>
              <span className="text-ov-text-muted">Win Rate:</span>{" "}
              <span className="text-ov-text">{(agent.testResults.simulatedWinRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {agent.status === "draft" && (
          <>
            <button
              onClick={() => onTest(agent.id)}
              disabled={isTesting}
              className="rounded-lg border border-ov-border/55 bg-black/70 px-4 py-2 text-xs font-medium text-ov-text hover:border-ov-accent hover:text-white transition-all disabled:opacity-50"
            >
              {isTesting ? `Testing... ${testProgress}%` : "Test Agent"}
            </button>
            {agent.testResults?.status === "completed" && (
              <button
                onClick={() => onActivate(agent.id)}
                className="rounded-lg border border-emerald-500/55 bg-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition-all"
              >
                Activate
              </button>
            )}
          </>
        )}
        {agent.status === "active" && (
          <button
            onClick={() => onPause(agent.id)}
            className="rounded-lg border border-amber-500/55 bg-amber-500/20 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/30 transition-all"
          >
            Pause
          </button>
        )}
        {agent.status === "paused" && (
          <button
            onClick={() => onActivate(agent.id)}
            className="rounded-lg border border-emerald-500/55 bg-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition-all"
          >
            Resume
          </button>
        )}
        {!agent.marketplace?.listed && agent.status !== "sold" && (
          <>
            {!isListing ? (
              <button
                onClick={() => onSetListingAgent(agent.id)}
                className="rounded-lg border border-ov-border/55 bg-black/70 px-4 py-2 text-xs font-medium text-ov-text hover:border-ov-accent hover:text-white transition-all"
              >
                List for Sale
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={listingPrice}
                  onChange={(e) => onSetListingPrice(e.target.value)}
                  placeholder="Price in SOL"
                  className="rounded-lg border border-ov-border/55 bg-black/70 px-3 py-2 text-xs text-ov-text focus:border-ov-accent focus:outline-none w-24"
                />
                <button
                  onClick={() => onList(agent.id)}
                  className="rounded-lg border border-ov-accent/55 bg-ov-accent/20 px-4 py-2 text-xs font-medium text-ov-accent hover:bg-ov-accent/30 transition-all"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    onSetListingAgent(null);
                    onSetListingPrice("");
                  }}
                  className="rounded-lg border border-ov-border/55 bg-black/70 px-4 py-2 text-xs font-medium text-ov-text hover:border-ov-accent hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Marketplace agent card component.
 */
function MarketplaceAgentCard({
  agent,
  onBuy,
  isOwner,
}: {
  agent: Agent;
  onBuy: (id: string) => void;
  isOwner: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
          <p className="text-xs text-ov-text-muted mb-2">{agent.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-ov-text-muted">
              Owner: {agent.ownerAddress.slice(0, 8)}...{agent.ownerAddress.slice(-6)}
            </span>
            {agent.testResults && (
              <span className="text-ov-text-muted">
                Win Rate: {(agent.testResults.simulatedWinRate * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-ov-accent">
            {agent.marketplace?.price?.toFixed(2)} SOL
          </p>
        </div>
      </div>

      {!isOwner && (
        <button
          onClick={() => onBuy(agent.id)}
          className="w-full rounded-lg border border-ov-accent/55 bg-ov-accent/20 px-4 py-2 text-sm font-medium text-ov-accent hover:bg-ov-accent/30 transition-all"
        >
          Buy Agent
        </button>
      )}
    </div>
  );
}

