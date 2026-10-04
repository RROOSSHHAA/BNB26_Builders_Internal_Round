"use client";

import * as React from "react";
import {
  GitCompare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  X,
  Loader2,
  Terminal,
} from "lucide-react";
import { ComparisonInvestigation, ComparisonScenarioType } from "@/types";

interface NewComparisonWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveComparison: (newComparison: ComparisonInvestigation) => void;
}

export function NewComparisonWizard({
  isOpen,
  onClose,
  onSaveComparison,
}: NewComparisonWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [scenarioType, setScenarioType] =
    React.useState<ComparisonScenarioType>("successful_vs_failed");

  const [leftExecutionId, setLeftExecutionId] = React.useState<string>("EX-2048");
  const [rightExecutionId, setRightExecutionId] = React.useState<string>("EX-2042");

  // Simulation Running State
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [simStage, setSimStage] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);

  // Available candidate executions for Left & Right
  const availableExecutions = [
    {
      id: "EX-2048",
      label: "EX-2048",
      agentName: "Research Agent",
      status: "FAILED" as const,
      totalSteps: 127,
      duration: "18.4s",
      subtext: "Failed run with Step 73 validation divergence",
    },
    {
      id: "EX-2042",
      label: "EX-2042",
      agentName: "Research Agent",
      status: "SUCCESS" as const,
      totalSteps: 119,
      duration: "16.2s",
      subtext: "Nominal baseline run with validated report",
    },
    {
      id: "RP-019",
      label: "Replay #RP-019",
      agentName: "Research Agent",
      status: "SUCCESS" as const,
      totalSteps: 114,
      duration: "12.8s",
      subtext: "Checkpoint Step 70 replay with patched rule",
    },
    {
      id: "ALT-006",
      label: "Alternative #ALT-006",
      agentName: "Research Agent",
      status: "SUCCESS" as const,
      totalSteps: 118,
      duration: "14.2s",
      subtext: "Hypothetical decision branch override",
    },
    {
      id: "EX-2037",
      label: "EX-2037",
      agentName: "Recommendation Agent",
      status: "FAILED" as const,
      totalSteps: 64,
      duration: "6.2s",
      subtext: "Vector retrieval timeout failure",
    },
  ];

  const handleStartComparison = () => {
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

  const handleSave = () => {
    const leftExec =
      availableExecutions.find((e) => e.id === leftExecutionId) ||
      availableExecutions[0];
    const rightExec =
      availableExecutions.find((e) => e.id === rightExecutionId) ||
      availableExecutions[1];

    const newComparison: ComparisonInvestigation = {
      id: `cmp-${Date.now().toString().slice(-4)}`,
      title: `${leftExec.id} vs ${rightExec.id}`,
      scenarioType,
      agentName: leftExec.agentName,
      agentId: "agt_research",
      framework: "CrewAI",
      leftExecution: {
        id: leftExec.id,
        label: `${leftExec.id} (${leftExec.status})`,
        status: leftExec.status,
        totalSteps: leftExec.totalSteps,
        durationText: leftExec.duration,
      },
      rightExecution: {
        id: rightExec.id,
        label: `${rightExec.id} (${rightExec.status})`,
        status: rightExec.status,
        totalSteps: rightExec.totalSteps,
        durationText: rightExec.duration,
      },
      divergenceRegion: "Validation",
      approximateDivergenceStep: 73,
      resultSummary: "1 major divergence isolated in Validation region",
      createdAtAgo: "Just now",
      createdAt: new Date().toISOString(),
      regions: [
        {
          name: "Data Retrieval",
          leftRange: "1–28",
          leftStatus: "ok",
          leftDescription: "Normal retrieval ingestion",
          rightRange: "1–28",
          rightStatus: "ok",
          rightDescription: "Normal retrieval ingestion",
          whatChanged: {
            outputStructure: "Equivalent payload",
            latency: "Nominal",
            downstreamStatus: "Unaffected",
          },
        },
        {
          name: "Reasoning",
          leftRange: "29–61",
          leftStatus: "ok",
          leftDescription: "Reasoning synthesis completed",
          rightRange: "29–61",
          rightStatus: "ok",
          rightDescription: "Reasoning synthesis completed",
          whatChanged: {
            outputStructure: "Equivalent CoT hypothesis",
            latency: "Nominal",
            downstreamStatus: "Unaffected",
          },
        },
        {
          name: "Validation",
          leftRange: "62–78",
          leftStatus: "warn",
          leftDescription: "Anomalous validation failure",
          rightRange: "62–76",
          rightStatus: "ok",
          rightDescription: "Validated compliant schema",
          whatChanged: {
            outputStructure: "Schema error on left vs valid on right",
            latency: "+420ms delay on left",
            downstreamStatus: "Divergence point",
          },
        },
        {
          name: "Finalization",
          leftRange: "79–127",
          leftStatus: "fail",
          leftDescription: "Cascaded into loop and failed",
          rightRange: "77–119",
          rightStatus: "ok",
          rightDescription: "Report published cleanly",
          whatChanged: {
            outputStructure: "Aborted run vs published artifact",
            latency: "+2,100ms",
            downstreamStatus: "Termination delta",
          },
        },
      ],
      divergencePoint: {
        step: 73,
        stepTitle: "Response Validation",
        leftBehavior: `${leftExec.id}: Invalid structure (schema rejected)`,
        rightBehavior: `${rightExec.id}: Valid structure (schema approved)`,
        downstreamEffect: "Finalization failed on left run after retry limit",
      },
      localContext: [
        {
          step: 72,
          title: "Validation Preparation",
          leftStatus: "ok",
          rightStatus: "ok",
        },
        {
          step: 73,
          title: "Response Validation",
          leftStatus: "warn",
          rightStatus: "ok",
          leftDesc: "Invalid structure",
          rightDesc: "Valid structure",
        },
        {
          step: 74,
          title: "Finalization Preparation",
          leftStatus: "affected",
          rightStatus: "ok",
        },
      ],
      keyDifferences: [
        "Validation output differed: Left run produced an unconstrained date parameter.",
        "Left run exhibited retry delays and anomalous loops in Validation.",
        "Finalization region diverged completely, leading to left run failure.",
      ],
      downstreamImpactFlow: {
        divergenceStep: 73,
        regionName: "Validation",
        nextRegionName: "Finalization",
        leftOutcome: "FAILED (Aborted)",
        rightOutcome: "SUCCESS (Completed)",
      },
    };

    onSaveComparison(newComparison);
    onClose();
  };

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
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <GitCompare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                  New Execution Comparison
                </h3>
                <span className="rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] px-2 py-0.2">
                  Divergence Isolation
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Step {currentStep} of 3 · Compare two execution paths and locate the divergence point
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

        {/* Wizard Steps Navigation Bar */}
        <div className="grid grid-cols-3 border-b border-white/[0.06] bg-[#090d14] text-[11px]">
          {[
            { step: 1, label: "1. Select Scenario" },
            { step: 2, label: "2. Select Executions" },
            { step: 3, label: "3. Compare & Isolate" },
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
          {/* STEP 1: SELECT COMPARISON TYPE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 1 — Select Comparison Scenario
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Choose the comparative context to configure the alignment model.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    id: "successful_vs_failed",
                    title: "Successful vs Failed",
                    desc: "Compare an anomalous or failed run against a nominal baseline execution to see where it went wrong.",
                    badge: "Root Cause Diff",
                    color: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
                  },
                  {
                    id: "original_vs_replay",
                    title: "Original vs Replay",
                    desc: "Compare a recorded execution against an isolated checkpoint replay to verify if a patch converged.",
                    badge: "Simulation Check",
                    color: "border-purple-500/50 bg-purple-500/10 text-purple-300",
                  },
                  {
                    id: "original_vs_alternative",
                    title: "Original vs Alternative",
                    desc: "Compare a baseline execution against a hypothetical decision branch to analyze downstream impact.",
                    badge: "Branching Impact",
                    color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
                  },
                ].map((item) => {
                  const isSelected = scenarioType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setScenarioType(item.id as ComparisonScenarioType)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-cyan-500 bg-[#101726] shadow-lg ring-1 ring-cyan-500/40"
                          : "border-white/[0.08] bg-[#080c13] hover:border-white/20 hover:bg-[#0c1017]"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-100">
                            {item.title}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${item.color}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">
                          {isSelected ? "Selected" : "Click to select"}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT EXECUTIONS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  Step 2 — Select Executions to Compare
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pick the left execution (target/divergent) and right execution (baseline/repaired).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Execution Picker */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
                    Left Execution (Target Run)
                  </span>

                  <div className="space-y-2">
                    {availableExecutions.map((exec) => {
                      const isSelected = leftExecutionId === exec.id;
                      return (
                        <div
                          key={exec.id}
                          onClick={() => setLeftExecutionId(exec.id)}
                          className={`cursor-pointer rounded-lg border p-3 transition-all text-xs ${
                            isSelected
                              ? "border-red-500/60 bg-[#160e10] shadow-sm"
                              : "border-white/[0.07] bg-[#080c13] hover:border-white/14"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200">
                              {exec.label}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${
                                exec.status === "FAILED"
                                  ? "bg-red-500/10 text-red-300 border-red-500/25"
                                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                              }`}
                            >
                              {exec.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-zinc-400">
                            {exec.agentName} · {exec.totalSteps} steps · {exec.subtext}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Execution Picker */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    Right Execution (Baseline / Replay Run)
                  </span>

                  <div className="space-y-2">
                    {availableExecutions.map((exec) => {
                      const isSelected = rightExecutionId === exec.id;
                      return (
                        <div
                          key={exec.id}
                          onClick={() => setRightExecutionId(exec.id)}
                          className={`cursor-pointer rounded-lg border p-3 transition-all text-xs ${
                            isSelected
                              ? "border-emerald-500/60 bg-[#0e1612] shadow-sm"
                              : "border-white/[0.07] bg-[#080c13] hover:border-white/14"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200">
                              {exec.label}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${
                                exec.status === "SUCCESS"
                                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                                  : "bg-red-500/10 text-red-300 border-red-500/25"
                              }`}
                            >
                              {exec.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-zinc-400">
                            {exec.agentName} · {exec.totalSteps} steps · {exec.subtext}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COMPARE & RESULT */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {!isCompleted ? (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      Step 3 — Run Path Alignment & Divergence Analysis
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Align execution stages and locate the point where behaviors parted.
                    </p>
                  </div>

                  {isProcessing ? (
                    <div className="rounded-xl border border-cyan-500/30 bg-[#090f1d] p-5 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                        <span>Aligning Execution Trace Vectors...</span>
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
                          <span>Loading execution regions for {leftExecutionId} & {rightExecutionId}</span>
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
                          <span>Aligning sequential execution paths</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            simStage >= 3 ? "text-cyan-300 font-medium" : "text-zinc-500"
                          }`}
                        >
                          {simStage >= 3 ? (
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          )}
                          <span>Finding divergence root at Step 73</span>
                        </div>
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
                          <span>Building comparative difference summary</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.08] bg-[#080c13] p-6 text-center space-y-3">
                      <GitCompare className="h-8 w-8 text-cyan-400 mx-auto" />
                      <h5 className="text-sm font-bold text-zinc-100">
                        Ready to Compare: {leftExecutionId} vs {rightExecutionId}
                      </h5>
                      <p className="max-w-md mx-auto text-xs text-zinc-400 leading-relaxed">
                        The comparison will isolate the exact divergence step without flooding you with 100+ raw trace steps.
                      </p>
                      <button
                        onClick={handleStartComparison}
                        className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/20 px-5 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/30 transition-all shadow-md"
                      >
                        <GitCompare className="h-4 w-4" />
                        <span>Compare Executions</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* COMPARISON SUCCESS RESULT STATE */
                <div className="space-y-5">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        DIVERGENCE ISOLATED
                      </span>
                      <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 font-bold">
                        Validation (Step 73)
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Comparison completed between <strong>{leftExecutionId}</strong> and{" "}
                      <strong>{rightExecutionId}</strong>. Executions performed identically through Steps 1–72 before diverging at Step 73 (Response Validation).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-red-500/30 bg-[#080c13] p-3 space-y-1">
                      <span className="text-[10px] text-red-400 uppercase font-bold block">
                        LEFT EXECUTION
                      </span>
                      <div className="text-zinc-200 font-semibold">{leftExecutionId} (FAILED)</div>
                      <p className="text-[11px] text-zinc-400">
                        Invalid structure at Step 73 cascaded into 16 hallucinated retry loops.
                      </p>
                    </div>

                    <div className="rounded-lg border border-emerald-500/30 bg-[#080c13] p-3 space-y-1">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                        RIGHT EXECUTION
                      </span>
                      <div className="text-zinc-200 font-semibold">{rightExecutionId} (SUCCESS)</div>
                      <p className="text-[11px] text-zinc-400">
                        Compliant schema format allowed finalization region to publish report.
                      </p>
                    </div>
                  </div>
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
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3)}
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
              {isCompleted ? "Close" : "Cancel"}
            </button>

            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1) as 1 | 2 | 3)}
                className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/15 px-4 py-2 font-medium text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-500/60 transition-all shadow-xs"
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
                <span>Save Comparison to History</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
