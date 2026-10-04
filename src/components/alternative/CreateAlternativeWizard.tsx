"use client";

import * as React from "react";
import {
  GitFork,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  Database,
  Code2,
  Check,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { AlternativeInvestigation, AlternativeOutcomeStatus } from "@/types";
import { BranchingPathVisualizer } from "./BranchingPathVisualizer";
import { ChangeSummaryCard } from "./ChangeSummaryCard";
import { DownstreamImpactMap } from "./DownstreamImpactMap";

interface CreateAlternativeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAlternative: (newInvestigation: AlternativeInvestigation) => void;
}

export function CreateAlternativeWizard({
  isOpen,
  onClose,
  onSaveAlternative,
}: CreateAlternativeWizardProps) {
  // Wizard steps: 1: Select Execution, 2: Identify Divergence, 3: Select Decision, 4: Define Alternative, 5: Preview, 6: Test & Result
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Configuration States
  const [selectedExecutionId, setSelectedExecutionId] = React.useState<string>("EX-2048");
  const [selectedRegion, setSelectedRegion] = React.useState<string>("Validation");
  const [selectedDecisionStep, setSelectedDecisionStep] = React.useState<number>(73);
  const [alternativeType, setAlternativeType] = React.useState<
    "correct_validation" | "alternative_instruction" | "alternative_tool_result" | "alternative_model_response" | "custom"
  >("correct_validation");

  const defaultOriginalJson = JSON.stringify(
    {
      valid: false,
      reason: "missing_field",
      divergence: "date_window_out_of_bounds",
    },
    null,
    2
  );

  const defaultAlternativeJson = JSON.stringify(
    {
      valid: true,
      reason: "corrected_structure",
      normalized_window: "2026-Q3",
    },
    null,
    2
  );

  const [customJson, setCustomJson] = React.useState<string>(defaultAlternativeJson);

  // Simulation Running State
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [simStage, setSimStage] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);

  // Available candidate executions
  const candidateExecutions = [
    {
      id: "EX-2048",
      agentName: "Research Agent",
      framework: "CrewAI",
      totalSteps: 127,
      duration: "18.4s",
      status: "FAILED",
      reason: "Step 73 Validation Divergence",
      regions: [
        { name: "Data Retrieval", range: "1–28", status: "NORMAL" },
        { name: "Reasoning", range: "29–61", status: "NORMAL" },
        { name: "Validation", range: "62–78", status: "ANOMALOUS" },
        { name: "Finalization", range: "79–127", status: "AFFECTED" },
      ],
    },
    {
      id: "EX-2037",
      agentName: "Recommendation Agent",
      framework: "LangChain",
      totalSteps: 64,
      duration: "6.2s",
      status: "FAILED",
      reason: "Step 41 Vector Search Timeout",
      regions: [
        { name: "Retrieval", range: "1–22", status: "NORMAL" },
        { name: "Vector Search", range: "23–44", status: "ANOMALOUS" },
        { name: "Ranking", range: "45–64", status: "AFFECTED" },
      ],
    },
    {
      id: "EX-2029",
      agentName: "Customer Support Agent",
      framework: "AutoGen",
      totalSteps: 72,
      duration: "8.9s",
      status: "FAILED",
      reason: "Step 58 Tool Fallback Failure",
      regions: [
        { name: "Intent Classification", range: "1–24", status: "NORMAL" },
        { name: "Action Dispatch", range: "25–58", status: "ANOMALOUS" },
        { name: "Conversation", range: "59–72", status: "AFFECTED" },
      ],
    },
  ];

  const activeExecution =
    candidateExecutions.find((e) => e.id === selectedExecutionId) ||
    candidateExecutions[0];

  // Local context decisions around Step 73
  const contextSteps = [
    {
      step: 72,
      title: "Reasoning Synthesis",
      status: "NORMAL",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      description: "Market hypotheses formulated with source cross-checks.",
    },
    {
      step: 73,
      title: "Response Validation",
      status: "SUSPICIOUS",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/30",
      description: "Proposed divergence point: Validation result rejected due to schema error.",
    },
    {
      step: 74,
      title: "Finalization Preparation",
      status: "AFFECTED",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      description: "Downstream region halted after validation check failed.",
    },
  ];

  const handleTestAlternative = () => {
    setIsProcessing(true);
    setSimStage(1);

    setTimeout(() => setSimStage(2), 600);
    setTimeout(() => setSimStage(3), 1300);
    setTimeout(() => setSimStage(4), 2000);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 2600);
  };

  const handleSave = React.useCallback(() => {
    const ts = Date.now();
    const newInvestigation: AlternativeInvestigation = {
      id: `alt-${ts.toString().slice(-4)}`,
      agentName: activeExecution.agentName,
      agentId: "agt_research",
      framework: activeExecution.framework,
      originalExecutionId: activeExecution.id,
      totalSteps: activeExecution.totalSteps,
      durationText: activeExecution.duration,
      divergenceStep: selectedDecisionStep,
      divergenceStepTitle: "Response Validation",
      divergenceRegion: selectedRegion,
      originalOutcome: "FAILED",
      alternativeOutcome: "SUCCESS",
      alternativeStatus: "PROMISING",
      affectedRegion: "Finalization",
      statusExplanation:
        "The alternative path produced a successful downstream outcome in this simulated investigation.",
      createdAtAgo: "Just now",
      createdAt: new Date().toISOString(),
      originalDecision: {
        title: "Validation result: Invalid structure",
        description: "Validator rejected synthesized research report due to missing required schema fields.",
        payloadSnippet: defaultOriginalJson,
      },
      alternativeDecision: {
        type: alternativeType,
        title: "Corrected structure & normalized schema",
        description: "Hypothetical decision override applied to ensure valid response structure.",
        payloadSnippet: customJson,
      },
      originalPath: [
        { name: "Data Retrieval", status: "ok", range: "1–28" },
        { name: "Reasoning", status: "ok", range: "29–61" },
        { name: "Validation", status: "warn", range: "62–78" },
        { name: "Finalization", status: "fail", range: "79–127" },
      ],
      alternativePath: [
        { name: "Data Retrieval", status: "ok", range: "1–28" },
        { name: "Reasoning", status: "ok", range: "29–61" },
        { name: "Validation", status: "ok", range: "62–78" },
        { name: "Finalization", status: "ok", range: "79–127" },
      ],
      whatChanged: {
        decision: `Step ${selectedDecisionStep} — Response Validation`,
        original: "Invalid structure (missing_field)",
        alternative: "Corrected structure (normalized_window)",
      },
      downstreamEffect: {
        original: "Finalization failed due to retry cascade",
        alternative: "Finalization completed successfully in 820ms",
      },
      finalOutcomeText: "FAILED → SUCCESS",
      impactNodes: [
        {
          regionName: "Validation",
          status: "recovered",
          statusText: "Recovered (decision constraint resolved)",
        },
        {
          regionName: "Finalization",
          status: "recovered",
          statusText: "Recovered (synthesized report published)",
        },
      ],
    };

    onSaveAlternative(newInvestigation);
    onClose();
  }, [
    activeExecution,
    alternativeType,
    customJson,
    defaultOriginalJson,
    onClose,
    onSaveAlternative,
    selectedDecisionStep,
    selectedRegion,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1017] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#080c13]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
              <GitFork className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                  Alternative Execution Laboratory
                </h3>
                <span className="rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] px-2 py-0.2">
                  Decision Sandbox
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Step {currentStep} of 6 · Explore what happens if a problematic decision were changed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Wizard Steps Header */}
        <div className="grid grid-cols-6 border-b border-white/[0.06] bg-[#090d14] text-[10px] sm:text-[11px]">
          {[
            { step: 1, label: "1. Select Run" },
            { step: 2, label: "2. Divergence" },
            { step: 3, label: "3. Decision" },
            { step: 4, label: "4. Alternative" },
            { step: 5, label: "5. Preview" },
            { step: 6, label: "6. Outcome" },
          ].map((s) => (
            <div
              key={s.step}
              className={`py-2 text-center transition-colors border-r last:border-r-0 border-white/[0.04] truncate px-1 flex items-center justify-center gap-1 ${
                currentStep === s.step
                  ? "bg-purple-500/10 text-purple-300 font-semibold border-b-2 border-b-purple-400"
                  : currentStep > s.step
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-400"
              }`}
            >
              {currentStep > s.step && <Check className="h-3 w-3 shrink-0 text-emerald-400" />}
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: SELECT EXECUTION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 1 — Select Problematic Execution
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pick a recorded execution that experienced a failure or anomaly.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {candidateExecutions.map((exec) => {
                  const isSelected = selectedExecutionId === exec.id;
                  return (
                    <div
                      key={exec.id}
                      onClick={() => setSelectedExecutionId(exec.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-purple-500/60 bg-[#14101e] shadow-md"
                          : "border-white/[0.08] bg-[#080c13] hover:border-white/[0.16] hover:bg-[#0c1017]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-purple-400 bg-purple-500 text-black"
                                : "border-zinc-600"
                            }`}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-100">
                                {exec.agentName}
                              </span>
                              <span className="text-xs text-zinc-400">
                                {exec.id}
                              </span>
                              <span className="rounded bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.2 text-[10px] text-zinc-400">
                                {exec.framework}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              {exec.totalSteps} steps · {exec.duration} · {exec.reason}
                            </p>
                          </div>
                        </div>

                        <span className="rounded px-2 py-0.5 text-[10px] border border-red-500/30 bg-red-500/10 text-red-300">
                          {exec.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: IDENTIFY DIVERGENCE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 2 — Identify Problematic Region
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select the compressed execution region where behavior diverged from nominal.
                </p>
              </div>

              {/* Compressed Execution Map */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {activeExecution.regions.map((reg, idx) => {
                  const isSelected = selectedRegion === reg.name;
                  const isAnomalous = reg.status === "ANOMALOUS";
                  const isAffected = reg.status === "AFFECTED";

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRegion(reg.name)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/15 shadow-md"
                          : "border-white/[0.08] bg-[#080c13] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-100">
                          {reg.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${
                            isAnomalous
                              ? "bg-red-500/10 text-red-300 border-red-500/30"
                              : isAffected
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Steps {reg.range}
                      </div>
                      {isAnomalous && (
                        <div className="mt-2 text-[10px] text-red-300 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Divergence root point</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg border border-purple-500/30 bg-purple-500/[0.04] p-3 text-xs text-purple-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-purple-400" />
                <span>
                  Selected region: <strong>{selectedRegion}</strong>. We will zoom into the specific intermediate decision in the next step.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT DECISION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 3 — Select Decision to Fork
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Choose the specific step decision that served as the divergence catalyst.
                </p>
              </div>

              <div className="space-y-3">
                {contextSteps.map((step) => {
                  const isTarget = selectedDecisionStep === step.step;
                  return (
                    <div
                      key={step.step}
                      onClick={() => setSelectedDecisionStep(step.step)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isTarget
                          ? "border-amber-500/60 bg-[#161208] shadow-md"
                          : "border-white/[0.07] bg-[#080c13] hover:border-white/[0.14]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-zinc-100">
                            Step {step.step}
                          </span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-xs font-semibold text-zinc-200">
                            {step.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold border ${step.badgeColor}`}
                          >
                            {step.status}
                          </span>
                          {isTarget && (
                            <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 font-semibold">
                              Divergence Point
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.04] p-3 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>This decision is the proposed divergence point for the alternative branch.</span>
              </div>
            </div>
          )}

          {/* STEP 4: DEFINE ALTERNATIVE */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 4 — Define Alternative Decision
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select or author the hypothetical change you want to inject at Step {selectedDecisionStep}.
                </p>
              </div>

              {/* Original Decision Banner */}
              <div className="rounded-lg border border-red-500/20 bg-red-500/[0.04] p-3.5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold block">
                  ORIGINAL DECISION AT STEP {selectedDecisionStep}
                </span>
                <div className="text-xs font-semibold text-zinc-200">
                  Validation result: Invalid structure
                </div>
                <p className="text-[11px] text-zinc-400">
                  Validator rejected synthesized research report due to missing required schema fields.
                </p>
              </div>

              {/* Alternative Selector Options */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  Select Alternative Option:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {([
                    { id: "correct_validation", label: "Correct validation result" },
                    { id: "alternative_instruction", label: "Alternative instruction" },
                    { id: "alternative_tool_result", label: "Alternative tool result" },
                    { id: "alternative_model_response", label: "Alternative model response" },
                    { id: "custom", label: "Custom alternative" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAlternativeType(opt.id)}
                      className={`rounded-lg border p-2.5 text-left transition-all ${
                        alternativeType === opt.id
                          ? "border-purple-500 bg-purple-500/15 text-purple-200 font-medium"
                          : "border-white/[0.08] bg-[#080c13] text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Alternative Code Area */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-red-400 text-[10px]">ORIGINAL PAYLOAD</span>
                    <pre className="rounded-lg border border-red-500/20 bg-[#05080f] p-3 text-[11px] text-red-200/90 h-36 overflow-auto scrollbar-thin">
                      {defaultOriginalJson}
                    </pre>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-400 text-[10px]">ALTERNATIVE PROPOSAL (EDITABLE)</span>
                    <textarea
                      value={customJson}
                      onChange={(e) => setCustomJson(e.target.value)}
                      rows={6}
                      className="w-full rounded-lg border border-emerald-500/40 bg-[#05080f] p-3 text-[11px] text-emerald-200/90 focus:outline-hidden focus:border-emerald-400 h-36 scrollbar-thin font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 5 — Alternative Path Preview
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Confirm the divergence point and preview downstream path expectations.
                </p>
              </div>

              {/* Preview Parameters Box */}
              <div className="rounded-xl border border-white/[0.08] bg-[#080c13] p-4 text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Execution Source:</span>
                  <span className="text-zinc-100 font-medium">
                    {activeExecution.agentName} ({activeExecution.id})
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Checkpoint Reused:</span>
                  <span className="text-emerald-400 font-medium">
                    Steps 1 → 70 (100% Cached)
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Decision Changed:</span>
                  <span className="text-amber-300 font-medium">
                    Step {selectedDecisionStep} (Response Validation)
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Downstream Path Evaluated:</span>
                  <span className="text-purple-300 font-medium">
                    Steps 71 → {activeExecution.totalSteps}
                  </span>
                </div>
              </div>

              {/* Visual Branch Preview */}
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Region Flow Comparison
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-red-500/30 bg-[#080c13] p-3 space-y-1">
                    <span className="text-red-400 text-[10px] font-bold">ORIGINAL PATH</span>
                    <p className="text-zinc-300 flex items-center gap-1.5 flex-wrap">
                      <span>Reasoning</span>
                      <span>→</span>
                      <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                        Validation <AlertTriangle className="h-3 w-3" />
                      </span>
                      <span>→</span>
                      <span className="text-red-400 font-semibold inline-flex items-center gap-1">
                        Finalization <X className="h-3 w-3" />
                      </span>
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-[#080c13] p-3 space-y-1">
                    <span className="text-emerald-400 text-[10px] font-bold">ALTERNATIVE PATH</span>
                    <p className="text-zinc-300 flex items-center gap-1.5 flex-wrap">
                      <span>Reasoning</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                        Validation <Check className="h-3 w-3" />
                      </span>
                      <span>→</span>
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                        Finalization <Check className="h-3 w-3" />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: TEST ALTERNATIVE & RESULT */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {!isCompleted ? (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      Step 6 — Test Alternative Path
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Ready to simulate the alternative decision through downstream execution.
                    </p>
                  </div>

                  {isProcessing ? (
                    <div className="rounded-xl border border-purple-500/30 bg-[#120e1d] p-5 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold mb-2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                        <span>Evaluating Downstream Alternative Path...</span>
                      </div>

                      <div className="space-y-2 pl-2">
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 1 ? "text-emerald-400" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 1 ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>Preparing alternative decision vector</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 2 ? "text-emerald-400" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 2 ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>Applying proposed decision at Step {selectedDecisionStep}</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 3 ? "text-purple-300 font-medium" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 3 ? (
                            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>Evaluating downstream path (Steps 71 → {activeExecution.totalSteps})</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 4 ? "text-cyan-300" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 4 ? (
                            <Check className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>Generating comparison delta & impact map</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.08] bg-[#080c13] p-5 text-center space-y-3">
                      <Sparkles className="h-8 w-8 text-purple-400 mx-auto" />
                      <h5 className="text-sm font-bold text-zinc-100">
                        Launch Simulated Decision Test
                      </h5>
                      <p className="max-w-md mx-auto text-xs text-zinc-400 leading-relaxed">
                        This simulation runs in an isolated sandbox with zero external side effects or real model calls.
                      </p>
                      <button
                        onClick={handleTestAlternative}
                        className="inline-flex items-center gap-2 rounded-md border border-purple-500/40 bg-purple-500/20 px-5 py-2.5 text-xs font-bold text-purple-200 hover:bg-purple-500/30 transition-all shadow-md"
                      >
                        <GitFork className="h-4 w-4" />
                        <span>Test Alternative</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ALTERNATIVE RESULT STATE */
                <div className="space-y-5">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] p-4 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ALTERNATIVE RESULT
                      </span>
                      <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 font-bold">
                        PROMISING
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Original: <strong className="text-red-400">FAILED</strong> → Alternative:{" "}
                      <strong className="text-emerald-400">SUCCESS</strong>.
                      Changing Step {selectedDecisionStep} resolved the downstream validation anomaly and allowed the Finalization region to complete successfully.
                    </p>
                  </div>

                  <BranchingPathVisualizer
                    originalPath={[
                      { name: "Data Retrieval", status: "ok", range: "1–28" },
                      { name: "Reasoning", status: "ok", range: "29–61" },
                      { name: "Validation", status: "warn", range: "62–78" },
                      { name: "Finalization", status: "fail", range: "79–127" },
                    ]}
                    alternativePath={[
                      { name: "Data Retrieval", status: "ok", range: "1–28" },
                      { name: "Reasoning", status: "ok", range: "29–61" },
                      { name: "Validation", status: "ok", range: "62–78" },
                      { name: "Finalization", status: "ok", range: "79–127" },
                    ]}
                    divergenceStep={selectedDecisionStep}
                    divergenceRegion={selectedRegion}
                    originalOutcome="FAILED"
                    alternativeOutcome="SUCCESS"
                  />

                  <ChangeSummaryCard
                    whatChanged={{
                      decision: `Step ${selectedDecisionStep} — Response Validation`,
                      original: "Invalid structure (missing_field)",
                      alternative: "Corrected structure (normalized_window)",
                    }}
                    downstreamEffect={{
                      original: "Finalization region failed due to retry cascade",
                      alternative: "Finalization region completed in 820ms",
                    }}
                    finalOutcomeText="FAILED → SUCCESS"
                    alternativeStatus="PROMISING"
                    statusExplanation="The alternative path produced a successful downstream outcome in this simulated investigation."
                  />

                  <DownstreamImpactMap
                    divergenceStep={selectedDecisionStep}
                    impactNodes={[
                      {
                        regionName: "Validation",
                        status: "recovered",
                        statusText: "Recovered (anomalous thought loop halted)",
                      },
                      {
                        regionName: "Finalization",
                        status: "recovered",
                        statusText: "Recovered (synthesized report published)",
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#080c13] text-xs">
          <div>
            {currentStep > 1 && !isProcessing && !isCompleted && (
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-white/[0.06] transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isCompleted ? "Discard" : "Cancel"}
            </button>

            {currentStep < 6 && (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/40 bg-purple-500/15 px-4 py-2 font-medium text-purple-300 hover:bg-purple-500/25 hover:border-purple-500/60 transition-all shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            {isCompleted && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/20 px-5 py-2 font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-xs"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Investigation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
