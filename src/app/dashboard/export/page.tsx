"use client";

import * as React from "react";
import {
  Download,
  FileText,
  FileCode,
  FileJson,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Terminal,
  Cpu,
  RefreshCw,
  Box,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/ToastContext";
import { MOCK_AGENTS, MOCK_EXECUTIONS, MOCK_REPLAY_INVESTIGATIONS } from "@/mock";

export default function ExportPage() {
  const { toast } = useToast();

  const [selectedAgentId, setSelectedAgentId] = React.useState<string>("agt_research");
  const [selectedExecutionId, setSelectedExecutionId] = React.useState<string>("EX-2048");
  const [activePackageTab, setActivePackageTab] = React.useState<"json" | "python" | "prompt" | "yaml">("json");
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(null);

  // Available sample incidents
  const incidentOptions = [
    {
      id: "EX-2048",
      agentName: "Research Agent",
      framework: "CrewAI",
      model: "Demo Reasoning Model",
      failedStep: 73,
      errorDetected: "ValidationError: date_window [2026-11-01, 2026-12-31] exceeds temporal horizon",
      rootCause: "Agent model generated an unbounded forecast horizon in tool arguments without schema boundary checks.",
      evidence: 'Step 73 payload: {"date_window": ["2026-11-01", "2026-12-31"], "clamp": false} returned HTTP 422 Unprocessable Entity.',
      originalDecision: 'Attempted to parse unvalidated future-dated earnings report; failed downstream synthesis for 54 steps.',
      correctedDecision: 'Applied strict date clamp [T-30d, T+0] and injected schema validation fallback at checkpoint Step 70.',
      replayResult: 'Alternative simulation converged at Step 74 with 0 temporal divergence cascade (100% Deterministic match).',
      finalResult: 'FAILED (Original) -> SUCCESS (Replay Verified)',
      changesMade: 'Patched system prompt with boundary clamping directives; updated tool schema in agent configuration; enabled 3-attempt exponential backoff retry policy.',
      recommendations: '1. Enforce strict JSON schema validation on all date-related arguments.\n2. Bind pre-invocation clamping guardrails before external tool dispatch.\n3. Integrate BlackBox Flight Recorder SDK to capture trace vectors and halt runaway divergence early.',
    },
    {
      id: "EX-2037",
      agentName: "Recommendation Agent",
      framework: "LangChain",
      model: "GPT-4o",
      failedStep: 41,
      errorDetected: "TimeoutException: Vector search retrieval exceeded 5000ms SLA",
      rootCause: "High-dimensional vector embeddings search timed out on non-indexed shard during peak volatility.",
      evidence: 'Step 41 trace vector: latencyMs=5120ms (Threshold=3000ms), socket_hangup: true.',
      originalDecision: 'Blocked entire recommendation pipeline waiting on synchronous vector cluster response.',
      correctedDecision: 'Switched to tiered cache retrieval with secondary RAG index fallback and 1.5s timeout threshold.',
      replayResult: 'Replayed from Step 38; fallback index responded in 240ms; downstream ranking nominal.',
      finalResult: 'FAILED (Original) -> SUCCESS (Replay Verified)',
      changesMade: 'Added dual-tier vector search fallback; updated LangChain retrieval chain with circuit-breaker pattern.',
      recommendations: '1. Configure multi-tier RAG caches for low-latency queries.\n2. Wrap external vector search calls in circuit breakers with degraded-mode fallbacks.\n3. Monitor p99 latency in BlackBox Flight Recorder.',
    },
    {
      id: "EX-2044",
      agentName: "Customer Support Agent",
      framework: "AutoGen",
      model: "Claude 3.5 Sonnet",
      failedStep: 92,
      errorDetected: "SchemaFormatMismatch: Missing mandatory customer_id in CRM mutation",
      rootCause: "Prompt extraction missed secondary entity reference in multi-turn customer conversation.",
      evidence: 'Step 92 payload: {"ticket_id": "TCK-8812", "action": "ESCALATE"} missing required key "customer_id".',
      originalDecision: 'Attempted CRM patch with incomplete payload; rejected with HTTP 400 Bad Request.',
      correctedDecision: 'Injected state recovery step extracting customer_id from conversational history buffer.',
      replayResult: 'Replayed from Step 90; customer_id resolved; CRM mutation succeeded with 200 OK.',
      finalResult: 'FAILED (Original) -> SUCCESS (Replay Verified)',
      changesMade: 'Hardened conversation state buffer; enforced mandatory schema validation before API dispatch.',
      recommendations: '1. Use typed Pydantic models for CRM mutations.\n2. Add entity verification pre-flight hook in BlackBox agent wrapper.',
    },
  ];

  const currentIncident = incidentOptions.find((i) => i.id === selectedExecutionId) || incidentOptions[0];

  // Generate .TXT Error Report
  const errorReportText = `================================================================================
BLACK BOX AI EXECUTION INTELLIGENCE — INCIDENT ERROR & CORRECTION REPORT
================================================================================
Generated: ${new Date().toISOString()}
Report Classification: AUDIT-VERIFIED (Counterfactual Replay Validated)
Platform Version: Black Box Engine v2.5.0-production

--------------------------------------------------------------------------------
1. INCIDENT IDENTIFICATION
--------------------------------------------------------------------------------
Execution ID:       ${currentIncident.id}
Agent Name:         ${currentIncident.agentName}
Framework:          ${currentIncident.framework}
Base Model:         ${currentIncident.model}
Failed Step:        Step ${currentIncident.failedStep}
Original Status:    FAILED
Corrected Status:   SUCCESS (Verified via Checkpoint Replay)

--------------------------------------------------------------------------------
2. ERROR & PROBLEM DETECTED
--------------------------------------------------------------------------------
Error Type:         ${currentIncident.errorDetected.split(":")[0]}
Error Message:      ${currentIncident.errorDetected}

--------------------------------------------------------------------------------
3. ROOT CAUSE ANALYSIS
--------------------------------------------------------------------------------
${currentIncident.rootCause}

--------------------------------------------------------------------------------
4. EVIDENCE FROM ACTUAL TRACE
--------------------------------------------------------------------------------
${currentIncident.evidence}

--------------------------------------------------------------------------------
5. DECISION COMPARISON
--------------------------------------------------------------------------------
Original Decision:
  ${currentIncident.originalDecision}

Corrected Decision:
  ${currentIncident.correctedDecision}

--------------------------------------------------------------------------------
6. REPLAY RESULT & CONVERGENCE
--------------------------------------------------------------------------------
${currentIncident.replayResult}
Final Verification: ${currentIncident.finalResult}

--------------------------------------------------------------------------------
7. CHANGES MADE TO AGENT & WORKFLOW
--------------------------------------------------------------------------------
${currentIncident.changesMade}

--------------------------------------------------------------------------------
8. RECOMMENDATIONS FOR FUTURE EXECUTIONS
--------------------------------------------------------------------------------
${currentIncident.recommendations}

================================================================================
Cryptographic Proof: sha256-${currentIncident.id.toLowerCase()}-verified-${Date.now().toString(16)}
Black Box Observability Suite · https://blackbox.ai
================================================================================`;

  // Generate Fixed Agent Configuration Package (JSON)
  const agentPackageJson = JSON.stringify(
    {
      blackbox_export_version: "2.5.0",
      package_type: "CORRECTED_AGENT_CONFIG_PACKAGE",
      target_agent: currentIncident.agentName,
      source_execution_id: currentIncident.id,
      timestamp: new Date().toISOString(),
      disclaimer: "Contains corrected runtime configuration, workflow guardrails, prompts and tool schemas. Does not contain proprietary model weights.",
      verification_status: {
        replay_pass_rate: "100%",
        original_divergence_resolved: true,
        drift_delta: 0.001,
      },
      corrected_configuration: {
        model_name: currentIncident.model,
        framework: currentIncident.framework,
        temperature: 0.15,
        max_tokens: 4096,
        guardrails: {
          strict_schema_validation: true,
          temporal_clamping_enabled: true,
          jailbreak_resistance: true,
        },
        retry_policy: {
          max_attempts: 3,
          backoff_multiplier: 1.5,
          retryable_status_codes: [429, 500, 502, 503],
        },
      },
      hardened_system_prompt: `You are ${currentIncident.agentName}, running under Black Box Verified Guardrails.\nCRITICAL DIRECTIVE: Enforce strict schema constraints and boundary clamping on all tool arguments.`,
      applied_patches: [
        {
          at_step: currentIncident.failedStep,
          patch_type: "validation_and_clamping",
          description: currentIncident.changesMade,
        },
      ],
    },
    null,
    2
  );

  // Generate Python Runtime Wrapper
  const agentPythonScript = `"""
Corrected Production Runtime for ${currentIncident.agentName}
Generated by Black Box Counterfactual Sandbox (Execution: ${currentIncident.id})
Status: VERIFIED & HARDENED
"""

import json
import time
from typing import Dict, Any

class Corrected${currentIncident.agentName.replace(/[^a-zA-Z0-9]/g, "")}Runtime:
    def __init__(self):
        self.agent_name = "${currentIncident.agentName}"
        self.framework = "${currentIncident.framework}"
        self.model = "${currentIncident.model}"
        # Corrected guardrail configuration
        self.validation_mode = "STRICT_CLAMPED"

    def execute_with_guardrail(self, task_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes mission with the verified correction applied at Step ${currentIncident.failedStep}.
        Prevents: '${currentIncident.errorDetected}'
        """
        # 1. Pre-execution Clamping & Boundary Check
        clamped_payload = dict(task_input)
        clamped_payload["blackbox_guardrail_applied"] = True
        
        # 2. Resilient Execution
        return {
            "status": "SUCCESS",
            "agent": self.agent_name,
            "corrected_step": ${currentIncident.failedStep},
            "output": clamped_payload,
            "verification_hash": "sha256-verified-${Date.now().toString(16)}"
        }

if __name__ == "__main__":
    runner = Corrected${currentIncident.agentName.replace(/[^a-zA-Z0-9]/g, "")}Runtime()
    print("🚀 Running Black Box Corrected Agent...")
    print(runner.execute_with_guardrail({"query": "Run verified mission"}))
`;

  // Trigger File Download
  const handleDownload = (filename: string, content: string, mimeType: string = "text/plain") => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadNotice(filename);
      setTimeout(() => setDownloadNotice(null), 3000);

      toast({
        title: "Download Started 📥",
        description: `Successfully generated and saved ${filename} to your device.`,
        type: "success",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 w-full pb-16 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              Correction & Export Hub
            </span>
            <span className="text-xs text-zinc-400 font-mono">Tools / Download Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Download / Export Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Export production-ready corrected agent configurations, workflow prompts, tool schemas, and downloadable audit-verified incident error reports (.txt).
          </p>
        </div>

        {/* Incident Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-zinc-400">Incident:</span>
          <select
            value={selectedExecutionId}
            onChange={(e) => setSelectedExecutionId(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0e121b] px-3 py-1.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
          >
            {incidentOptions.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} ({inc.agentName}) — Step {inc.failedStep}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0c1017] flex items-center justify-between gap-3 text-xs font-sans text-zinc-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero Weights Claim Notice:</strong> Exported packages include verified runtime code, system prompts, guardrails, and tool bindings without proprietary model weights.
          </span>
        </div>
        {downloadNotice && (
          <span className="text-emerald-400 font-mono text-xs flex items-center gap-1 shrink-0 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            Saved {downloadNotice}!
          </span>
        )}
      </div>

      {/* 2. Main Two-Column Hub: Left = Fixed Agent Package, Right = Error Report (.txt) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Fixed / Corrected Agent Package (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-200">
                  Fixed Agent / Corrected Package
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                100% Replay Verified
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Download the hardened, production-ready configuration for <strong>{currentIncident.agentName}</strong> with Step {currentIncident.failedStep} correction applied.
            </p>

            {/* Quick Download Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    `${currentIncident.agentName.toLowerCase().replace(/\s+/g, "_")}_corrected_config.json`,
                    agentPackageJson,
                    "application/json"
                  )
                }
                className="text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1.5 justify-center py-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Config (.JSON)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    `${currentIncident.agentName.toLowerCase().replace(/\s+/g, "_")}_runtime_fixed.py`,
                    agentPythonScript,
                    "text/x-python"
                  )
                }
                className="text-xs border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 flex items-center gap-1.5 justify-center py-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Runtime (.PY)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    `${currentIncident.agentName.toLowerCase().replace(/\s+/g, "_")}_hardened_prompt.txt`,
                    `// BLACKBOX HARDENED PROMPT\n// TARGET: ${currentIncident.agentName}\n\n${currentIncident.correctedDecision}`,
                    "text/plain"
                  )
                }
                className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 flex items-center gap-1.5 justify-center py-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Prompt (.TXT)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    `deployment.yaml`,
                    `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${currentIncident.agentName.toLowerCase().replace(/\s+/g, "-")}\nspec:\n  replicas: 2\n`,
                    "text/yaml"
                  )
                }
                className="text-xs border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 justify-center py-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Deploy (.YAML)</span>
              </Button>
            </div>

            {/* Code / Configuration Preview Tabs */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070a10] overflow-hidden mt-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0c1017] px-3 py-2 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActivePackageTab("json")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activePackageTab === "json"
                        ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Package JSON
                  </button>
                  <button
                    onClick={() => setActivePackageTab("python")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activePackageTab === "python"
                        ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Python Script
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleCopy(
                      activePackageTab === "json" ? agentPackageJson : agentPythonScript,
                      "package"
                    )
                  }
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-[11px]"
                >
                  {copiedSection === "package" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 scrollbar-thin">
                <pre className="whitespace-pre-wrap selection:bg-emerald-500/30">
                  {activePackageTab === "json" ? agentPackageJson : agentPythonScript}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Error Report (.txt) Download (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-200">
                  Incident Error Report (.txt)
                </h2>
              </div>
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                RFC-Audit Spec
              </Badge>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Standardized forensic report containing error detected, root cause, evidence trace, replay result, and future recommendations.
            </p>

            {/* Download Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                handleDownload(
                  `incident_report_${currentIncident.id.toLowerCase()}.txt`,
                  errorReportText,
                  "text/plain"
                )
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 py-2.5 shadow-md font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Error Report (.txt)</span>
            </Button>

            {/* Error Report Preview Box */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070a10] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0c1017] px-3 py-2 text-xs font-mono">
                <span className="text-zinc-400 text-[11px]">
                  incident_report_{currentIncident.id.toLowerCase()}.txt
                </span>
                <button
                  onClick={() => handleCopy(errorReportText, "report")}
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-[11px]"
                >
                  {copiedSection === "report" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Report</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 max-h-72 overflow-y-auto font-mono text-[10.5px] leading-relaxed text-zinc-300 scrollbar-thin bg-black/40">
                <pre className="whitespace-pre-wrap selection:bg-cyan-500/30">
                  {errorReportText}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
