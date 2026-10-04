"use client";

import * as React from "react";
import { TraceStep } from "@/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Code2,
  Clock,
  Zap,
  Flame,
  FileJson,
} from "lucide-react";

interface StepContextViewerProps {
  selectedStepNumber: number;
  onSelectStep: (stepNumber: number) => void;
  className?: string;
}

export function StepContextViewer({
  selectedStepNumber = 73,
  onSelectStep,
  className,
}: StepContextViewerProps) {
  // Collapsible sections for Step 73 detail
  const [showInput, setShowInput] = React.useState(false);
  const [showOutput, setShowOutput] = React.useState(true);
  const [showMetadata, setShowMetadata] = React.useState(false);

  const localSteps = [
    {
      stepNumber: 72,
      title: "Reasoning",
      status: "SUCCESS",
      statusVariant: "success",
      latency: "240ms",
      type: "Thought / Synthesis",
      inputSummary: "Reconcile balance sheet variance against inferred margins",
      outputSummary: "Drafted preliminary reconciliation matrix",
      confidence: "98%",
      details: {
        action: "reconcile_variance",
        scope: "automotive_excluding_credits",
      },
    },
    {
      stepNumber: 73,
      title: "Response Validation",
      status: "ANOMALOUS",
      statusVariant: "anomaly",
      latency: "420ms",
      type: "Validation",
      inputSummary: "Structured model response",
      outputSummary: "Validation mismatch",
      confidence: "91%",
      details: {
        metric: "GAAP_AUTOMOTIVE_GROSS_MARGIN",
        reported_value: "18.2%",
        tolerance: "±0.5%",
      },
      outputDetails: {
        validation_status: "FAILED",
        discrepancy: "Calculated margin (18.2%) deviates significantly from peer consensus benchmark (16.4%)",
        root_indicator: "Pre-cutoff training bias detected in numerical reasoning",
      },
      metadata: {
        model: "claude-3-7-sonnet",
        detector: "blackbox_statistical_divergence_v2",
        historicalBaselineWindow: "28 past executions",
      },
    },
    {
      stepNumber: 74,
      title: "Finalization Preparation",
      status: "AFFECTED",
      statusVariant: "affected",
      latency: "310ms",
      type: "Synthesis",
      inputSummary: "Propagate validation delta into output table",
      outputSummary: "Emitted corrupted output payload downstream",
      confidence: "74%",
      details: {
        upstream_step: 73,
        error_propagation: "critical",
      },
    },
  ];

  const activeStep =
    localSteps.find((s) => s.stepNumber === selectedStepNumber) || localSteps[1];

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              STEP CONTEXT
            </span>
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              Immediate Local Window
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Localized step transitions surrounding the primary divergence root.
          </p>
        </div>

        <span className="text-[11px] font-mono text-zinc-500">
          Showing 3 Local Steps (72 → 73 → 74)
        </span>
      </div>

      {/* 3 Step Flow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {localSteps.map((s, idx) => {
          const isSelected = s.stepNumber === activeStep.stepNumber;
          const isAnomalous = s.statusVariant === "anomaly";
          const isAffected = s.statusVariant === "affected";
          const isSuccess = s.statusVariant === "success";

          return (
            <button
              key={s.stepNumber}
              type="button"
              onClick={() => onSelectStep(s.stepNumber)}
              className={cn(
                "group text-left p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[104px]",
                isSelected
                  ? isAnomalous
                    ? "border-red-500/80 bg-red-950/30 shadow-[0_0_18px_rgba(239,68,68,0.2)] ring-1 ring-red-500/60"
                    : isAffected
                    ? "border-amber-500/80 bg-amber-950/20 shadow-[0_0_18px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50"
                    : "border-cyan-500/80 bg-cyan-950/20 ring-1 ring-cyan-500/50"
                  : isAnomalous
                  ? "border-red-500/30 bg-red-500/[0.05] hover:border-red-500/50"
                  : isAffected
                  ? "border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-500/40"
                  : "border-white/[0.06] bg-[#0c1017] hover:border-white/15"
              )}
            >
              {/* Top Row: Step Number & Status */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  STEP {s.stepNumber}
                </span>

                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase",
                    isAnomalous
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : isAffected
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  )}
                >
                  {s.status}
                </span>
              </div>

              {/* Title */}
              <div className="my-1.5">
                <span
                  className={cn(
                    "text-xs font-bold font-mono tracking-tight block truncate",
                    isSelected ? "text-white" : "text-zinc-200"
                  )}
                >
                  {s.title}
                </span>
              </div>

              {/* Bottom: Latency & Click CTA */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/[0.04]">
                <span>{s.latency}</span>
                <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Panel (e.g. Step 73) */}
      <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#070a0f] space-y-4">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-lg border ${
                activeStep.statusVariant === "anomaly"
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : activeStep.statusVariant === "affected"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <Zap className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold font-mono text-white">
                  Step {activeStep.stepNumber} — {activeStep.title}
                </h4>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    activeStep.statusVariant === "anomaly"
                      ? "bg-red-500/20 text-red-300"
                      : activeStep.statusVariant === "affected"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {activeStep.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block">Latency</span>
              <span className="font-bold text-zinc-200">{activeStep.latency}</span>
            </div>
            <div className="pl-3 border-l border-white/[0.08]">
              <span className="text-zinc-500 text-[10px] uppercase block">Confidence</span>
              <span className="font-bold text-red-400">{activeStep.confidence}</span>
            </div>
          </div>
        </div>

        {/* Step Metadata Summary Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#0b0f17]">
            <span className="text-[10px] text-zinc-500 uppercase block">Step Type</span>
            <span className="text-zinc-200 font-semibold mt-0.5 block">{activeStep.type}</span>
          </div>

          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#0b0f17]">
            <span className="text-[10px] text-zinc-500 uppercase block">Input Summary</span>
            <span className="text-zinc-200 font-semibold mt-0.5 block truncate">
              {activeStep.inputSummary}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#0b0f17]">
            <span className="text-[10px] text-zinc-500 uppercase block">Output Summary</span>
            <span
              className={`font-semibold mt-0.5 block truncate ${
                activeStep.statusVariant === "anomaly"
                  ? "text-red-300"
                  : "text-zinc-200"
              }`}
            >
              {activeStep.outputSummary}
            </span>
          </div>
        </div>

        {/* Collapsible Sections for Input / Output / Metadata */}
        <div className="space-y-2 pt-2">
          {/* Collapsible Input */}
          <div className="rounded-lg border border-white/[0.06] bg-[#0b0f17] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowInput(!showInput)}
              className="flex items-center justify-between w-full p-2.5 px-3 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Input Payload
                </span>
                <span className="text-[10px] text-zinc-500">
                  (Structured model response)
                </span>
              </div>
              {showInput ? (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </button>

            {showInput && (
              <div className="p-3 border-t border-white/[0.04] bg-black/40 text-xs font-mono text-zinc-300 overflow-x-auto">
                <pre>{JSON.stringify(activeStep.details, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Collapsible Output */}
          <div className="rounded-lg border border-white/[0.06] bg-[#0b0f17] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOutput(!showOutput)}
              className="flex items-center justify-between w-full p-2.5 px-3 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileJson className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Output Result
                </span>
                <span
                  className={`text-[10px] ${
                    activeStep.statusVariant === "anomaly"
                      ? "text-red-400 font-semibold"
                      : "text-zinc-500"
                  }`}
                >
                  ({activeStep.outputSummary})
                </span>
              </div>
              {showOutput ? (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </button>

            {showOutput && (
              <div className="p-3 border-t border-white/[0.04] bg-black/40 text-xs font-mono text-zinc-300 overflow-x-auto">
                <pre>
                  {JSON.stringify(
                    activeStep.outputDetails || activeStep.details,
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>

          {/* Collapsible Metadata */}
          <div className="rounded-lg border border-white/[0.06] bg-[#0b0f17] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center justify-between w-full p-2.5 px-3 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Step Metadata
                </span>
                <span className="text-[10px] text-zinc-500">(Execution context)</span>
              </div>
              {showMetadata ? (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </button>

            {showMetadata && (
              <div className="p-3 border-t border-white/[0.04] bg-black/40 text-xs font-mono text-zinc-300 overflow-x-auto">
                <pre>
                  {JSON.stringify(
                    activeStep.metadata || {
                      stepId: `stp_0${activeStep.stepNumber}`,
                      executionTimeMs: activeStep.latency,
                      caller: "agent_orchestrator",
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
