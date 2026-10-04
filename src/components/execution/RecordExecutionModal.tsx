"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Terminal, Sparkles, Play, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface RecordExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecordExecutionModal({
  isOpen,
  onClose,
}: RecordExecutionModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"simulate" | "sdk">("simulate");
  const [lang, setLang] = React.useState<"python" | "typescript">("python");
  const [copied, setCopied] = React.useState(false);

  // Simulation state
  const [selectedScenario, setSelectedScenario] = React.useState<"migration_fail" | "support_success">("migration_fail");
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulationStep, setSimulationStep] = React.useState(0);

  const pythonCode = `# 1. Install SDK
pip install blackbox-agent-recorder

# 2. Wrap your agent execution
from blackbox import FlightRecorder

recorder = FlightRecorder(api_key="bb_live_9f82d1c0...")

with recorder.session(agent_name="DevOps SRE Agent") as session:
    # Your agent code runs normally
    result = agent.run("Apply schema migration with zero lock downtime")
    session.record_output(result)`;

  const tsCode = `// 1. Install SDK
npm install @blackbox/recorder

// 2. Wrap your agent execution
import { FlightRecorder } from "@blackbox/recorder";

const recorder = new FlightRecorder({
  apiKey: "bb_live_9f82d1c0..."
});

const session = await recorder.startSession({ agentName: "DevOps SRE Agent" });
const result = await agent.run("Apply schema migration with zero lock downtime");
await session.complete(result);`;

  const activeSnippet = lang === "python" ? pythonCode : tsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchLiveSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => setSimulationStep(2), 500);
    setTimeout(() => setSimulationStep(3), 1000);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep(4);
      onClose();

      const targetId = selectedScenario === "migration_fail" ? "EX-2048" : "EX-2049";
      toast({
        title: "Live Execution Captured",
        description: `Mission telemetry recorded. Navigating to execution autopsy...`,
        type: "success",
      });

      router.push(`/dashboard/executions/${targetId}`);
    }, 1600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record & Run Agent Execution"
      description="Launch a live autonomous mission or stream telemetry directly from your Python/TypeScript codebase"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-mono text-zinc-500">
            Black Box Live Telemetry Ingestion • Port 4000
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("simulate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "simulate"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>1-Click Live Test Mission (Demo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sdk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "sdk"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Developer SDK Code</span>
          </button>
        </div>

        {/* TAB 1: 1-CLICK LIVE TEST MISSION */}
        {activeTab === "simulate" && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Select an agent mission to simulate live telemetry ingestion in front of the judges:
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Failed Run with Hallucination */}
              <div
                onClick={() => setSelectedScenario("migration_fail")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedScenario === "migration_fail"
                    ? "border-rose-500/50 bg-rose-950/20 shadow-sm"
                    : "border-white/[0.08] bg-[#070a0f] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        DevOps SRE Agent — Production Schema Migration
                      </span>
                      <Badge variant="crimson" size="sm">Crash at Step 6</Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Agent hallucinates non-existent CLI argument <code className="text-rose-300">--ignore-locks-force</code>. Ideal for demonstrating AI Diagnosis and Checkpoint Replay.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Successful Run */}
              <div
                onClick={() => setSelectedScenario("support_success")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedScenario === "support_success"
                    ? "border-emerald-500/50 bg-emerald-950/20 shadow-sm"
                    : "border-white/[0.08] bg-[#070a0f] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        Customer Support Resolution Agent — Billing Triage
                      </span>
                      <Badge variant="emerald" size="sm">100% Success</Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Clean 6-step multi-turn tool calling run querying Stripe billing API and dispatching invoice resolution without errors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Button & Progress */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleLaunchLiveSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2 font-mono text-xs py-3"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                    <span>
                      {simulationStep === 1 && "Ingesting Raw Trace Steps (1..8)..."}
                      {simulationStep === 2 && "Synthesizing Execution Regions..."}
                      {simulationStep === 3 && "Running ML Diagnosis Engine..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Launch Mission & Open Flight Recorder</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPER SDK SNIPPET */}
        {activeTab === "sdk" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 rounded-lg border border-white/[0.08] bg-[#070a0f]">
                <button
                  onClick={() => setLang("python")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    lang === "python"
                      ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setLang("typescript")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    lang === "typescript"
                      ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  TypeScript
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-lg border border-white/[0.08] bg-[#05080e] p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
                {activeSnippet}
              </pre>
            </div>

            <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0c1017] flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                Black Box automatically segments trace steps into high-level regions without requiring manual code instrumentation.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
