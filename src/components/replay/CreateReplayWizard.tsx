"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
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
  Sliders,
  Check,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReplayInvestigation, ReplayModificationType, Execution } from "@/types";
import { CheckpointFlowIndicator } from "./CheckpointFlowIndicator";
import { OriginalVsReplayMap } from "./OriginalVsReplayMap";
import { DirectModelFixAndDownloadBox } from "./DirectModelFixAndDownloadBox";
import { SafetyNotice } from "./SafetyNotice";

interface CreateReplayWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteReplay: (newReplay: ReplayInvestigation) => void;
  initialExecutionId?: string;
}

export function CreateReplayWizard({
  isOpen,
  onClose,
  onCompleteReplay,
  initialExecutionId,
}: CreateReplayWizardProps) {
  const router = useRouter();
  // Wizard Steps: 1: Select Exec, 2: Select Checkpoint, 3: Local Context, 4: Modify, 5: Preview & Run
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3 | 4 | 5>(1);

  // Configuration State
  const [selectedExecutionId, setSelectedExecutionId] = React.useState<string>(
    initialExecutionId || "EX-2048"
  );

  React.useEffect(() => {
    if (initialExecutionId) {
      setSelectedExecutionId(initialExecutionId);
    }
  }, [initialExecutionId]);
  const [selectedCheckpoint, setSelectedCheckpoint] = React.useState<number>(70);
  const [selectedTargetStep, setSelectedTargetStep] = React.useState<number>(73);
  const [modificationType, setModificationType] =
    React.useState<ReplayModificationType>("validation_rule");

  const defaultOriginalJson = JSON.stringify(
    {
      valid: false,
      error: "ValidationError: date_window out of expected bounds",
      timestamp: "2026-10-04T09:42:00Z",
    },
    null,
    2
  );

  const defaultAlternativeJson = JSON.stringify(
    {
      valid: true,
      override_rule: "clamp_datetime_bounds",
      normalized_output: { status: "VALID", confidence: 0.98 },
    },
    null,
    2
  );

  const [alternativeJson, setAlternativeJson] = React.useState<string>(defaultAlternativeJson);
  const [isJsonApplied, setIsJsonApplied] = React.useState<boolean>(true);

  // Simulation Running State
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const [simStage, setSimStage] = React.useState<number>(0);
  const [isComplete, setIsComplete] = React.useState<boolean>(false);

  // Available Executions
  const mockAvailableExecutions = [
    {
      id: "EX-2048",
      agentName: "Research Agent",
      framework: "CrewAI",
      totalSteps: 127,
      status: "FAILED",
      reason: "Step 73 Validation Divergence",
      regions: [
        { name: "Data Retrieval", range: "1–28" },
        { name: "Reasoning", range: "29–61" },
        { name: "Validation", range: "62–78" },
        { name: "Finalization", range: "79–127" },
      ],
    },
    {
      id: "EX-2037",
      agentName: "Recommendation Agent",
      framework: "LangChain",
      totalSteps: 64,
      status: "FAILED",
      reason: "Step 41 Retrieval Timeout",
      regions: [
        { name: "Retrieval", range: "1–22" },
        { name: "Vector Search", range: "23–44" },
        { name: "Ranking", range: "45–64" },
      ],
    },
    {
      id: "EX-2044",
      agentName: "Customer Support Agent",
      framework: "AutoGen",
      totalSteps: 82,
      status: "FAILED",
      reason: "Step 41 Tool Schema Parameter Mismatch",
      regions: [
        { name: "Intent Classification", range: "1–24" },
        { name: "Account Query", range: "25–45" },
        { name: "Resolution", range: "46–82" },
      ],
    },
  ];

  const activeExecution =
    mockAvailableExecutions.find((e) => e.id === selectedExecutionId) ||
    mockAvailableExecutions[0];

  // Local context steps for Step 3
  const localContextSteps = [
    {
      step: 70,
      title: "Reasoning Synthesis",
      region: "Reasoning",
      status: "NORMAL",
      desc: "Synthesized 4 multi-source research inputs into draft market hypotheses.",
    },
    {
      step: 71,
      title: "Response Preparation",
      region: "Reasoning",
      status: "NORMAL",
      desc: "Structured drafted hypotheses into schema payload.",
    },
    {
      step: 72,
      title: "Validation Preparation",
      region: "Validation",
      status: "NORMAL",
      desc: "Loaded schema validator and datetime bounds ruleset.",
    },
    {
      step: 73,
      title: "Response Validation",
      region: "Validation",
      status: "SUSPICIOUS",
      desc: "Validation failed: date_window parameter exceeded schema tolerance bounds.",
    },
  ];

  // Simulate replay execution progression
  const handleRunReplay = () => {
    setIsSimulating(true);
    setSimStage(1);

    setTimeout(() => setSimStage(2), 700);
    setTimeout(() => setSimStage(3), 1500);
    setTimeout(() => setSimStage(4), 2200);
    setTimeout(() => {
      setIsSimulating(false);
      setIsComplete(true);
    }, 2800);
  };

  const handleFinishAndSave = React.useCallback(() => {
    const ts = Date.now();
    const newReplay: ReplayInvestigation = {
      id: `rpl-${ts.toString().slice(-4)}`,
      agentName: activeExecution.agentName,
      agentId: "agt_research",
      framework: activeExecution.framework,
      originalExecutionId: activeExecution.id,
      totalSteps: activeExecution.totalSteps,
      checkpointStep: selectedCheckpoint,
      modifiedStep: selectedTargetStep,
      modifiedStepTitle: "Response Validation",
      modificationType,
      originalResult: "FAILED",
      replayResult: "SUCCESS",
      status: "completed",
      createdAtAgo: "Just now",
      createdAt: new Date().toISOString(),
      stepsReused: selectedCheckpoint,
      stepsReplayed: activeExecution.totalSteps - selectedCheckpoint,
      downstreamAffectedSteps: activeExecution.totalSteps - selectedTargetStep,
      outcomeSummary: "Alternative path completed successfully with patched validation rule.",
      whatChanged: `Step ${selectedTargetStep} validation rule patched to clamp datetime window`,
      downstreamEffect: `Finalization region (${selectedCheckpoint + 1}–${activeExecution.totalSteps}) successfully recovered`,
      finalResultText: "Failed → Successful",
      originalPayloadSnippet: defaultOriginalJson,
      modifiedPayloadSnippet: alternativeJson,
      originalRegions: [
        { name: "Retrieval", range: "1–28", status: "ok" },
        { name: "Reasoning", range: "29–61", status: "ok" },
        { name: "Validation", range: "62–78", status: "warn" },
        { name: "Finalization", range: "79–127", status: "fail" },
      ],
      replayRegions: [
        { name: "Retrieval", range: "1–28", status: "ok" },
        { name: "Reasoning", range: "29–61", status: "ok" },
        { name: "Validation", range: "62–78", status: "ok" },
        { name: "Finalization", range: "79–127", status: "ok" },
      ],
    };

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("blackbox_custom_replays") || "[]");
        localStorage.setItem("blackbox_custom_replays", JSON.stringify([newReplay, ...stored]));

        // Log audit event to History
        const acts = JSON.parse(localStorage.getItem("blackbox_custom_activities") || "[]");
        const newAct = {
          id: `act_${Date.now()}`,
          title: `Sandbox Replay Succeeded: ${activeExecution.id}`,
          description: `Deterministic state fork recovered Step ${selectedTargetStep} (Validation Divergence). Full execution healed.`,
          category: "replay",
          timestamp: new Date().toISOString(),
          group: "today",
          actor: "Lead SRE",
          executionId: activeExecution.id,
        };
        localStorage.setItem("blackbox_custom_activities", JSON.stringify([newAct, ...acts]));
      } catch {}
    }

    onCompleteReplay(newReplay);
    onClose();
  }, [
    activeExecution,
    alternativeJson,
    defaultOriginalJson,
    modificationType,
    onClose,
    onCompleteReplay,
    selectedCheckpoint,
    selectedTargetStep,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1017] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#080c13]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Play className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100 font-mono tracking-tight">
                  Checkpoint Replay Simulator
                </h3>
                <span className="rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono px-2 py-0.2">
                  Isolated Sandbox
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Step {currentStep} of 5 · Fork from checkpoint & simulate alternative outcome
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

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 border-b border-white/[0.06] bg-[#090d14] text-[11px] font-mono">
          {[
            { step: 1, label: "1. Select Run" },
            { step: 2, label: "2. Checkpoint" },
            { step: 3, label: "3. Context" },
            { step: 4, label: "4. Modify" },
            { step: 5, label: "5. Simulate" },
          ].map((s) => (
            <div
              key={s.step}
              className={`py-2 text-center transition-colors border-r last:border-r-0 border-white/[0.04] flex items-center justify-center gap-1 ${
                currentStep === s.step
                  ? "bg-cyan-500/10 text-cyan-300 font-semibold border-b-2 border-b-cyan-400"
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
                <h4 className="text-sm font-semibold font-mono text-zinc-100">
                  Select Target Execution
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Choose a failed agent execution to investigate with a checkpoint replay.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {mockAvailableExecutions.map((exec) => {
                  const isSelected = selectedExecutionId === exec.id;
                  return (
                    <div
                      key={exec.id}
                      onClick={() => setSelectedExecutionId(exec.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-cyan-500/60 bg-[#101726] shadow-md"
                          : "border-white/[0.08] bg-[#080c13] hover:border-white/[0.16] hover:bg-[#0c1017]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-500 text-black"
                                : "border-zinc-600"
                            }`}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold font-mono text-zinc-100">
                                {exec.agentName}
                              </span>
                              <span className="text-xs font-mono text-zinc-400">
                                {exec.id}
                              </span>
                              <span className="rounded bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                                {exec.framework}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                              {exec.totalSteps} steps · {exec.reason}
                            </p>
                          </div>
                        </div>

                        <span className="rounded px-2 py-0.5 text-[10px] font-mono border border-red-500/30 bg-red-500/10 text-red-300">
                          {exec.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT CHECKPOINT */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold font-mono text-zinc-100">
                  Select Checkpoint for {activeExecution.id}
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Replay will freeze and reuse execution state up to the chosen checkpoint.
                </p>
              </div>

              {/* Compressed Execution Map */}
              <div className="rounded-xl border border-white/[0.08] bg-[#080c13] p-4 space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-400 block">
                  Compressed Execution Map
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {activeExecution.regions.map((reg, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-white/[0.06] bg-[#0c1017] p-2.5"
                    >
                      <div className="font-semibold text-zinc-200">{reg.name}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        Steps {reg.range}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkpoint Selection Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-300">
                  Recommended Checkpoint:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { step: 70, label: "Step 70 (Pre-Validation Anchor)", rec: true },
                    { step: 62, label: "Step 62 (Validation Start)", rec: false },
                    { step: 55, label: "Step 55 (Late Reasoning)", rec: false },
                  ].map((cp) => (
                    <button
                      key={cp.step}
                      onClick={() => setSelectedCheckpoint(cp.step)}
                      className={`rounded-lg border p-3 text-left font-mono text-xs transition-all ${
                        selectedCheckpoint === cp.step
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-xs"
                          : "border-white/[0.08] bg-[#080c13] text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Step {cp.step}</span>
                        {cp.rec && (
                          <span className="rounded bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0.2">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        {cp.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* State Reused Notice Callout */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-xs font-mono text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  Replay will reuse execution state for Steps 1 → {selectedCheckpoint}.
                  Zero rerun latency or tokens required for previous steps.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: LOCAL CONTEXT */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold font-mono text-zinc-100">
                  Inspect Local Context Around Step {selectedCheckpoint}
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Select which downstream step you wish to modify in this replay branch.
                </p>
              </div>

              <div className="space-y-2.5">
                {localContextSteps.map((step) => {
                  const isTarget = selectedTargetStep === step.step;
                  const isSuspicious = step.status === "SUSPICIOUS";

                  return (
                    <div
                      key={step.step}
                      onClick={() => setSelectedTargetStep(step.step)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all font-mono ${
                        isTarget
                          ? "border-amber-500/60 bg-[#161208] shadow-xs"
                          : "border-white/[0.07] bg-[#080c13] hover:border-white/[0.14]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-zinc-200">
                            Step {step.step}
                          </span>
                          <span className="text-xs text-zinc-400">•</span>
                          <span className="text-xs font-semibold text-zinc-100">
                            {step.title}
                          </span>
                          <span className="rounded bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.2 text-[10px] text-zinc-400">
                            {step.region}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-medium border ${
                              isSuspicious
                                ? "bg-red-500/10 text-red-300 border-red-500/30"
                                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                            }`}
                          >
                            {step.status}
                          </span>
                          {isTarget && (
                            <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5">
                              Target for Modification
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: MODIFICATION PANEL */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold font-mono text-zinc-100">
                  Modify Step {selectedTargetStep} — Response Validation
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Specify the hypothetical input, instruction, or rule alteration to test.
                </p>
              </div>

              {/* Modification Type Selector */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-400 block mb-2">
                  Modification Type
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { id: "validation_rule", label: "Change Validation Rule" },
                    { id: "input", label: "Change Input" },
                    { id: "instruction", label: "Change Instruction" },
                    { id: "output", label: "Use Alternative Output" },
                    { id: "simulated_result", label: "Simulate Corrected Result" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setModificationType(t.id as ReplayModificationType)}
                      className={`rounded-md border p-2.5 text-left transition-all ${
                        modificationType === t.id
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-200 font-medium"
                          : "border-white/[0.08] bg-[#080c13] text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* JSON Payload Diff Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Original Step {selectedTargetStep} Output</span>
                    <span className="text-red-400 text-[10px]">FAILED RESULT</span>
                  </div>
                  <pre className="rounded-lg border border-red-500/20 bg-[#05080f] p-3 text-[11px] font-mono text-red-200/90 h-44 overflow-auto scrollbar-thin">
                    {defaultOriginalJson}
                  </pre>
                </div>

                {/* Alternative */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Alternative / Corrected Payload</span>
                    <span className="text-emerald-400 text-[10px]">EDITABLE</span>
                  </div>
                  <textarea
                    value={alternativeJson}
                    onChange={(e) => {
                      setAlternativeJson(e.target.value);
                      setIsJsonApplied(false);
                    }}
                    rows={7}
                    className="w-full rounded-lg border border-emerald-500/40 bg-[#05080f] p-3 text-[11px] font-mono text-emerald-200/90 focus:outline-hidden focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 h-44 scrollbar-thin"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => {
                    setAlternativeJson(defaultAlternativeJson);
                    setIsJsonApplied(true);
                  }}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset to Default Alternative</span>
                </button>

                <button
                  onClick={() => setIsJsonApplied(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all ${
                    isJsonApplied
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-cyan-500/40 bg-cyan-500/20 text-cyan-200"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isJsonApplied ? "Change Applied" : "Apply Change"}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REPLAY PREVIEW & SIMULATION */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {!isComplete ? (
                <>
                  <div>
                    <h4 className="text-sm font-semibold font-mono text-zinc-100">
                      Replay Preview & Simulation
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      Confirm replay parameters and simulate alternative execution path.
                    </p>
                  </div>

                  {/* Checkpoint Flow Visualizer */}
                  <CheckpointFlowIndicator
                    checkpointStep={selectedCheckpoint}
                    modifiedStep={selectedTargetStep}
                    totalSteps={activeExecution.totalSteps}
                    stepsReused={selectedCheckpoint}
                    stepsReplayed={activeExecution.totalSteps - selectedCheckpoint}
                  />

                  {/* Summary parameters card */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#080c13] p-4 text-xs font-mono space-y-2">
                    <div className="flex justify-between text-zinc-400">
                      <span>Source Execution:</span>
                      <span className="text-zinc-100 font-medium">
                        {activeExecution.agentName} ({activeExecution.id})
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Checkpoint Anchor:</span>
                      <span className="text-emerald-400 font-medium">
                        Step {selectedCheckpoint}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Target Modification:</span>
                      <span className="text-amber-300 font-medium">
                        Step {selectedTargetStep} ({modificationType})
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Execution Reused:</span>
                      <span className="text-emerald-400 font-medium">
                        Steps 1 → {selectedCheckpoint} (Zero Rerun)
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Steps to Replay:</span>
                      <span className="text-cyan-300 font-medium">
                        Steps {selectedCheckpoint + 1} → {activeExecution.totalSteps} (
                        {activeExecution.totalSteps - selectedCheckpoint} steps)
                      </span>
                    </div>
                  </div>

                  <SafetyNotice />

                  {/* Simulation Progress States - 5 Explicit Sandbox Stages */}
                  {isSimulating && (
                    <div className="rounded-xl border border-cyan-500/30 bg-[#090f1d] p-5 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
                        <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                          <span>Isolated Sandbox Replay Pipeline</span>
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          Original {activeExecution.id} Immutable
                        </span>
                      </div>

                      <div className="space-y-2.5 pl-2">
                        {/* 1. Sandbox Created */}
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
                          <span>
                            <strong>1. Sandbox Created</strong> — Ephemeral container initialized; original {activeExecution.id} frozen
                          </span>
                        </div>

                        {/* 2. Replay Running */}
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
                          <span>
                            <strong>2. Replay Running</strong> — Restoring checkpoint memory registers from Step {selectedCheckpoint}
                          </span>
                        </div>

                        {/* 3. Correction Applied */}
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 3 ? "text-cyan-300 font-medium" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 3 ? (
                            <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>
                            <strong>3. Correction Applied</strong> — Patched intermediate rule injected at Step {selectedTargetStep}
                          </span>
                        </div>

                        {/* 4. Verification */}
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 4 ? "text-purple-300" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 4 ? (
                            <Check className="h-3.5 w-3.5 text-purple-300 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>
                            <strong>4. Verification</strong> — Validating downstream state convergence against nominal baseline
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* REPLAY COMPLETE RESULT STATE */
                <div className="space-y-6">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] p-4 text-xs font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        REPLAY COMPLETE
                      </span>
                      <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 font-semibold">
                        Alternative Path Converged
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Original: <strong className="text-red-400">FAILED</strong> → Replay:{" "}
                      <strong className="text-emerald-400">SUCCESS</strong>.
                      Downstream affected: 54 steps. Alternative execution completed without
                      temporal divergence cascade.
                    </p>
                  </div>

                  <OriginalVsReplayMap
                    originalRegions={[
                      { name: "Retrieval", range: "1–28", status: "ok" },
                      { name: "Reasoning", range: "29–61", status: "ok" },
                      { name: "Validation", range: "62–78", status: "warn" },
                      { name: "Finalization", range: "79–127", status: "fail" },
                    ]}
                    replayRegions={[
                      { name: "Retrieval", range: "1–28", status: "ok" },
                      { name: "Reasoning", range: "29–61", status: "ok" },
                      { name: "Validation", range: "62–78", status: "ok" },
                      { name: "Finalization", range: "79–127", status: "ok" },
                    ]}
                    whatChanged={`Step ${selectedTargetStep} validation rule patched to clamp datetime window and allow valid structured JSON`}
                    downstreamEffect={`Finalization region (Steps ${selectedCheckpoint + 1}–${activeExecution.totalSteps}) fully recovered`}
                    finalResultText="Failed → Successful"
                    originalResult="FAILED"
                    replayResult="SUCCESS"
                  />

                  {/* Direct Model Hotpatch & Verified Artifact Download Center */}
                  <DirectModelFixAndDownloadBox
                    replay={{
                      id: `RP-${Date.now().toString().slice(-4)}`,
                      agentName: activeExecution.agentName,
                      agentId: activeExecution.agentName,
                      framework: activeExecution.framework,
                      originalExecutionId: activeExecution.id,
                      totalSteps: activeExecution.totalSteps,
                      checkpointStep: selectedCheckpoint,
                      modifiedStep: selectedTargetStep,
                      modifiedStepTitle: `Patch rule for Step ${selectedTargetStep}`,
                      modificationType: modificationType,
                      originalResult: "FAILED",
                      replayResult: "SUCCESS",
                      status: "completed",
                      createdAtAgo: "Just now",
                      createdAt: new Date().toISOString(),
                      stepsReused: selectedCheckpoint,
                      stepsReplayed: activeExecution.totalSteps - selectedCheckpoint,
                      downstreamAffectedSteps: 54,
                      outcomeSummary: `Step ${selectedTargetStep} validation rule patched and alternative path converged successfully.`,
                      originalPayloadSnippet: defaultOriginalJson,
                      modifiedPayloadSnippet: alternativeJson,
                      originalRegions: [
                        { name: "Retrieval", range: "1–28", status: "ok" },
                        { name: "Reasoning", range: "29–61", status: "ok" },
                        { name: "Validation", range: "62–78", status: "warn" },
                        { name: "Finalization", range: "79–127", status: "fail" },
                      ],
                      replayRegions: [
                        { name: "Retrieval", range: "1–28", status: "ok" },
                        { name: "Reasoning", range: "29–61", status: "ok" },
                        { name: "Validation", range: "62–78", status: "ok" },
                        { name: "Finalization", range: "79–127", status: "ok" },
                      ],
                      whatChanged: `Step ${selectedTargetStep} validation rule patched to clamp datetime window and allow valid structured JSON`,
                      downstreamEffect: `Finalization region (Steps ${selectedCheckpoint + 1}–${activeExecution.totalSteps}) fully recovered`,
                      finalResultText: "Failed → Successful",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#080c13] font-mono text-xs">
          <div>
            {currentStep > 1 && !isSimulating && !isComplete && (
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4 | 5)}
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
              Cancel
            </button>

            {currentStep < 5 && (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1) as 1 | 2 | 3 | 4 | 5)}
                className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            {currentStep === 5 && !isComplete && (
              <button
                disabled={isSimulating}
                onClick={handleRunReplay}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-5 py-2 font-bold text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/60 transition-all shadow-xs disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Simulating...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Run Replay</span>
                  </>
                )}
              </button>
            )}

            {isComplete && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleFinishAndSave}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/20 transition-all"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Investigation</span>
                </button>

                <button
                  onClick={() => {
                    handleFinishAndSave();
                    router.push(`/dashboard/comparisons?target=${activeExecution.id}&baseline=EX-2047`);
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md"
                >
                  <span>Compare with Golden Run</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
