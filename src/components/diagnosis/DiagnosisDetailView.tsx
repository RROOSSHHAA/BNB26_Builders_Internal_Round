"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Diagnosis } from "@/types";
import { DiagnosisConfidenceGauge } from "./DiagnosisConfidenceGauge";
import { DiagnosisEvidenceSignals } from "./DiagnosisEvidenceSignals";
import { ExecutionDivergenceMap } from "./ExecutionDivergenceMap";
import { StepContextViewer } from "@/components/execution/detail/StepContextViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  AlertTriangle,
  Flame,
  SearchAlert,
  Play,
  GitFork,
  ExternalLink,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
  Terminal,
} from "lucide-react";

interface DiagnosisDetailViewProps {
  diagnosis: Diagnosis;
  omitFullWidthSections?: boolean;
}

export function DiagnosisDetailView({
  diagnosis,
  omitFullWidthSections = false,
}: DiagnosisDetailViewProps) {
  const router = useRouter();
  const [selectedStepNumber, setSelectedStepNumber] = React.useState<number>(
    diagnosis.suspiciousStepNumber || 73
  );
  const [activeModal, setActiveModal] = React.useState<
    "investigate" | "replay" | "compare" | null
  >(null);

  const confidencePercent = Math.round(diagnosis.confidenceScore * 100);

  return (
    <div className="space-y-6">
      {/* 1. FAILURE DIAGNOSIS HEADER */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 sm:p-6 space-y-4 relative overflow-hidden font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-400 font-semibold">
                FAILURE DIAGNOSIS
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span className="text-[11px] font-sans text-zinc-400">
                {diagnosis.agentName} ({diagnosis.framework || "Agent"})
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Execution {diagnosis.executionId}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                FAILED
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-medium">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>{diagnosis.modelVersion || "Diagnosis Model v2.0 - Causal Graph Net"}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/executions/${diagnosis.executionId}`}>
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-xs border-white/10 text-zinc-300 hover:bg-white/[0.05]"
              >
                <span>View Full Execution</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Likely Problematic Step Highlight Banner */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#141824] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-wider text-rose-300 font-semibold block">
              LIKELY PROBLEMATIC STEP
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold font-sans text-white">
                STEP {diagnosis.suspiciousStepNumber || 73} — {diagnosis.suspiciousStepTitle || "Response Validation"}
              </h2>
            </div>
            <p className="text-xs text-zinc-300 font-sans mt-0.5">
              {diagnosis.failureCategory || "Validation"} anomaly •{" "}
              <span className="text-zinc-400">
                {diagnosis.subcategory || "Incorrect Intermediate Decision"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold font-sans text-rose-400 block">
                {confidencePercent}%
              </span>
              <span className="text-[10px] font-sans uppercase text-zinc-400 block">
                Failure Likelihood
              </span>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Flame className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Concise Diagnosis Explanation Card */}
        <div className="p-4 rounded-lg border border-white/[0.06] bg-[#090d14]">
          <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 block mb-1">
            Concise Root-Cause Summary
          </span>
          <p className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed">
            &ldquo;{diagnosis.explanation}&rdquo;
          </p>
        </div>
      </div>

      {/* 2. EVIDENCE & CONFIDENCE ROW (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Why This Step? Structured Observations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <div className="flex items-center gap-2">
                <SearchAlert className="h-4 w-4 text-zinc-400" />
                <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-300 font-semibold">
                  WHY THIS STEP?
                </span>
              </div>
              <span className="text-[10px] font-sans text-zinc-500">Structured Observations</span>
            </div>

            <div className="space-y-3">
              {diagnosis.evidence.map((obs, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-white/[0.05] bg-[#0c1017] flex items-start gap-3"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-zinc-200 border border-white/[0.08] text-[11px] font-mono font-bold shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <div className="text-xs font-sans text-zinc-300 leading-relaxed">
                    {obs}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[10px] font-sans text-zinc-500 flex items-center gap-1.5">
              <Info className="h-3 w-3 text-zinc-500 shrink-0" />
              <span>Diagnostic observations grounded in statistical deviation telemetry.</span>
            </div>
          </div>

          {/* Local Step Context Viewer */}
          <StepContextViewer
            selectedStepNumber={selectedStepNumber}
            onSelectStep={(num) => setSelectedStepNumber(num)}
          />
        </div>

        {/* Right: Confidence Gauge, Evidence Signals & Downstream Impact */}
        <div className="lg:col-span-5 space-y-6">
          {/* Confidence Visualization */}
          <DiagnosisConfidenceGauge
            score={diagnosis.confidenceScore}
            label={diagnosis.confidenceLabel || "High confidence"}
          />

          {/* Evidence Signals Meter */}
          <DiagnosisEvidenceSignals signals={diagnosis.evidenceSignals} />

          {/* Downstream Impact Panel */}
          <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5">
              <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-300 font-semibold">
                DOWNSTREAM IMPACT
              </span>
              <span className="text-[10px] font-sans text-zinc-500">Cascade Evaluation</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg border border-white/[0.04] bg-[#0c1017]">
                <span className="text-[10px] text-zinc-500 uppercase block font-sans">Affected Region</span>
                <span className="text-sm font-bold text-zinc-100 mt-0.5 block font-sans">
                  {diagnosis.downstreamImpact?.affectedRegionsCount || 1} Region
                </span>
                <span className="text-[10px] text-zinc-500 font-sans">Finalization</span>
              </div>

              <div className="p-3 rounded-lg border border-white/[0.04] bg-[#0c1017]">
                <span className="text-[10px] text-zinc-500 uppercase block font-sans">Affected Steps</span>
                <span className="text-sm font-bold text-rose-400 mt-0.5 block font-sans">
                  {diagnosis.downstreamImpact?.affectedStepsCount || 49} Steps
                </span>
                <span className="text-[10px] text-zinc-500 font-sans">Corrupted synthesis</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed pt-1">
              {diagnosis.downstreamImpact?.description ||
                "Final response marked invalid; execution ended unsuccessfully without client payload delivery."}
            </p>
          </div>
        </div>
      </div>

      {/* 3. EXECUTION DIVERGENCE & NEXT STEPS (only when not rendered full-width by parent) */}
      {!omitFullWidthSections && (
        <>
          <ExecutionDivergenceMap
            failedExecutionId={diagnosis.executionId}
            divergenceStep={diagnosis.suspiciousStepNumber || 73}
            divergenceRegion={diagnosis.affectedRegionName || "Validation"}
          />

          <DiagnosisNextStepsSection diagnosis={diagnosis} />
        </>
      )}
    </div>
  );
}

export function DiagnosisNextStepsSection({ diagnosis }: { diagnosis: Diagnosis }) {
  const router = useRouter();
  const [activeModal, setActiveModal] = React.useState<
    "investigate" | "replay" | "compare" | null
  >(null);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 sm:p-6 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-zinc-400" />
          <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-200 font-semibold">
            NEXT STEPS & INVESTIGATION ACTIONS
          </span>
        </div>
        <span className="text-[10px] font-sans text-zinc-400">Autonomous Workflow</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveModal("investigate")}
          className="p-3.5 h-auto flex flex-col items-start gap-1 font-sans text-xs border-white/10 text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 justify-between text-left"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-zinc-100">Investigate Step</span>
            <SearchAlert className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <span className="text-[10px] text-zinc-400 font-sans font-normal">
            Inspect Step {diagnosis.suspiciousStepNumber || 73} prompt inputs & error payload
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveModal("replay")}
          className="p-3.5 h-auto flex flex-col items-start gap-1 font-sans text-xs border-white/10 text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 justify-between text-left"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-zinc-100">Replay Checkpoint</span>
            <Play className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <span className="text-[10px] text-zinc-400 font-sans font-normal">
            Simulate patched execution from Step {diagnosis.suspiciousStepNumber || 73}
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveModal("compare")}
          className="p-3.5 h-auto flex flex-col items-start gap-1 font-sans text-xs border-white/10 text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 justify-between text-left"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-zinc-100">Compare with Run</span>
            <GitFork className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <span className="text-[10px] text-zinc-400 font-sans font-normal">
            Diff against historical golden baseline EX-2047
          </span>
        </Button>

        <Link
          href={`/dashboard/executions/${diagnosis.executionId}`}
          className="p-3.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 flex flex-col items-start gap-1 font-sans text-xs text-zinc-200 transition-colors justify-between"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-zinc-100">View Full Execution</span>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <span className="text-[10px] text-zinc-400 font-sans font-normal">
            Open complete 127-step execution trace map
          </span>
        </Link>
      </div>

      {/* Action Modals */}
      <Modal
        isOpen={activeModal === "investigate"}
        onClose={() => setActiveModal(null)}
        title="Investigate Step 73"
        description="Detailed trace analysis and heuristic divergence indicators"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-zinc-500">Telemetry Ready</span>
            <Button variant="primary" size="sm" onClick={() => setActiveModal(null)}>
              Done
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs font-mono text-zinc-300">
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200">
            Step 73 (Response Validation) failed due to a +1.8% variance delta exceeding tolerance bounds.
          </div>
          <p className="font-sans text-zinc-400">
            Recommended Action: Enforce strict schema validation on the validation node and block fallback to obsolete pre-training cutoff memory.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "replay"}
        onClose={() => setActiveModal(null)}
        title="Replay from Checkpoint"
        description="Fork and simulate execution state starting at Step 73"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-zinc-500">Replay Simulator Preview</span>
            <Button variant="primary" size="sm" onClick={() => router.push(`/dashboard/replays?executionId=${diagnosis.executionId}`)}>
              Open Replay Sandbox
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs font-mono text-zinc-300">
          <p className="font-sans text-zinc-300">
            This will launch the Black Box Replay Sandbox, verify counterfactual recovery, hotpatch the AI model directly, and generate a downloadable verified model bundle (.json, .py, .txt).
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "compare"}
        onClose={() => setActiveModal(null)}
        title="Compare with Golden Run"
        description="Side-by-side trace diff"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-zinc-500">Diff Engine Preview</span>
            <Button variant="primary" size="sm" onClick={() => router.push(`/dashboard/comparisons?target=${diagnosis.executionId}&baseline=EX-2047`)}>
              Open Comparison Engine
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs font-mono text-zinc-300">
          <p className="font-sans text-zinc-400">
            Side-by-side comparison reveals that nominal run EX-2047 maintained consistent output formatting throughout the validation region.
          </p>
        </div>
      </Modal>
    </div>
  );
}
