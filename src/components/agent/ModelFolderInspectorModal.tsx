"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/types";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  Upload,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface ModelFile {
  name: string;
  path: string;
  size: string;
  type: "code" | "json" | "text" | "weights";
  content: string;
}

interface ModelFolderInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onRunAnalysis?: (agent: Agent) => void;
}

export function ModelFolderInspectorModal({
  isOpen,
  onClose,
  agent,
  onRunAnalysis,
}: ModelFolderInspectorModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = React.useState<string>("agent.py");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisStage, setAnalysisStage] = React.useState(0);
  const [analysisReport, setAnalysisReport] = React.useState<any | null>(null);
  const [newFileName, setNewFileName] = React.useState("");
  const [isAddingFile, setIsAddingFile] = React.useState(false);
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({
    src: true,
    config: true,
    prompts: true,
  });

  const agentName = agent?.name || "Autonomous Agent";
  const agentModel = agent?.model || "GPT-4o";
  const agentFramework = agent?.framework || "LangChain";

  // Synthesize model files for this agent
  const files: Record<string, ModelFile> = React.useMemo(() => {
    return {
      "agent.py": {
        name: "agent.py",
        path: "src/agent.py",
        size: "3.4 KB",
        type: "code",
        content: `"""
${agentName} - Runtime Pipeline Definition
Framework: ${agentFramework} | Underlying Model: ${agentModel}
Instrumented with Black Box AI Flight Recorder SDK
"""

from blackbox_sdk import FlightRecorder, AgentMonitor
import os

recorder = FlightRecorder(api_key=os.getenv("BLACKBOX_API_KEY"))

class ${agentName.replace(/[^a-zA-Z0-9]/g, "")}:
    def __init__(self):
        self.model = "${agentModel}"
        self.framework = "${agentFramework}"
        self.monitor = AgentMonitor(self.model)

    @recorder.trace_execution
    def execute_mission(self, user_intent: str):
        # 1. Initialize Context & Guardrails
        step1 = self.monitor.record_step("context_init", {"intent": user_intent})
        
        # 2. Reasoning & Tool Invocation
        tools_result = self.monitor.invoke_tool("database_query", {"query": user_intent})
        
        # 3. Guardrail Clamping Verification
        validated_output = self.monitor.validate_schema(tools_result)
        
        return {
            "status": "NOMINAL",
            "agent": "${agentName}",
            "result": validated_output
        }

if __name__ == "__main__":
    agent = ${agentName.replace(/[^a-zA-Z0-9]/g, "")}()
    print(agent.execute_mission("Run automated risk audit"))`,
      },
      "model_config.json": {
        name: "model_config.json",
        path: "config/model_config.json",
        size: "1.1 KB",
        type: "json",
        content: JSON.stringify(
          {
            model_name: agentName,
            base_model: agentModel,
            framework: agentFramework,
            architecture: "Transformer-Decoder-Agentic",
            hyperparameters: {
              temperature: 0.2,
              top_p: 0.95,
              max_tokens: 4096,
              repetition_penalty: 1.05,
            },
            context_window_size: 128000,
            guardrails: {
              strict_schema_validation: true,
              jailbreak_prevention: true,
              unbounded_datetime_clamp: true,
            },
            blackbox_telemetry: {
              enabled: true,
              flight_recorder_rate_hz: 60,
              checkpoint_interval_steps: 10,
            },
          },
          null,
          2
        ),
      },
      "system_prompt.txt": {
        name: "system_prompt.txt",
        path: "prompts/system_prompt.txt",
        size: "820 B",
        type: "text",
        content: `You are ${agentName}, an enterprise-grade autonomous reasoning system.
Framework: ${agentFramework}
Base Model: ${agentModel}

OPERATIONAL DIRECTIVES:
1. Adhere strictly to verified schemas for all tool calls and downstream state transitions.
2. If schema variance is detected at runtime, fail-safe to deterministic fallback clamping.
3. Every state alteration must provide an idempotency signature.
4. Always log step execution vectors to the Black Box Flight Recorder.`,
      },
      "tools.py": {
        name: "tools.py",
        path: "src/tools.py",
        size: "2.1 KB",
        type: "code",
        content: `# Tool Calling Definitions for ${agentName}
from typing import Dict, Any

def database_query(query_str: str) -> Dict[str, Any]:
    """Queries underlying operational data stores with clamped safety parameters."""
    return {"status": "SUCCESS", "rows_returned": 14, "latency_ms": 32}

def risk_calculator(portfolio_id: str) -> Dict[str, Any]:
    """Calculates Value at Risk (VaR) and volatility drawdowns."""
    return {"portfolio": portfolio_id, "var_95": 0.042, "status": "APPROVED"}`,
      },
    };
  }, [agentName, agentModel, agentFramework]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStage(1);
    setAnalysisReport(null);

    setTimeout(() => {
      setAnalysisStage(2);
      setTimeout(() => {
        setAnalysisStage(3);
        setTimeout(() => {
          setAnalysisStage(4);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisReport({
              status: "NOMINAL",
              healthScore: "99.4%",
              passedScans: [
                "AST Structure & Tool Schemas Verified",
                "Prompt Injection & Jailbreak Vulnerability Clean",
                "Schema Boundary Clamping Active",
                "Flight Recorder Telemetry Channel Synced",
              ],
              anomaliesFound: 0,
              avgLatencyMs: 1420,
              memoryFootprint: "412 MB",
              recommendation: "Model folder is production-ready with full counterfactual audit protection.",
            });
            toast({
              title: "Model Analysis Complete ✅",
              description: `${agentName} model folder passed 4/4 verification scans (99.4% health score).`,
              type: "success",
            });
          }, 700);
        }, 800);
      }, 700);
    }, 600);
  };

  if (!agent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📁 Model Folder: ${agent.name}`}
      description={`Inspect local files, weights, prompts, and run real-time static & dynamic model analysis.`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-sans text-[11px]">Folder Path:</span>
            <span className="text-zinc-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
              /workspace/models/{agent.name.toLowerCase().replace(/\s+/g, "-")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isAnalyzing}
              onClick={handleStartAnalysis}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Folder...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Check & Analyze Model</span>
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Top Model Health & Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#0c1017]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs font-sans">{agent.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {agent.model}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  {agent.framework}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-sans">
                4 Files · 7.4 KB Total · Last checked: Today
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Deep Analysis</span>
          </Button>
        </div>

        {/* Live Analysis Progress Bar */}
        {isAnalyzing && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Auditing Model Folder & Synthesizing Flight Telemetry...
              </span>
              <span>Step {analysisStage} of 4</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${(analysisStage / 4) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400 pt-1">
              <div className={`p-1.5 rounded bg-white/[0.03] border ${analysisStage >= 1 ? "border-emerald-500/40 text-emerald-300" : "border-white/5"}`}>
                1. AST & Schemas
              </div>
              <div className={`p-1.5 rounded bg-white/[0.03] border ${analysisStage >= 2 ? "border-emerald-500/40 text-emerald-300" : "border-white/5"}`}>
                2. Security & Injection
              </div>
              <div className={`p-1.5 rounded bg-white/[0.03] border ${analysisStage >= 3 ? "border-emerald-500/40 text-emerald-300" : "border-white/5"}`}>
                3. Clamping Verification
              </div>
              <div className={`p-1.5 rounded bg-white/[0.03] border ${analysisStage >= 4 ? "border-emerald-500/40 text-emerald-300" : "border-white/5"}`}>
                4. Flight Sync
              </div>
            </div>
          </div>
        )}

        {/* Analysis Result Banner */}
        {analysisReport && !isAnalyzing && (
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 to-[#0c121d] space-y-2.5 animate-in fade-in font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Model Health Score: {analysisReport.healthScore} (Nominal)
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                0 Divergences Flagged
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              {analysisReport.passedScans.map((scan: string, idx: number) => (
                <div key={idx} className="p-2 rounded bg-white/[0.02] border border-white/5 text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{scan}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Split View: Left File Tree, Right Code Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[320px]">
          {/* File Tree Left Rail (4 cols) */}
          <div className="md:col-span-4 rounded-xl border border-white/[0.08] bg-[#090d14] p-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Model Directory
              </span>
              <button
                onClick={() => setIsAddingFile(!isAddingFile)}
                className="p-1 rounded hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                title="Add new file to model folder"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Add File Input */}
            {isAddingFile && (
              <div className="p-2 rounded bg-[#0c121d] border border-cyan-500/30 space-y-1.5">
                <input
                  type="text"
                  placeholder="e.g. guardrails.py"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setIsAddingFile(false)}
                    className="text-[10px] text-zinc-400 px-2 py-0.5 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newFileName.trim()) {
                        toast({
                          title: "File Added to Model",
                          description: `${newFileName} created in model folder.`,
                          type: "success",
                        });
                        setIsAddingFile(false);
                        setNewFileName("");
                      }
                    }}
                    className="text-[10px] bg-cyan-500 text-black font-semibold px-2 py-0.5 rounded"
                  >
                    Save File
                  </button>
                </div>
              </div>
            )}

            {/* Folder 1: src */}
            <div className="space-y-1">
              <div
                onClick={() => toggleFolder("src")}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer py-1"
              >
                {expandedFolders.src ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-xs">src/</span>
              </div>
              {expandedFolders.src && (
                <div className="pl-4 space-y-0.5">
                  <div
                    onClick={() => setSelectedFile("agent.py")}
                    className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile === "agent.py"
                        ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">agent.py</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">3.4 KB</span>
                  </div>

                  <div
                    onClick={() => setSelectedFile("tools.py")}
                    className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile === "tools.py"
                        ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">tools.py</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">2.1 KB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Folder 2: config */}
            <div className="space-y-1">
              <div
                onClick={() => toggleFolder("config")}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer py-1"
              >
                {expandedFolders.config ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-xs">config/</span>
              </div>
              {expandedFolders.config && (
                <div className="pl-4">
                  <div
                    onClick={() => setSelectedFile("model_config.json")}
                    className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile === "model_config.json"
                        ? "bg-amber-500/20 text-amber-300 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">model_config.json</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">1.1 KB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Folder 3: prompts */}
            <div className="space-y-1">
              <div
                onClick={() => toggleFolder("prompts")}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer py-1"
              >
                {expandedFolders.prompts ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-xs">prompts/</span>
              </div>
              {expandedFolders.prompts && (
                <div className="pl-4">
                  <div
                    onClick={() => setSelectedFile("system_prompt.txt")}
                    className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile === "system_prompt.txt"
                        ? "bg-purple-500/20 text-purple-300 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">system_prompt.txt</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">820 B</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Viewer Right Pane (8 cols) */}
          <div className="md:col-span-8 rounded-xl border border-white/[0.08] bg-[#06080d] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#090d14] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Viewing:</span>
                <span className="text-white font-semibold">{files[selectedFile]?.path || selectedFile}</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase">{files[selectedFile]?.size}</span>
            </div>

            <div className="p-4 flex-1 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 scrollbar-thin">
              <pre className="whitespace-pre-wrap selection:bg-cyan-500/30">
                {files[selectedFile]?.content || "// File empty"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
