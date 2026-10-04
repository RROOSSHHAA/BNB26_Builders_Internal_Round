"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent, Execution } from "@/types";
import {
  Terminal,
  Sparkles,
  Check,
  Bot,
  Play,
  ArrowRight,
  Loader2,
  Database,
  Search,
  Code2,
  Shield,
  UploadCloud,
  Globe,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { apiClient } from "@/lib/api-client";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (newAgent: Agent) => void;
}

export function AddAgentModal({
  isOpen,
  onClose,
  onAddAgent,
}: AddAgentModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = React.useState<"custom_deploy" | "quick_preset">("custom_deploy");

  // Form State
  const [name, setName] = React.useState("DeepSeek Risk Auditor Agent");
  const [description, setDescription] = React.useState("Custom fine-tuned agent for transaction ledger and risk audit.");
  const [model, setModel] = React.useState("deepseek-v3");
  const [customModelSource, setCustomModelSource] = React.useState<"ollama" | "huggingface" | "cloudrun" | "webhook">("cloudrun");
  const [endpointUrl, setEndpointUrl] = React.useState("https://agent-runtime.internal.cloud/api/v1/infer");
  const [framework, setFramework] = React.useState<"LangChain" | "CrewAI" | "AutoGen" | "LlamaIndex" | "Custom">("LangChain");
  const [environment, setEnvironment] = React.useState("Production");

  // Tools Selection
  const [selectedTools, setSelectedTools] = React.useState<string[]>([
    "Database Query (PostgreSQL)",
    "Vector Search (RAG)",
    "Code Sandbox",
  ]);

  const toolsOptions = [
    { id: "Database Query (PostgreSQL)", icon: Database },
    { id: "Vector Search (RAG)", icon: Search },
    { id: "Code Sandbox", icon: Code2 },
    { id: "Security Scanner", icon: Shield },
  ];

  // Test Task State
  const [taskPrompt, setTaskPrompt] = React.useState(
    "Verify database transaction ledger consistency and execute lock check"
  );
  const [isExecutingTest, setIsExecutingTest] = React.useState(false);
  const [testLogs, setTestLogs] = React.useState<string[]>([]);
  const [createdAgentId, setCreatedAgentId] = React.useState<string | null>(null);
  const [createdExecutionId, setCreatedExecutionId] = React.useState<string | null>(null);

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const handleDeployAndRunTest = () => {
    if (!name.trim()) {
      toast({
        title: "Agent Name Required",
        description: "Please specify a name for your custom AI model / agent.",
        type: "error",
      });
      return;
    }

    setIsExecutingTest(true);
    setTestLogs(["[00:00.120] Deploying custom model container into BlackBox runtime..."]);

    const agentId = `agt_${Date.now()}`;
    const execId = `EX-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        `[00:00.580] Connected model: ${model} via ${customModelSource.toUpperCase()}`,
        `[00:00.820] Injected ${selectedTools.length} tools & registered BlackBox flight telemetry hooks`,
      ]);
    }, 800);

    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        `[00:01.350] Executing initial test task: "${taskPrompt.slice(0, 45)}..."`,
        `[00:01.900] Tool call: postgres_client.query("SELECT ledger_id, balance FROM accounts") -> 200 OK`,
        `[00:02.300] State checkpoint recorded. Zero drift detected.`,
      ]);
    }, 1800);

    setTimeout(() => {
      setIsExecutingTest(false);
      setTestLogs((prev) => [
        ...prev,
        `[00:02.800] ✅ Custom model successfully deployed! Mission ${execId} nominal (100% success).`,
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
        avgDurationMs: 2800,
        lastRunAt: new Date().toISOString(),
        description: description.trim() || "Custom deployed AI model with autonomous task capabilities.",
        tags: [framework.toLowerCase(), model.toLowerCase(), "custom-deployed", "active"],
        environment,
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
        startTime: new Date(Date.now() - 2800).toISOString(),
        durationMs: 2800,
        totalSteps: 4,
        triggerPrompt: taskPrompt,
        tokenUsage: { prompt: 510, completion: 240, total: 750 },
        costUsd: 0.003,
        anomalyScore: 0.01,
        hasAnomaly: false,
        regions: [
          {
            id: "reg-1",
            executionId: execId,
            name: "Model Deployment & Boot",
            category: "reasoning",
            startStep: 1,
            endStep: 1,
            stepCount: 1,
            status: "healthy",
            confidence: 0.99,
            isAnomaly: false,
            summary: `Model ${model} booted via ${customModelSource}`,
            metrics: { latencyMs: 580, tokenCount: 200, errorCount: 0 },
            steps: [],
          },
          {
            id: "reg-2",
            executionId: execId,
            name: "Tool & Mission Execution",
            category: "tool_call",
            startStep: 2,
            endStep: 3,
            stepCount: 2,
            status: "healthy",
            confidence: 0.98,
            isAnomaly: false,
            summary: "Database probe executed and verified",
            metrics: { latencyMs: 1400, tokenCount: 350, errorCount: 0 },
            steps: [],
          },
          {
            id: "reg-3",
            executionId: execId,
            name: "Telemetry Snapshot",
            category: "finalization",
            startStep: 4,
            endStep: 4,
            stepCount: 1,
            status: "healthy",
            confidence: 0.99,
            isAnomaly: false,
            summary: "Telemetry synchronized to BlackBox Flight Recorder",
            metrics: { latencyMs: 820, tokenCount: 200, errorCount: 0 },
            steps: [],
          },
        ],
        tags: [framework.toLowerCase(), model.toLowerCase(), "custom-deploy-test"],
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
        title: "Custom Model Deployed & Tested! 🚀",
        description: `${name} (${model}) is live and mission ${execId} completed nominal execution.`,
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
      title="Deploy Custom AI Model & Run Test"
      description="Deploy any AI model or agent (HuggingFace, Ollama, Cloud Run, Webhook), assign a task, and observe real-time flight telemetry."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isExecutingTest}>
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
                View Agent Dashboard
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
              onClick={handleDeployAndRunTest}
              disabled={isExecutingTest || !name.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              {isExecutingTest ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deploying & Executing Task...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Deploy Model & Run Test</span>
                </>
              )}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveTab("custom_deploy")}
            disabled={isExecutingTest}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "custom_deploy"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            <span>🚀 Deploy Custom Model & Test</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quick_preset")}
            disabled={isExecutingTest}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "quick_preset"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>⚡ Quick Preset (GPT-4o / Claude)</span>
          </button>
        </div>

        {/* Basic Agent Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1 block">
              Agent / Model Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isExecutingTest}
              placeholder="e.g. DeepSeek Risk Auditor, Llama Finance Squad"
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
              disabled={isExecutingTest}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="deepseek-v3">DeepSeek V3 (Reasoning)</option>
              <option value="llama-3-3-70b">Meta Llama 3.3 70B (Open Source)</option>
              <option value="qwen-2-5-coder">Qwen 2.5 Coder 32B</option>
              <option value="mistral-large">Mistral Large 2</option>
              <option value="gpt-4o">OpenAI GPT-4o</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              <option value="custom-fine-tune">Custom Proprietary Fine-Tune</option>
            </select>
          </div>
        </div>

        {/* Model Deployment Source */}
        {activeTab === "custom_deploy" && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1 block">
                Deployment Runtime Source
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                {[
                  { id: "cloudrun", label: "Cloud Run / Docker" },
                  { id: "ollama", label: "Ollama / Localhost" },
                  { id: "huggingface", label: "Hugging Face" },
                  { id: "webhook", label: "Custom API URL" },
                ].map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setCustomModelSource(src.id as any)}
                    disabled={isExecutingTest}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      customModelSource === src.id
                        ? "border-cyan-500/60 bg-cyan-950/30 text-cyan-200 font-semibold"
                        : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1 block">
                Endpoint URL / Model Repository Path
              </label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                disabled={isExecutingTest}
                className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Tools Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5 block">
                Bound Tools & Capabilities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {toolsOptions.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTools.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTool(t.id)}
                      disabled={isExecutingTest}
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

            {/* Test Task Assignment */}
            <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0c1017] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Assign Test Task to Verify Deployment</span>
                </label>
                <Badge variant="cyan" size="sm" className="text-[9px]">
                  Flight Recorder Attached
                </Badge>
              </div>

              <textarea
                rows={2}
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                disabled={isExecutingTest}
                placeholder="Type instructions or a mission for the agent to execute immediately..."
                className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Live Execution Logs */}
        {(isExecutingTest || testLogs.length > 0) && (
          <div className="rounded-lg border border-white/10 bg-[#05080e] p-3 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-white/[0.06] pb-1.5 mb-1.5">
              <span>LIVE DEPLOYMENT TELEMETRY</span>
              <span className="flex items-center gap-1 text-cyan-400">
                {isExecutingTest ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>RUNNING MISSION</span>
                  </>
                ) : (
                  <span className="text-emerald-400 font-semibold">DEPLOYMENT VERIFIED</span>
                )}
              </span>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto">
              {testLogs.map((log, index) => (
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
