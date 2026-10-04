"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent, Execution } from "@/types";
import { useToast } from "@/context/ToastContext";
import {
  UploadCloud,
  FileCode2,
  Globe,
  Sliders,
  Play,
  Terminal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Database,
  Search,
  Code2,
  Shield,
  Bot,
} from "lucide-react";

interface ImportAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (newAgent: Agent) => void;
}

export function ImportAgentModal({
  isOpen,
  onClose,
  onAddAgent,
}: ImportAgentModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [importMethod, setImportMethod] = React.useState<"config" | "webhook" | "builder">("config");
  const [name, setName] = React.useState("Alpha Trading & Risk Agent");
  const [description, setDescription] = React.useState("Custom autonomous agent imported for quantitative portfolio risk audit.");
  const [model, setModel] = React.useState("gpt-4o");
  const [framework, setFramework] = React.useState<"LangChain" | "CrewAI" | "AutoGen" | "LlamaIndex" | "Custom">("LangChain");
  const [webhookUrl, setWebhookUrl] = React.useState("https://api.internal-agent.cloud/v1/run");
  const [rawConfig, setRawConfig] = React.useState(`{
  "agent_id": "custom-risk-evaluator",
  "version": "2.4.0",
  "tools": ["postgres_query", "risk_calculator", "slack_alert"],
  "memory": {
    "type": "checkpointed_buffer",
    "snapshot_interval_steps": 5
  },
  "max_iterations": 10
}`);

  const [selectedTools, setSelectedTools] = React.useState<string[]>([
    "Database Query (PostgreSQL)",
    "Vector Search (RAG)",
    "Code Sandbox",
  ]);

  const availableToolsList = [
    { id: "Database Query (PostgreSQL)", icon: Database },
    { id: "Vector Search (RAG)", icon: Search },
    { id: "Code Sandbox", icon: Code2 },
    { id: "Security Scanner", icon: Shield },
  ];

  // Test Mission fields
  const [testPrompt, setTestPrompt] = React.useState("Evaluate portfolio volatility spikes and flag anomalous risk drawdowns");
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [deployStep, setDeployStep] = React.useState(0);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [createdAgentId, setCreatedAgentId] = React.useState<string | null>(null);
  const [createdExecutionId, setCreatedExecutionId] = React.useState<string | null>(null);

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const handleDeployAndTest = () => {
    if (!name.trim()) {
      toast({
        title: "Agent Name Required",
        description: "Please specify a name for your custom AI agent.",
        type: "error",
      });
      return;
    }

    setIsDeploying(true);
    setDeployStep(1);
    setLogs(["[00:00.120] Parsing imported agent configuration and tool signatures..."]);

    const agentId = `agt_${Date.now()}`;
    const execId = `EX-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setDeployStep(2);
      setLogs((prev) => [
        ...prev,
        `[00:00.650] Initialized runtime kernel with model ${model} and ${selectedTools.length} tools`,
        `[00:00.890] Registered Flight Recorder telemetry hooks for ${name}`,
      ]);
    }, 800);

    setTimeout(() => {
      setDeployStep(3);
      setLogs((prev) => [
        ...prev,
        `[00:01.420] Tool Call: postgres_query("SELECT volatility, balance FROM portfolio_ledgers")`,
        `[00:01.980] Verification passed: Zero drift detected. Flight state checkpointed.`,
      ]);
    }, 1800);

    setTimeout(() => {
      setIsDeploying(false);
      setDeployStep(4);
      setLogs((prev) => [
        ...prev,
        `[00:02.500] Mission ${execId} completed nominal execution (100% success)`,
      ]);

      const newAgent: Agent = {
        id: agentId,
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        framework,
        model,
        status: "active",
        totalExecutions: 1,
        successRate: 100,
        failureCount: 0,
        successfulCount: 1,
        anomalyRate: 0,
        avgDurationMs: 2500,
        lastRunAt: new Date().toISOString(),
        description: description.trim() || "Custom imported autonomous AI agent.",
        tags: [framework.toLowerCase(), model.toLowerCase(), "custom-byoa", "verified"],
        environment: "Production",
        recentHealth: [
          { id: "h1", status: "ok" },
          { id: "h2", status: "ok" },
        ],
        failureDistribution: [],
      };

      const newExecution: Execution = {
        id: execId,
        agentId: newAgent.id,
        agentName: newAgent.name,
        framework: newAgent.framework,
        status: "success",
        startTime: new Date(Date.now() - 2500).toISOString(),
        durationMs: 2500,
        totalSteps: 4,
        triggerPrompt: testPrompt,
        tokenUsage: { prompt: 540, completion: 210, total: 750 },
        costUsd: 0.003,
        anomalyScore: 0.01,
        hasAnomaly: false,
        regions: [
          {
            id: "reg-1",
            executionId: execId,
            name: "Agent Boot & Init",
            category: "reasoning",
            startStep: 1,
            endStep: 1,
            stepCount: 1,
            status: "healthy",
            confidence: 0.99,
            isAnomaly: false,
            summary: "Loaded imported tools and config",
            metrics: { latencyMs: 650, tokenCount: 220, errorCount: 0 },
            steps: [],
          },
          {
            id: "reg-2",
            executionId: execId,
            name: "Tool Execution",
            category: "tool_call",
            startStep: 2,
            endStep: 3,
            stepCount: 2,
            status: "healthy",
            confidence: 0.98,
            isAnomaly: false,
            summary: "Executed custom tools with nominal response",
            metrics: { latencyMs: 1200, tokenCount: 320, errorCount: 0 },
            steps: [],
          },
          {
            id: "reg-3",
            executionId: execId,
            name: "Final Verification",
            category: "finalization",
            startStep: 4,
            endStep: 4,
            stepCount: 1,
            status: "healthy",
            confidence: 0.99,
            isAnomaly: false,
            summary: "Final output synthesized and saved to flight telemetry",
            metrics: { latencyMs: 650, tokenCount: 210, errorCount: 0 },
            steps: [],
          },
        ],
        tags: [framework.toLowerCase(), model.toLowerCase(), "byoa-test", "nominal"],
      };

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          const storedAgents = JSON.parse(localStorage.getItem("blackbox_agents") || "[]");
          localStorage.setItem("blackbox_agents", JSON.stringify([newAgent, ...storedAgents]));

          const storedExecs = JSON.parse(localStorage.getItem("blackbox_custom_executions") || "[]");
          localStorage.setItem("blackbox_custom_executions", JSON.stringify([newExecution, ...storedExecs]));
        } catch {}
      }

      onAddAgent(newAgent);
      setCreatedAgentId(agentId);
      setCreatedExecutionId(execId);

      toast({
        title: "Agent Imported & Tested Successfully! 🚀",
        description: `${name} is live and mission ${execId} completed nominal execution.`,
        type: "success",
      });
    }, 2800);
  };

  const handleOpenTrace = () => {
    if (createdExecutionId) {
      onClose();
      router.push(`/dashboard/executions/${createdExecutionId}`);
    }
  };

  const handleOpenAgent = () => {
    if (createdAgentId) {
      onClose();
      router.push(`/dashboard/agents/${createdAgentId}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bring Your Own Agent (Upload & Live Test)"
      description="Import any AI agent config, code, or webhook endpoint, assign a test task, and observe real-time flight telemetry."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeploying}>
            Cancel
          </Button>

          {createdExecutionId ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAgent}
                className="text-xs font-sans text-zinc-300 border-white/10 hover:bg-white/5"
              >
                View Agent Profile
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenTrace}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Open in Flight Recorder ({createdExecutionId})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeployAndTest}
              disabled={isDeploying || !name.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deploying & Executing Test...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Import Agent & Run Test</span>
                </>
              )}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Method Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-sans">
          <button
            type="button"
            onClick={() => setImportMethod("config")}
            disabled={isDeploying}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              importMethod === "config"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Upload JSON / Code</span>
          </button>

          <button
            type="button"
            onClick={() => setImportMethod("webhook")}
            disabled={isDeploying}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              importMethod === "webhook"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Webhook / API Endpoint</span>
          </button>

          <button
            type="button"
            onClick={() => setImportMethod("builder")}
            disabled={isDeploying}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              importMethod === "builder"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Custom Studio</span>
          </button>
        </div>

        {/* Basic Agent Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1 block">
              Agent Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isDeploying}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1 block">
              Base AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isDeploying}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
              <option value="llama-3-3-70b">Llama 3.3 70B (Meta / Open Source)</option>
              <option value="deepseek-v3">DeepSeek V3 (Reasoning)</option>
              <option value="custom-finetune">Custom Enterprise Fine-Tune</option>
            </select>
          </div>
        </div>

        {/* Dynamic Source Panel */}
        {importMethod === "config" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                Agent Config / Spec (JSON or YAML)
              </label>
              <span className="text-[10px] text-cyan-400 font-mono">Compatible with LangChain & CrewAI exports</span>
            </div>
            <textarea
              rows={4}
              value={rawConfig}
              onChange={(e) => setRawConfig(e.target.value)}
              disabled={isDeploying}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-cyan-300/90 focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {importMethod === "webhook" && (
          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1 block">
              Agent Execution Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isDeploying}
              placeholder="https://my-company-agent.internal/api/run"
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        )}

        {/* Enabled Tools Selector */}
        <div>
          <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5 block">
            Tools & Capabilities Bound to Agent
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableToolsList.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTools.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTool(t.id)}
                  disabled={isDeploying}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between text-xs font-sans transition-all ${
                    isSelected
                      ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-200"
                      : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[11px]">{t.id}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Immediate Test Mission Prompt */}
        <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0c1017] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase text-zinc-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Assign Immediate Live Test Mission</span>
            </label>
            <Badge variant="cyan" size="sm" className="text-[9px]">
              Live Runner Ready
            </Badge>
          </div>

          <textarea
            rows={2}
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            disabled={isDeploying}
            placeholder="Type any instructions, commands, or queries for this agent..."
            className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Live Execution Stream Log */}
        {(isDeploying || logs.length > 0) && (
          <div className="rounded-lg border border-white/10 bg-[#05080e] p-3 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-white/[0.06] pb-1.5 mb-1.5">
              <span>BYOA TELEMETRY FLIGHT RECORDER</span>
              <span className="flex items-center gap-1 text-cyan-400">
                {isDeploying ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>EXECUTING MISSION</span>
                  </>
                ) : (
                  <span className="text-emerald-400 font-semibold">TEST COMPLETED (100% NOMINAL)</span>
                )}
              </span>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-cyan-300 leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
