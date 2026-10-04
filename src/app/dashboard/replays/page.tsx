"use client";

import * as React from "react";
import Link from "next/link";
import {
  MOCK_REPLAY_INVESTIGATIONS,
} from "@/mock";
import { ReplayInvestigation } from "@/types";
import { CheckpointFlowIndicator } from "@/components/replay/CheckpointFlowIndicator";
import { OriginalVsReplayMap } from "@/components/replay/OriginalVsReplayMap";
import { ReplayList } from "@/components/replay/ReplayList";
import { ReplayDetailDrawer } from "@/components/replay/ReplayDetailDrawer";
import { CreateReplayWizard } from "@/components/replay/CreateReplayWizard";
import { SafetyNotice } from "@/components/replay/SafetyNotice";
import { ReplayEmptyState } from "@/components/replay/ReplayEmptyState";
import { useSearchParams } from "next/navigation";
import {
  Play,
  ArrowRight,
  Terminal,
  Sparkles,
  GitFork,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

function ReplaysContent() {
  const searchParams = useSearchParams();
  const targetExecutionId = searchParams.get("executionId") || searchParams.get("execution");
  const { mode, triggerRetry } = useDemoState();
  const [replays, setReplays] = React.useState<ReplayInvestigation[]>(
    MOCK_REPLAY_INVESTIGATIONS
  );
  const [selectedReplay, setSelectedReplay] =
    React.useState<ReplayInvestigation | null>(MOCK_REPLAY_INVESTIGATIONS[0]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isWizardOpen, setIsWizardOpen] = React.useState(Boolean(targetExecutionId));
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("blackbox_custom_replays") || "[]");
        if (stored.length > 0) {
          setReplays((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newOnes = stored.filter((r: ReplayInvestigation) => !existingIds.has(r.id));
            return [...newOnes, ...prev];
          });
        }
      } catch {}
    }
    if (targetExecutionId) {
      setIsWizardOpen(true);
    }
  }, [targetExecutionId]);

  // 1. Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <PageSkeleton cardCount={3} showTable={true} />
      </div>
    );
  }

  // 2. Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-10 pb-16 font-sans">
        <ErrorState
          title="Replay simulation engine unavailable"
          message="Black Box could not load checkpoint replay investigations from the sandbox."
          details={{
            subsystem: "sandbox-fork-service",
            errorCode: "ERR_REPLAY_FORK_FAILED",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Sandbox"
          secondaryAction={{
            label: "Return to Executions",
            href: "/dashboard/executions",
          }}
        />
      </div>
    );
  }

  // 3. Empty State
  if (mode === "empty") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-8 pb-16 font-sans">
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Checkpoint Replays</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Replay executions from checkpointed states to isolate failure causes.
          </p>
        </div>

        <EmptyState
          icon={Play}
          title="No replay investigations yet"
          description="Create a replay from a failed execution to investigate an alternative path."
          primaryAction={{
            label: "View Executions",
            href: "/dashboard/executions",
          }}
          secondaryAction={{
            label: "Create Replay",
            onClick: () => setIsWizardOpen(true),
          }}
        />
      </div>
    );
  }

  const handleSelectReplay = (replay: ReplayInvestigation) => {
    setSelectedReplay(replay);
    setIsDetailDrawerOpen(true);
  };

  const handleCompleteNewReplay = (newReplay: ReplayInvestigation) => {
    setReplays((prev) => [newReplay, ...prev]);
    setSelectedReplay(newReplay);
    setSimulateEmpty(false);
  };

  const activeShowcaseReplay = selectedReplay || replays[0];

  return (
    <div className="flex flex-col gap-6 w-full pb-16 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Checkpoint Replay
            </span>
            <span className="text-xs text-zinc-400 font-sans flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              State Fork Engine Active
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Replay from the point that matters
          </h1>

          <p className="mt-1 text-xs md:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
            Start from a checkpoint, explore an alternative execution path, and understand how a change affects the final outcome without rerunning unaffected execution.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setSimulateEmpty((prev) => !prev)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-sans font-medium transition-all ${
              simulateEmpty
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-[#0e121b] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.14]"
            }`}
            title="Toggle empty state view for UI review"
          >
            {simulateEmpty ? "Show Replays" : "Simulate Empty"}
          </button>

          <Link
            href="/dashboard/executions"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0e121b] px-3.5 py-1.5 text-xs font-sans font-medium text-zinc-300 hover:border-white/20 hover:text-white transition-all"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>View Executions</span>
          </Link>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-xs font-sans font-medium text-zinc-900 hover:bg-zinc-200 transition-all shadow-xs"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Create Replay</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <SafetyNotice />

      {simulateEmpty ? (
        <ReplayEmptyState onReset={() => setSimulateEmpty(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Showcase / Active Investigation Area (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <GitFork className="h-4 w-4 text-zinc-300" />
                <h2 className="text-xs font-semibold uppercase tracking-wider font-sans text-zinc-200">
                  Featured Replay Investigation
                </h2>
              </div>

              {activeShowcaseReplay && (
                <div className="flex items-center gap-2 font-sans text-xs text-zinc-400">
                  <span>{activeShowcaseReplay.agentName}</span>
                  <span>•</span>
                  <span className="text-zinc-300 font-mono font-medium">
                    {activeShowcaseReplay.originalExecutionId}
                  </span>
                </div>
              )}
            </div>

            {activeShowcaseReplay && (
              <>
                {/* 1. Checkpoint Flow Indicator */}
                <CheckpointFlowIndicator
                  checkpointStep={activeShowcaseReplay.checkpointStep}
                  modifiedStep={activeShowcaseReplay.modifiedStep}
                  totalSteps={activeShowcaseReplay.totalSteps}
                  stepsReused={activeShowcaseReplay.stepsReused}
                  stepsReplayed={activeShowcaseReplay.stepsReplayed}
                />

                {/* 2. Original vs Replay Region Map */}
                <OriginalVsReplayMap
                  originalRegions={activeShowcaseReplay.originalRegions}
                  replayRegions={activeShowcaseReplay.replayRegions}
                  whatChanged={activeShowcaseReplay.whatChanged}
                  downstreamEffect={activeShowcaseReplay.downstreamEffect}
                  finalResultText={activeShowcaseReplay.finalResultText}
                  originalResult={activeShowcaseReplay.originalResult}
                  replayResult={activeShowcaseReplay.replayResult}
                />

                {/* Investigation Deep Dive Bar */}
                <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#0e121b] p-3.5 font-sans text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Investigating:</span>
                    <span className="text-zinc-200 font-medium">
                      <span className="font-mono">Step {activeShowcaseReplay.modifiedStep}</span> —{" "}
                      {activeShowcaseReplay.modifiedStepTitle}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectReplay(activeShowcaseReplay)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-zinc-300 hover:border-white/20 hover:text-white transition-all font-sans font-medium"
                  >
                    <span>Inspect Full Diff</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>

                {/* Replay State Differential & Memory Snapshot Card (Fills Left Rail, Eliminates Blank Void) */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-zinc-400" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 font-sans">
                        REPLAY STATE VECTOR & CHECKPOINT TELEMETRY
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium font-sans">
                      Isolated Sandbox
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-white/[0.05] bg-[#090a0f]">
                      <span className="text-[10px] text-zinc-400 uppercase font-medium block">
                        Preserved Context Prefix
                      </span>
                      <span className="text-sm font-bold text-white mt-0.5 block font-sans">
                        Steps 1–{activeShowcaseReplay.checkpointStep} Reused
                      </span>
                      <span className="text-[10px] text-emerald-400 font-sans">100% Deterministic match</span>
                    </div>

                    <div className="p-3 rounded-lg border border-white/[0.05] bg-[#090a0f]">
                      <span className="text-[10px] text-zinc-400 uppercase font-medium block">
                        Simulation Trajectory
                      </span>
                      <span className="text-sm font-bold text-white mt-0.5 block font-sans">
                        {activeShowcaseReplay.stepsReplayed} Steps Replayed
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans">Isolated sandbox run</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.04] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Injected Patch Parameter:</span>
                      <span className="text-zinc-200 font-mono text-[10px]">Strict Schema Validation</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Counterfactual Outcome:</span>
                      <span className="text-emerald-400 font-semibold">Nominal Output Restored</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Rail: Replay History & Investigations List (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="max-h-[480px] overflow-y-auto pr-1">
              <ReplayList
                replays={replays}
                selectedReplayId={activeShowcaseReplay?.id}
                onSelectReplay={(replay) => {
                  setSelectedReplay(replay);
                  handleSelectReplay(replay);
                }}
              />
            </div>

            {/* Explanatory Principle Callout */}
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-4 text-xs font-sans text-zinc-400 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 block">
                How Checkpoint Replay Works
              </span>
              <p className="leading-relaxed">
                Rather than rerunning an entire 100+ step agent workflow from the start, Black Box preserves immutable state vectors up to the checkpoint.
              </p>
              <div className="rounded-lg border border-white/[0.06] bg-[#090d14] p-2.5 space-y-1.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Deterministic Prefix:</span>
                  <span className="text-emerald-400 font-medium">Reused 100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Simulation Isolation:</span>
                  <span className="text-zinc-300 font-medium">Sandboxed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Side Effect Prevention:</span>
                  <span className="text-zinc-300 font-medium">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Create Replay Wizard Modal */}
      <CreateReplayWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCompleteReplay={handleCompleteNewReplay}
        initialExecutionId={targetExecutionId || undefined}
      />

      {/* Detail Drawer for Inspecting Replays */}
      <ReplayDetailDrawer
        replay={selectedReplay}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
      />
    </div>
  );
}

export default function ReplaysPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-12 text-center text-xs font-sans text-zinc-400">
          Loading replay sandbox telemetry...
        </div>
      }
    >
      <ReplaysContent />
    </React.Suspense>
  );
}
