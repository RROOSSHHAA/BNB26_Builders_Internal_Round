"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent, Execution } from "@/types";
import { useToast } from "@/context/ToastContext";
import {
  Play,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Clock,
} from "lucide-react";

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  onTaskExecuted?: (execution: Execution) => void;
}

export function AssignTaskModal({
  isOpen,
  onClose,
  agent,
  onTaskExecuted,
}: AssignTaskModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [prompt, setPrompt] = React.useState(
    "Verify database schema integrity and execute migration lock check"
  );
  const [outcome, setOutcome] = React.useState<"success" | "failure">("failure");
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [completedExecutionId, setCompletedExecutionId] = React.useState<string | null>(null);

  const presets = [
    {
      label: "Schema Migration Check",
      prompt: "Verify database schema integrity and execute migration lock check",
      outcome: "failure" as const,
    },
    {
      label: "Ledger Reconciliation",
      prompt: "Audit multi-currency transaction ledger and resolve balance discrepancies",
      outcome: "success" as const,
    },
    {
      label: "Security Audit Scan",
      prompt: "Scan cloud API keys and evaluate rate limit vulnerability exposure",
      outcome: "success" as const,
    },
    {
      label: "Customer Triage",
      prompt: "Classify high-priority enterprise support tickets and auto-route to tier-3 engineers",
      outcome: "success" as const,
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setPrompt(p.prompt);
    setOutcome(p.outcome);
  };

  const handleRunTask = () => {
    if (!prompt.trim()) return;

    setIsExecuting(true);
    setCurrentStepIndex(0);
    setLogs([`[00:00.120] Initializing agent environment with model ${agent.model}...`]);
    setCompletedExecutionId(null);

    const execId = outcome === "failure" ? "EX-2048" : `EX-${Math.floor(1000 + Math.random() * 9000)}`;

    // Step 1
    setTimeout(() => {
      setCurrentStepIndex(1);
      setLogs((prev) => [
        ...prev,
        `[00:00.640] ${agent.framework} planner expanded prompt into 4 reasoning steps (220 tokens)`,
      ]);
    }, 700);

    // Step 2
    setTimeout(() => {
      setCurrentStepIndex(2);
      setLogs((prev) => [
        ...prev,
        `[00:01.350] Tool call: postgres_client.query("SELECT * FROM schema_migrations") -> 200 OK`,
      ]);
    }, 1500);

    // Step 3
    setTimeout(() => {
      setCurrentStepIndex(3);
      if (outcome === "failure") {
        setLogs((prev) => [
          ...prev,
          `[00:02.110] ❌ CRASH DETECTED: Column 'user_tier' does not exist in target relation.`,
          `[00:02.320] BlackBox Flight Recorder activated: Memory dump & stack trace saved.`,
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          `[00:02.110] Tool call: state_validator() passed with zero validation drift.`,
          `[00:02.350] Mission complete. Flight telemetry synchronized.`,
        ]);
      }
    }, 2400);

    // Finalize
    setTimeout(() => {
      setIsExecuting(false);
      setCompletedExecutionId(execId);

      const newExecution: Execution = {
        id: execId,
        agentId: agent.id,
        agentName: agent.name,
        framework: agent.framework,
        status: outcome === "failure" ? "failed" : "success",
        startTime: new Date(Date.now() - 3000).toISOString(),
        durationMs: outcome === "failure" ? 4250 : 2350,
        totalSteps: 4,
        triggerPrompt: prompt,
        tokenUsage: { prompt: 420, completion: 180, total: 600 },
        costUsd: 0.0024,
        anomalyScore: outcome === "failure" ? 0.88 : 0.02,
        hasAnomaly: outcome === "failure",
        regions: [
          {
            id: "reg-1",
            executionId: execId,
            name: "Init & Planning",
            category: "reasoning",
            startStep: 1,
            endStep: 1,
            stepCount: 1,
            status: "healthy",
            confidence: 0.98,
            isAnomaly: false,
            summary: "Environment initialized and prompt expanded",
            metrics: { latencyMs: 640, tokenCount: 220, errorCount: 0 },
            steps: [],
          },
          {
            id: "reg-2",
            executionId: execId,
            name: "Database Probe",
            category: "tool_call",
            startStep: 2,
            endStep: 2,
            stepCount: 1,
            status: "healthy",
            confidence: 0.95,
            isAnomaly: false,
            summary: "Executed SQL table verification",
            metrics: { latencyMs: 710, tokenCount: 180, errorCount: 0 },
            steps: [],
          },
          {
            id: "reg-3",
            executionId: execId,
            name: outcome === "failure" ? "Schema Patch" : "Validation",
            category: outcome === "failure" ? "anomaly" : "finalization",
            startStep: 3,
            endStep: 4,
            stepCount: 2,
            status: outcome === "failure" ? "critical" : "healthy",
            confidence: outcome === "failure" ? 0.12 : 0.99,
            isAnomaly: outcome === "failure",
            anomalyReason: outcome === "failure" ? "Column 'user_tier' missing in target relation" : undefined,
            summary: outcome === "failure" ? "Tool failure in schema migration" : "Validation passed",
            metrics: { latencyMs: 950, tokenCount: 200, errorCount: outcome === "failure" ? 1 : 0 },
            steps: [],
          },
        ],
        tags: [agent.framework.toLowerCase(), agent.model.toLowerCase(), outcome === "failure" ? "crash" : "nominal"],
      };

      // Store execution in local storage
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("blackbox_custom_executions") || "[]");
          localStorage.setItem("blackbox_custom_executions", JSON.stringify([newExecution, ...stored]));
        } catch {}
      }

      if (onTaskExecuted) {
        onTaskExecuted(newExecution);
      }

      toast({
        title: outcome === "failure" ? "Agent Execution Diverged" : "Agent Mission Successful",
        description:
          outcome === "failure"
            ? `Mission ${execId} encountered a tool failure. Flight telemetry captured!`
            : `Mission ${execId} completed nominal execution with zero errors.`,
        type: outcome === "failure" ? "warning" : "success",
      });
    }, 3200);
  };

  const handleOpenTrace = () => {
    if (completedExecutionId) {
      onClose();
      router.push(`/dashboard/executions/${completedExecutionId}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Task & Run Live Agent Test"
      description={`Send a live prompt mission to ${agent.name} and record execution telemetry in real-time.`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isExecuting}>
            Close
          </Button>

          {completedExecutionId ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenTrace}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5"
            >
              <span>Open in Flight Recorder ({completedExecutionId})</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunTask}
              disabled={isExecuting || !prompt.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Executing Mission...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Execute Agent Task</span>
                </>
              )}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Agent Metadata Strip */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-[#0c1017]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-cyan-400">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">{agent.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Model: <strong className="text-zinc-200">{agent.model}</strong> • Framework:{" "}
                <strong className="text-zinc-200">{agent.framework}</strong>
              </span>
            </div>
          </div>
          <Badge variant="cyan" size="sm">
            Live Connected
          </Badge>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
            Mission Task Prompt *
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isExecuting}
            placeholder="Type any instructions, commands, or queries for this agent..."
            className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-sans font-medium text-zinc-400 block mb-2">
            Or pick a test mission scenario:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                disabled={isExecuting}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs font-sans ${
                  prompt === p.prompt
                    ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-200"
                    : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[11px] block">{p.label}</span>
                  {p.outcome === "failure" ? (
                    <Badge variant="crimson" size="sm" className="text-[9px] py-0 px-1">
                      Crash Demo
                    </Badge>
                  ) : (
                    <Badge variant="emerald" size="sm" className="text-[9px] py-0 px-1">
                      100% Nominal
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Execution Mode Selector */}
        <div className="p-3 rounded-lg border border-white/[0.06] bg-black/40 space-y-2">
          <label className="text-[11px] font-mono uppercase text-zinc-400 block">
            Execution Simulation Mode
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOutcome("failure")}
              disabled={isExecuting}
              className={`flex-1 p-2 rounded-lg border text-xs font-sans flex items-center justify-center gap-1.5 transition-all ${
                outcome === "failure"
                  ? "border-amber-500/60 bg-amber-950/20 text-amber-200"
                  : "border-white/[0.08] text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Simulate Tool Crash (Judge Debug Demo)</span>
            </button>

            <button
              type="button"
              onClick={() => setOutcome("success")}
              disabled={isExecuting}
              className={`flex-1 p-2 rounded-lg border text-xs font-sans flex items-center justify-center gap-1.5 transition-all ${
                outcome === "success"
                  ? "border-emerald-500/60 bg-emerald-950/20 text-emerald-200"
                  : "border-white/[0.08] text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Simulate 100% Success</span>
            </button>
          </div>
        </div>

        {/* Live Execution Stream Log */}
        {(isExecuting || logs.length > 0) && (
          <div className="rounded-lg border border-white/10 bg-[#05080e] p-3 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-white/[0.06] pb-1.5 mb-1.5">
              <span>AGENT FLIGHT STREAM TELEMETRY</span>
              <span className="flex items-center gap-1 text-cyan-400">
                {isExecuting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>RECORDING</span>
                  </>
                ) : (
                  <span className="text-emerald-400">COMPLETED</span>
                )}
              </span>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-relaxed ${
                    log.includes("CRASH") || log.includes("❌")
                      ? "text-red-400 font-semibold"
                      : log.includes("Tool call")
                      ? "text-cyan-300"
                      : "text-zinc-400"
                  }`}
                >
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
