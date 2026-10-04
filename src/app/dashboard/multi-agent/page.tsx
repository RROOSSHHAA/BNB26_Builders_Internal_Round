"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Bot,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Terminal,
  Activity,
  GitFork,
  Download,
  Share2,
  RefreshCw,
  Sliders,
  Check,
  XCircle,
  Clock,
  Layers,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/ToastContext";

interface SwarmAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  framework: string;
  stepRange: string;
  status: "success" | "diverged" | "failed" | "recovered";
  failureOrigin?: boolean;
  divergenceStep?: number;
  outputSummary: string;
}

export default function MultiAgentPage() {
  const { toast } = useToast();

  const [isReplaying, setIsReplaying] = React.useState(false);
  const [replayStage, setReplayStage] = React.useState(0);
  const [isReplayed, setIsReplayed] = React.useState(false);
  const [selectedAgentNode, setSelectedAgentNode] = React.useState<string>("agent-b");
  const [correctedDecision, setCorrectedDecision] = React.useState(
    '{"status": "VALID", "slippage_tolerance": 0.005, "clamped_boundary": "STRICT_POSITIVE"}'
  );

  const agents: SwarmAgent[] = [
    {
      id: "agent-a",
      name: "Agent A: Market Data Sentinel",
      role: "Lead Ingestion & Oracle Monitor",
      model: "GPT-4o",
      framework: "CrewAI",
      stepRange: "Steps 1–12",
      status: "success",
      outputSummary: "Ingested 14 BNB/USDT orderbook snapshots with zero latency drift.",
    },
    {
      id: "agent-b",
      name: "Agent B: Quantitative Risk Engine",
      role: "Risk Evaluation & Arbitrage Math",
      model: "DeepSeek V3",
      framework: "LangChain",
      stepRange: "Steps 13–24",
      status: isReplayed ? "recovered" : "diverged",
      failureOrigin: !isReplayed,
      divergenceStep: 18,
      outputSummary: isReplayed
        ? "Normalized slippage bounds enforced (0.50%); passed verified risk envelope to Agent C."
        : "Computed invalid negative slippage tolerance (-0.45%); emitted malformed execution payload at Step 18.",
    },
    {
      id: "agent-c",
      name: "Agent C: On-Chain Settlement Agent",
      role: "Smart Contract Execution & Ledger",
      model: "Qwen 2.5 Coder",
      framework: "Custom SDK",
      stepRange: "Steps 25–36",
      status: isReplayed ? "success" : "failed",
      outputSummary: isReplayed
        ? "Smart contract settlement transaction mined successfully (TxHash: 0x8a9f...b14c)."
        : "Transaction simulation reverted: REVERT_INVALID_SLIPPAGE; cascaded failure from Agent B.",
    },
  ];

  const activeAgent = agents.find((a) => a.id === selectedAgentNode) || agents[1];

  const handleRunCollaborationReplay = () => {
    setIsReplaying(true);
    setReplayStage(1);

    setTimeout(() => {
      setReplayStage(2);
      setTimeout(() => {
        setReplayStage(3);
        setTimeout(() => {
          setIsReplaying(false);
          setIsReplayed(true);
          toast({
            title: "Collaboration Replay Succeeded! 🚀",
            description: "Agent B decision corrected; Agent C downstream cascade recovered nominal execution.",
            type: "success",
          });
        }, 700);
      }, 800);
    }, 600);
  };

  const handleDownloadMultiAgentReport = () => {
    const report = `================================================================================
BLACK BOX MULTI-AGENT SWARM COLLABORATION & INCIDENT REPORT
================================================================================
Swarm Mission:       DeFi Arbitrage & Liquidation Workflow
Execution ID:        SWARM-EXEC-9942
Timestamp:           ${new Date().toISOString()}

1. SWARM AGENTS & ARCHITECTURE
--------------------------------------------------------------------------------
- Agent A: Market Data Sentinel (GPT-4o · CrewAI) -> Steps 1-12 [STATUS: NOMINAL]
- Agent B: Quantitative Risk Engine (DeepSeek V3 · LangChain) -> Steps 13-24 [STATUS: ${isReplayed ? "RECOVERED" : "DIVERGED"}]
- Agent C: On-Chain Settlement Agent (Qwen 2.5 Coder) -> Steps 25-36 [STATUS: ${isReplayed ? "SUCCESS" : "FAILED"}]

2. MULTI-AGENT FAILURE ORIGIN & PROPAGATION
--------------------------------------------------------------------------------
Origin of Failure:   Agent B (Quantitative Risk Engine) at Step 18
Propagated to:       Agent C (On-Chain Settlement Agent) at Step 26
Mechanism:           Agent B emitted negative slippage (-0.45%) over Inter-Agent Message Bus.
                     Agent C received corrupted payload causing Smart Contract EVM Revert.

3. COLLABORATION REPLAY & CORRECTION
--------------------------------------------------------------------------------
Checkpoint:          Step 13 (Reused Agent A prefix 100% deterministically)
Applied Correction:  Enforced strict positive slippage bounds [0.001, 0.010] on Agent B.
Outcome:             ${isReplayed ? "Replay converged nominal; transaction mined on BNB Chain." : "Unresolved without checkpoint correction."}

================================================================================
Generated by Black Box AI Flight Recorder · Swarm Intelligence Engine
================================================================================`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swarm_incident_report_9942.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded 📥",
      description: "Saved swarm_incident_report_9942.txt to your device.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6 w-full pb-16 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
              <Network className="w-3.5 h-3.5 text-blue-400" />
              Multi-Agent Swarm Intelligence
            </span>
            <span className="text-xs text-zinc-400 font-mono">Swarm: SWARM-EXEC-9942</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Multi-Agent Dependency Map & Collaboration Replay
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Observe multi-agent communication pipelines, pinpoint the exact agent that originated an error, trace failure propagation across the swarm, and replay interactions from checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadMultiAgentReport}
            className="text-xs font-mono border-white/10 text-zinc-300 hover:bg-white/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Swarm Report (.txt)</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={isReplaying}
            onClick={handleRunCollaborationReplay}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
          >
            {isReplaying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Replaying Swarm...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Replay from Checkpoint</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. Visual Agent-to-Agent Dependency Map (Requirement 12) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-200">
              Agent-to-Agent Dependency & Communication Flow
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Pipeline: Sequential Swarm · 3 Monitored Squads
          </span>
        </div>

        {/* Graph Visualizer: Node A -> Node B -> Node C */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative py-2">
          {agents.map((ag, idx) => {
            const isSelected = selectedAgentNode === ag.id;
            return (
              <div
                key={ag.id}
                onClick={() => setSelectedAgentNode(ag.id)}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "border-cyan-500/60 bg-[#0f172a] shadow-lg shadow-cyan-950/30"
                    : "border-white/[0.08] bg-[#0c1017] hover:border-white/20"
                }`}
              >
                {/* Node Top Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg border ${
                          ag.status === "success" || ag.status === "recovered"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : ag.failureOrigin
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}
                      >
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">{ag.stepRange}</span>
                    </div>

                    {ag.failureOrigin && (
                      <Badge variant="amber" size="sm" className="text-[9px] animate-pulse">
                        Failure Origin
                      </Badge>
                    )}
                    {ag.status === "recovered" && (
                      <Badge variant="emerald" size="sm" className="text-[9px]">
                        Corrected
                      </Badge>
                    )}
                    {ag.status === "failed" && (
                      <Badge variant="red" size="sm" className="text-[9px]">
                        Cascaded Failure
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white font-sans">{ag.name}</h3>
                  <span className="text-[11px] text-zinc-400 block font-sans">{ag.role}</span>
                </div>

                {/* Model & Framework Tag */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.04]">
                  <span className="bg-white/[0.04] px-2 py-0.5 rounded text-zinc-300">{ag.model}</span>
                  <span>•</span>
                  <span>{ag.framework}</span>
                </div>

                {/* Arrow Connector on Desktop */}
                {idx < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-[#090d14] border border-white/20 text-zinc-400">
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Multi-Agent Failure Propagation & Origin Analysis (Requirement 13) */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-200">
              Failure Propagation Chain & Root Origin
            </h2>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            Divergence Identified at Step 18
          </span>
        </div>

        {/* Propagation Visual Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg border border-white/[0.05] bg-[#090d14] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold">1. UPSTREAM (NOMINAL)</span>
              <span className="text-zinc-500">Agent A</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              Agent A passed valid market price feeds ($612.40) to Inter-Agent Bus without deviation.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-lg border space-y-1.5 ${
              isReplayed
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-amber-500/40 bg-amber-950/20"
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className={isReplayed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isReplayed ? "2. ORIGIN (CORRECTED)" : "2. FAILURE ORIGIN (AGENT B)"}
              </span>
              <span className="text-zinc-400 font-mono">Step 18</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              {isReplayed
                ? "Clamped slippage parameter (0.50%); validated boundary check passed."
                : "Agent B emitted unnormalized slippage (-0.45%), corrupting downstream state."}
            </p>
          </div>

          <div
            className={`p-3.5 rounded-lg border space-y-1.5 ${
              isReplayed
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-red-500/40 bg-red-950/20"
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className={isReplayed ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {isReplayed ? "3. DOWNSTREAM (SETTLED)" : "3. PROPAGATED FAILURE (AGENT C)"}
              </span>
              <span className="text-zinc-400 font-mono">Step 26</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              {isReplayed
                ? "Agent C executed on-chain settlement with zero contract reverts."
                : "Agent C received corrupted slippage payload; transaction reverted on-chain."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Collaboration Replay & Live Correction Panel (Requirement 14) */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-[#0e1424] to-[#0a0f1d] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-sans">
              Inter-Agent Checkpoint Replay & Decision Correction
            </h3>
          </div>
          <span className="text-xs text-blue-300 font-mono">Target: Agent B (Step 18)</span>
        </div>

        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          Modify the suspected decision emitted by <strong>Agent B</strong> at Step 18. Replaying from Step 13 will reuse Agent A's data retrieval steps 100% deterministically without re-querying the blockchain oracle.
        </p>

        {/* Live Correction Input */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-zinc-400 text-[11px] uppercase">
              Corrected Inter-Agent Decision Payload (Step 18):
            </label>
            <span className="text-[10px] text-cyan-400">Strict Schema Clamped</span>
          </div>
          <textarea
            rows={2}
            value={correctedDecision}
            onChange={(e) => setCorrectedDecision(e.target.value)}
            disabled={isReplaying}
            className="w-full rounded-lg border border-white/10 bg-[#06080e] p-3 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-mono text-zinc-400">
            Reused prefix: <strong className="text-white">Steps 1–12</strong> · Replayed:{" "}
            <strong className="text-white">Steps 13–36</strong>
          </div>

          <div className="flex items-center gap-2">
            {isReplayed ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Swarm Collaboration Verified</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                disabled={isReplaying}
                onClick={handleRunCollaborationReplay}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
              >
                {isReplaying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Swarm Replay...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Collaboration Replay</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
