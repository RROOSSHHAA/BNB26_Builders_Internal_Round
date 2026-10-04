"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MOCK_COMPARISON_INVESTIGATIONS,
} from "@/mock";
import { ComparisonInvestigation, ComparisonScenarioType, ComparisonRegionDetail } from "@/types";
import { DivergencePointCard } from "@/components/comparison/DivergencePointCard";
import { ExecutionDivergenceMap } from "@/components/comparison/ExecutionDivergenceMap";
import { RegionComparisonPanel } from "@/components/comparison/RegionComparisonPanel";
import { LocalContextComparison } from "@/components/comparison/LocalContextComparison";
import { KeyDifferencesCard } from "@/components/comparison/KeyDifferencesCard";
import { DownstreamImpactFlow } from "@/components/comparison/DownstreamImpactFlow";
import { DetailedDiffAccordion } from "@/components/comparison/DetailedDiffAccordion";
import { ComparisonList } from "@/components/comparison/ComparisonList";
import { ComparisonEmptyState } from "@/components/comparison/ComparisonEmptyState";
import { NewComparisonWizard } from "@/components/comparison/NewComparisonWizard";
import {
  GitCompare,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Split,
  EyeOff,
  Filter,
} from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

function ComparisonsContent() {
  const searchParams = useSearchParams();
  const { mode, triggerRetry } = useDemoState();
  const initialId = searchParams.get("id");

  const [comparisons, setComparisons] = React.useState<ComparisonInvestigation[]>(
    MOCK_COMPARISON_INVESTIGATIONS
  );

  const [selectedComparison, setSelectedComparison] =
    React.useState<ComparisonInvestigation | null>(() => {
      if (initialId) {
        const found = MOCK_COMPARISON_INVESTIGATIONS.find((c) => c.id === initialId);
        if (found) return found;
      }
      return MOCK_COMPARISON_INVESTIGATIONS[0];
    });

  const [selectedRegion, setSelectedRegion] =
    React.useState<ComparisonRegionDetail | null>(() => {
      const active = selectedComparison || MOCK_COMPARISON_INVESTIGATIONS[0];
      return (
        active.regions.find((r) => r.name === active.divergenceRegion) ||
        active.regions[0] ||
        null
      );
    });

  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  // Synchronize initialId if it changes
  React.useEffect(() => {
    if (initialId) {
      const found = comparisons.find((c) => c.id === initialId);
      if (found) {
        setSelectedComparison(found);
        const divReg =
          found.regions.find((r) => r.name === found.divergenceRegion) ||
          found.regions[0] ||
          null;
        setSelectedRegion(divReg);
      }
    }
  }, [initialId, comparisons]);

  const activeComparison = selectedComparison || comparisons[0];

  const handleSelectComparison = (item: ComparisonInvestigation) => {
    setSelectedComparison(item);
    const divReg =
      item.regions.find((r) => r.name === item.divergenceRegion) ||
      item.regions[0] ||
      null;
    setSelectedRegion(divReg);
  };

  const handleSaveNewComparison = (newComp: ComparisonInvestigation) => {
    setComparisons((prev) => [newComp, ...prev]);
    setSelectedComparison(newComp);
    const divReg =
      newComp.regions.find((r) => r.name === newComp.divergenceRegion) ||
      newComp.regions[0] ||
      null;
    setSelectedRegion(divReg);
    setSimulateEmpty(false);
  };

  const getScenarioBadge = (type: ComparisonScenarioType) => {
    switch (type) {
      case "successful_vs_failed":
        return {
          label: "SUCCESSFUL vs FAILED",
          badgeClass: "border-rose-500/20 bg-rose-500/10 text-rose-300",
        };
      case "original_vs_replay":
        return {
          label: "ORIGINAL vs REPLAY",
          badgeClass: "border-white/10 bg-white/[0.05] text-zinc-300",
        };
      case "original_vs_alternative":
        return {
          label: "ORIGINAL vs ALTERNATIVE",
          badgeClass: "border-white/10 bg-white/[0.05] text-zinc-300",
        };
    }
  };

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
          title="Differential comparison unavailable"
          message="Black Box could not align the execution traces for comparison."
          details={{
            subsystem: "trace-diff-matrix-v1",
            errorCode: "ERR_DIFF_ALIGNMENT_FAILED",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Diff"
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
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Execution Comparisons</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Compare step differences and downstream effects across execution paths.
          </p>
        </div>

        <EmptyState
          icon={GitCompare}
          title="No comparisons yet"
          description="Compare successful, failed, replayed, or alternative executions here."
          primaryAction={{
            label: "Create Comparison",
            onClick: () => setIsWizardOpen(true),
          }}
          secondaryAction={{
            label: "View Executions",
            href: "/dashboard/executions",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Trace Comparison
            </span>
            <span className="text-xs text-zinc-400 font-sans flex items-center gap-1">
              <span>{comparisons.length} investigations tracked</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
            <span>Find where executions diverged</span>
          </h1>

          <p className="mt-1 text-xs text-zinc-400 max-w-2xl leading-relaxed font-sans">
            Side-by-side behavioral diffing across execution regions. Compare successful baselines with failed anomalies, checkpoint replays, and alternative candidate paths.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setSimulateEmpty((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-sans font-medium transition-all ${
              simulateEmpty
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-[#0e121b] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.14]"
            }`}
            title="Toggle empty state view for testing"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {simulateEmpty ? "Exit Demo" : "Simulate Empty"}
            </span>
          </button>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 transition-all font-sans"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Comparison</span>
          </button>
        </div>
      </div>

      {/* EMPTY STATE SIMULATION */}
      {simulateEmpty ? (
        <ComparisonEmptyState
          onNewComparison={() => setIsWizardOpen(true)}
          onReset={() => {
            setSimulateEmpty(false);
            setComparisons(MOCK_COMPARISON_INVESTIGATIONS);
            setSelectedComparison(MOCK_COMPARISON_INVESTIGATIONS[0]);
          }}
        />
      ) : (
        <>
          {/* ACTIVE COMPARISON SHOWCASE */}
          {activeComparison && (
            <div className="flex flex-col gap-6">
              {/* Showcase Banner / Top Meta Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 font-sans">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                    <GitCompare className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white font-sans">
                        {activeComparison.title}
                      </h2>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          getScenarioBadge(activeComparison.scenarioType).badgeClass
                        }`}
                      >
                        {getScenarioBadge(activeComparison.scenarioType).label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                      <span>Agent: {activeComparison.agentName}</span>
                      <span>•</span>
                      <span>Framework: {activeComparison.framework}</span>
                      <span>•</span>
                      <span>Analyzed {activeComparison.createdAtAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Left vs Right Micro Stat Cards */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start lg:self-center">
                  <div className="rounded-lg border border-white/[0.06] bg-[#080c13] px-3 py-1.5 text-right">
                    <span className="text-[10px] text-zinc-500 uppercase block">
                      Left Run ({activeComparison.leftExecution.id})
                    </span>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span
                        className={`text-xs font-bold ${
                          activeComparison.leftExecution.status === "FAILED"
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {activeComparison.leftExecution.status}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        ({activeComparison.leftExecution.totalSteps} steps •{" "}
                        {activeComparison.leftExecution.durationText})
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />

                  <div className="rounded-lg border border-white/[0.06] bg-[#080c13] px-3 py-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase block">
                      Right Run ({activeComparison.rightExecution.id})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold ${
                          activeComparison.rightExecution.status === "SUCCESS"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {activeComparison.rightExecution.status}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        ({activeComparison.rightExecution.totalSteps} steps •{" "}
                        {activeComparison.rightExecution.durationText})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. PRIMARY DIVERGENCE POINT CARD */}
              <DivergencePointCard
                step={activeComparison.divergencePoint.step}
                stepTitle={activeComparison.divergencePoint.stepTitle}
                leftBehavior={activeComparison.divergencePoint.leftBehavior}
                rightBehavior={activeComparison.divergencePoint.rightBehavior}
                downstreamEffect={activeComparison.divergencePoint.downstreamEffect}
                divergenceRegion={activeComparison.divergenceRegion}
              />

              {/* 2. COMPRESSED EXECUTION REGIONS MAP */}
              <ExecutionDivergenceMap
                regions={activeComparison.regions}
                leftLabel={activeComparison.leftExecution.label}
                leftStatus={activeComparison.leftExecution.status}
                rightLabel={activeComparison.rightExecution.label}
                rightStatus={activeComparison.rightExecution.status}
                selectedRegionName={selectedRegion?.name}
                onSelectRegion={(reg) => setSelectedRegion(reg)}
              />

              {/* REGION COMPARISON PANEL (when region is selected) */}
              {selectedRegion && (
                <RegionComparisonPanel
                  region={selectedRegion}
                  leftLabel={activeComparison.leftExecution.label}
                  rightLabel={activeComparison.rightExecution.label}
                  onClose={() => setSelectedRegion(null)}
                />
              )}

              {/* 3. LOCALIZED STEP CONTEXT (Steps 72-74) */}
              <LocalContextComparison
                steps={activeComparison.localContext}
                leftLabel={activeComparison.leftExecution.label}
                rightLabel={activeComparison.rightExecution.label}
              />

              {/* 4. KEY DIFFERENCES & DOWNSTREAM IMPACT FLOW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <KeyDifferencesCard differences={activeComparison.keyDifferences} />
                <DownstreamImpactFlow
                  divergenceStep={activeComparison.downstreamImpactFlow.divergenceStep}
                  regionName={activeComparison.downstreamImpactFlow.regionName}
                  nextRegionName={activeComparison.downstreamImpactFlow.nextRegionName}
                  leftOutcome={activeComparison.downstreamImpactFlow.leftOutcome}
                  rightOutcome={activeComparison.downstreamImpactFlow.rightOutcome}
                />
              </div>

              {/* 5. DETAILED DIFFERENCES ACCORDION (Secondary Collapsed Trace Diff) */}
              {activeComparison.rawDifferences && activeComparison.rawDifferences.length > 0 && (
                <DetailedDiffAccordion differences={activeComparison.rawDifferences} />
              )}
            </div>
          )}

          {/* 6. COMPARISON HISTORY LIST */}
          <div className="pt-4 border-t border-white/[0.06]">
            <ComparisonList
              comparisons={comparisons}
              selectedId={activeComparison?.id}
              onSelectComparison={handleSelectComparison}
            />
          </div>
        </>
      )}

      {/* NEW COMPARISON WIZARD MODAL */}
      <NewComparisonWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSaveComparison={handleSaveNewComparison}
      />
    </div>
  );
}

export default function ComparisonsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center font-sans text-xs text-zinc-400">
          Loading comparative analysis engine...
        </div>
      }
    >
      <ComparisonsContent />
    </React.Suspense>
  );
}
