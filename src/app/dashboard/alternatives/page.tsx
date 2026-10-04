"use client";

import * as React from "react";
import Link from "next/link";
import {
  MOCK_ALTERNATIVE_INVESTIGATIONS,
} from "@/mock";
import { AlternativeInvestigation } from "@/types";
import { BranchingPathVisualizer } from "@/components/alternative/BranchingPathVisualizer";
import { ChangeSummaryCard } from "@/components/alternative/ChangeSummaryCard";
import { DownstreamImpactMap } from "@/components/alternative/DownstreamImpactMap";
import { AlternativeList } from "@/components/alternative/AlternativeList";
import { AlternativeDetailDrawer } from "@/components/alternative/AlternativeDetailDrawer";
import { CreateAlternativeWizard } from "@/components/alternative/CreateAlternativeWizard";
import { AlternativeEmptyState } from "@/components/alternative/AlternativeEmptyState";
import {
  GitFork,
  ArrowRight,
  Terminal,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Split,
  ExternalLink,
} from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function AlternativesPage() {
  const { mode, triggerRetry } = useDemoState();
  const [investigations, setInvestigations] = React.useState<AlternativeInvestigation[]>(
    MOCK_ALTERNATIVE_INVESTIGATIONS
  );
  const [selectedInvestigation, setSelectedInvestigation] =
    React.useState<AlternativeInvestigation | null>(MOCK_ALTERNATIVE_INVESTIGATIONS[0]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

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
          title="Alternative simulation sandbox offline"
          message="Black Box could not connect to the speculative execution simulation engine."
          details={{
            subsystem: "alternative-branching-worker",
            errorCode: "ERR_SIMULATION_SANDBOX_OFFLINE",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Simulation"
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
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Alternative Executions</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Simulate and evaluate branching paths at suspicious decision points.
          </p>
        </div>

        <EmptyState
          icon={GitFork}
          title="No alternative executions yet"
          description="Explore what might have happened if a different intermediate decision had been taken."
          primaryAction={{
            label: "Investigate an Execution",
            href: "/dashboard/executions",
          }}
          secondaryAction={{
            label: "Create Alternative",
            onClick: () => setIsWizardOpen(true),
          }}
        />
      </div>
    );
  }

  const handleSelectInvestigation = (item: AlternativeInvestigation) => {
    setSelectedInvestigation(item);
    setIsDrawerOpen(true);
  };

  const handleSaveNewAlternative = (newAlt: AlternativeInvestigation) => {
    setInvestigations((prev) => [newAlt, ...prev]);
    setSelectedInvestigation(newAlt);
    setSimulateEmpty(false);
  };

  const activeShowcase = selectedInvestigation || investigations[0];

  return (
    <div className="flex flex-col gap-6 w-full pb-16 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Alternative Execution
            </span>
            <span className="text-xs text-zinc-400 font-sans flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Branch Sandbox Ready
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Explore another path
          </h1>

          <p className="mt-1 text-xs md:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
            Test a different decision at the point where an execution diverged and inspect how the downstream path changes.
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
            {simulateEmpty ? "Show Alternatives" : "Simulate Empty"}
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
            <GitFork className="h-3.5 w-3.5" />
            <span>Create Alternative</span>
          </button>
        </div>
      </div>

      {simulateEmpty ? (
        <AlternativeEmptyState onReset={() => setSimulateEmpty(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Showcase Area (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Split className="h-4 w-4 text-zinc-300" />
                <h2 className="text-xs font-semibold uppercase tracking-wider font-sans text-zinc-200">
                  Featured Alternative Investigation
                </h2>
              </div>

              {activeShowcase && (
                <div className="flex items-center gap-2 font-sans text-xs text-zinc-400">
                  <span>{activeShowcase.agentName}</span>
                  <span>•</span>
                  <span className="text-zinc-300 font-mono font-medium">
                    {activeShowcase.originalExecutionId}
                  </span>
                </div>
              )}
            </div>

            {activeShowcase && (
              <>
                {/* 1. Branching Path Comparison Map */}
                <BranchingPathVisualizer
                  originalPath={activeShowcase.originalPath}
                  alternativePath={activeShowcase.alternativePath}
                  divergenceStep={activeShowcase.divergenceStep}
                  divergenceRegion={activeShowcase.divergenceRegion}
                  originalOutcome={activeShowcase.originalOutcome}
                  alternativeOutcome={activeShowcase.alternativeOutcome}
                />

                {/* 2. Structured Change Summary */}
                <ChangeSummaryCard
                  whatChanged={activeShowcase.whatChanged}
                  downstreamEffect={activeShowcase.downstreamEffect}
                  finalOutcomeText={activeShowcase.finalOutcomeText}
                  alternativeStatus={activeShowcase.alternativeStatus}
                  statusExplanation={activeShowcase.statusExplanation}
                />

                {/* 3. Downstream Impact Map */}
                <DownstreamImpactMap
                  divergenceStep={activeShowcase.divergenceStep}
                  impactNodes={activeShowcase.impactNodes}
                />

                {/* Quick Inspection Action Bar */}
                <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#0e121b] p-3.5 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Changed Decision:</span>
                    <span className="text-zinc-200 font-medium">
                      <span className="font-mono">Step {activeShowcase.divergenceStep}</span> — {activeShowcase.divergenceStepTitle}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectInvestigation(activeShowcase)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-zinc-300 hover:border-white/20 hover:text-white transition-all font-sans font-medium"
                  >
                    <span>Inspect Full Diff</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>

                {/* Counterfactual Simulation Engine Telemetry (Fills Left Rail, Eliminates Blank Void) */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-zinc-400" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 font-sans">
                        COUNTERFACTUAL BRANCH SIMULATION METRICS
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium font-sans">
                      Verified Recovery
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-white/[0.05] bg-[#090a0f]">
                      <span className="text-[10px] text-zinc-400 uppercase font-medium block">
                        Downstream Path Recovery
                      </span>
                      <span className="text-sm font-bold text-white mt-0.5 block font-sans">
                        100% Steps Nominal
                      </span>
                      <span className="text-[10px] text-emerald-400 font-sans">No cascading anomalies</span>
                    </div>

                    <div className="p-3 rounded-lg border border-white/[0.05] bg-[#090a0f]">
                      <span className="text-[10px] text-zinc-400 uppercase font-medium block">
                        Compute Resource Conservation
                      </span>
                      <span className="text-sm font-bold text-white mt-0.5 block font-sans">
                        68% Token Savings
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans">Vs. full execution replay</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.04] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Baseline Schema Deviation:</span>
                      <span className="text-rose-400 font-mono text-[10px]">18.2% Out of Bounds</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Simulated Branch Result:</span>
                      <span className="text-emerald-400 font-semibold font-mono text-[10px]">0.0% Variance (Pass)</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Rail: History of Alternative Investigations (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="max-h-[480px] overflow-y-auto pr-1">
              <AlternativeList
                investigations={investigations}
                selectedId={activeShowcase?.id}
                onSelectInvestigation={(item) => {
                  setSelectedInvestigation(item);
                  handleSelectInvestigation(item);
                }}
              />
            </div>

            {/* Principle Callout */}
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-4 text-xs text-zinc-400 space-y-2 font-sans">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 block">
                How Alternative Execution Works
              </span>
              <p className="leading-relaxed">
                Rather than simply running the agent again and hoping for a different output, Black Box identifies the exact problematic intermediate decision, mutates the state, and simulates how downstream regions react.
              </p>
              <div className="rounded-lg border border-white/[0.06] bg-[#090d14] p-2.5 space-y-1.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Simulation Method:</span>
                  <span className="text-zinc-200 font-medium">Controlled Fork</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Downstream Propagation:</span>
                  <span className="text-emerald-400 font-medium">Tracked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Production Impact:</span>
                  <span className="text-zinc-300 font-medium">None (Sandboxed)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guided Creation Wizard Modal */}
      <CreateAlternativeWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSaveAlternative={handleSaveNewAlternative}
      />

      {/* Detail Inspection Drawer */}
      <AlternativeDetailDrawer
        investigation={selectedInvestigation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
