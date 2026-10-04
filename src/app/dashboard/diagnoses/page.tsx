"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_DIAGNOSES, MOCK_AGENTS } from "@/mock";
import { Diagnosis } from "@/types";
import {
  DiagnosisFilterBar,
  DiagnosisFilterState,
} from "@/components/diagnosis/DiagnosisFilterBar";
import { DiagnosisListItem } from "@/components/diagnosis/DiagnosisListItem";
import {
  DiagnosisDetailView,
  DiagnosisNextStepsSection,
} from "@/components/diagnosis/DiagnosisDetailView";
import { ExecutionDivergenceMap } from "@/components/diagnosis/ExecutionDivergenceMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SearchAlert,
  Flame,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  FilterX,
  RotateCcw,
} from "lucide-react";

import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { NoResultsState } from "@/components/ui/no-results-state";

function DiagnosesContent() {
  const searchParams = useSearchParams();
  const { mode, triggerRetry } = useDemoState();
  const targetExecutionId = searchParams.get("execution");
  const targetDiagId = searchParams.get("id");

  // Filter state
  const [filters, setFilters] = React.useState<DiagnosisFilterState>({
    search: "",
    agent: "all",
    category: "all",
    confidence: "all",
    status: "all",
  });

  // Find initial diagnosis based on query param or default to EX-2048
  const initialDiagnosis = React.useMemo<Diagnosis>(() => {
    if (targetExecutionId) {
      const match = MOCK_DIAGNOSES.find(
        (d) => d.executionId.toLowerCase() === targetExecutionId.toLowerCase()
      );
      if (match) return match;

      return {
        id: `diag_${targetExecutionId.toLowerCase()}`,
        executionId: targetExecutionId,
        agentName: "Autonomous Agent",
        agentId: "agt_custom",
        framework: "LangChain",
        title: "Tool Execution Crash & Missing Column Constraint",
        rootCauseType: "tool_schema_mismatch",
        failureCategory: "Tool Execution Divergence",
        subcategory: "Relation Column Missing",
        suspiciousStepNumber: 3,
        suspiciousStepTitle: "Schema Migration Lock",
        confidenceScore: 0.94,
        confidenceLabel: "High Confidence",
        explanation: `Execution ${targetExecutionId} crashed during step 3 execution due to an unhandled database schema mismatch: column 'user_tier' does not exist in target relation.`,
        evidence: [
          "Database error code 42703: undefined_column",
          "Divergence detected at Step 3 (0.94 probability of root failure)",
          "Subsequent validation steps skipped due to unhandled fatal exception",
        ],
        evidenceSignals: [
          { name: "Schema Definition Drift", level: "High", percentage: 94 },
          { name: "Memory Checkpoint Desync", level: "Moderate", percentage: 72 },
          { name: "Token Variance", level: "Low", percentage: 18 },
        ],
        affectedStepRange: [3, 4],
        affectedRegionId: "reg-3",
        affectedRegionName: "Schema Patch",
        downstreamImpact: {
          affectedRegionsCount: 1,
          affectedStepsCount: 2,
          description: "Subsequent transaction commit and validation failed to execute.",
        },
        recommendedFix: {
          action: "Execute ALTER TABLE migration to add column 'user_tier VARCHAR(50)' before lock acquisition.",
          promptDiff: "ALTER TABLE users ADD COLUMN user_tier VARCHAR(50);",
        },
        simulatedRecoveryRate: 0.99,
        detectedAt: new Date().toISOString(),
        status: "failed",
      };
    }
    if (targetDiagId) {
      const match = MOCK_DIAGNOSES.find((d) => d.id === targetDiagId);
      if (match) return match;
    }
    return MOCK_DIAGNOSES[0];
  }, [targetExecutionId, targetDiagId]);

  const allAvailableDiagnoses = React.useMemo(() => {
    if (
      targetExecutionId &&
      !MOCK_DIAGNOSES.some(
        (d) => d.executionId.toLowerCase() === targetExecutionId.toLowerCase()
      )
    ) {
      return [initialDiagnosis, ...MOCK_DIAGNOSES];
    }
    return MOCK_DIAGNOSES;
  }, [targetExecutionId, initialDiagnosis]);

  const [selectedDiagnosis, setSelectedDiagnosis] =
    React.useState<Diagnosis>(initialDiagnosis);

  // Sync if targetExecutionId changes
  React.useEffect(() => {
    if (initialDiagnosis) {
      setSelectedDiagnosis(initialDiagnosis);
    }
  }, [initialDiagnosis]);

  // Client-side filtering
  const filteredDiagnoses = React.useMemo(() => {
    return allAvailableDiagnoses.filter((diag) => {
      // Search query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesPrompt = diag.explanation.toLowerCase().includes(q);
        const matchesAgent = diag.agentName?.toLowerCase().includes(q);
        const matchesExec = diag.executionId.toLowerCase().includes(q);
        const matchesCategory = diag.failureCategory?.toLowerCase().includes(q);
        const matchesStep = diag.suspiciousStepTitle?.toLowerCase().includes(q);
        if (
          !matchesPrompt &&
          !matchesAgent &&
          !matchesExec &&
          !matchesCategory &&
          !matchesStep
        ) {
          return false;
        }
      }

      // Agent
      if (filters.agent !== "all") {
        if (diag.agentId !== filters.agent && diag.agentName !== filters.agent) {
          return false;
        }
      }

      // Category
      if (filters.category !== "all") {
        if (
          diag.failureCategory?.toLowerCase() !== filters.category.toLowerCase()
        ) {
          return false;
        }
      }

      // Confidence
      if (filters.confidence === "high" && diag.confidenceScore < 0.9) return false;
      if (
        filters.confidence === "medium" &&
        (diag.confidenceScore < 0.8 || diag.confidenceScore >= 0.9)
      ) {
        return false;
      }
      if (filters.confidence === "low" && diag.confidenceScore >= 0.8) return false;

      return true;
    });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: "",
      agent: "all",
      category: "all",
      confidence: "all",
      status: "all",
    });
  };

  // 1. Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-6 pb-12 font-sans">
        <PageSkeleton cardCount={3} showTable={true} />
      </div>
    );
  }

  // 2. Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto pt-8 pb-16 font-sans">
        <ErrorState
          title="Diagnosis telemetry unavailable"
          message="Black Box could not load diagnostic telemetry."
          details={{
            service: "diagnostics-analyzer-v2",
            error: "ERR_DIAGNOSIS_PIPELINE_OFFLINE",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Diagnosis"
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
      <div className="space-y-6 w-full max-w-2xl mx-auto pt-8 pb-16 font-sans">
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Diagnoses</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automated anomaly detection and root-cause analysis.
          </p>
        </div>

        <EmptyState
          icon={SearchAlert}
          title="No diagnoses yet"
          description="Failure diagnoses will appear here when Black Box identifies suspicious execution behavior."
          primaryAction={{
            label: "View Executions",
            href: "/dashboard/executions",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-400 font-semibold">
              FAILURE ANALYSIS
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-[11px] font-sans text-zinc-400">
              Automated Root-Cause Audit
            </span>
          </div>

          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Diagnose execution failures.
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
            Identify suspicious execution regions, understand the evidence behind a diagnosis,
            and investigate the steps that changed the outcome.
          </p>
        </div>

        {/* Header Right Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge variant="default" size="md" className="font-sans text-xs gap-1.5 text-zinc-300">
            <Flame className="h-3 w-3 text-zinc-400" />
            <span>{MOCK_DIAGNOSES.length} Active Diagnoses</span>
          </Badge>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <DiagnosisFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        agents={MOCK_AGENTS}
        totalCount={MOCK_DIAGNOSES.length}
        filteredCount={filteredDiagnoses.length}
      />

      {/* 3. Main Two-Column Investigation Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Diagnosis Selection List (Sticky) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-sans text-zinc-300 font-medium">
              Available Diagnoses
            </span>
            <span className="text-xs font-sans text-zinc-500">
              Select to inspect
            </span>
          </div>

          {filteredDiagnoses.length === 0 ? (
            <NoResultsState
              title="No matching diagnoses"
              description="Try adjusting your search criteria, failure category, or confidence threshold."
              onClearFilters={handleResetFilters}
              searchTerm={filters.search}
            />
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
              {filteredDiagnoses.map((diag) => (
                <DiagnosisListItem
                  key={diag.id}
                  diagnosis={diag}
                  isSelected={selectedDiagnosis?.id === diag.id}
                  onSelect={(d) => setSelectedDiagnosis(d)}
                />
              ))}
            </div>
          )}

          {/* Quick Note Card */}
          <div className="p-3.5 rounded-lg border border-white/[0.08] bg-[#0e121b] text-xs font-sans text-zinc-400 leading-relaxed">
            <span className="font-semibold text-zinc-200 block mb-0.5 font-sans text-xs">
              Automated Divergence Triage
            </span>
            Black Box continuously evaluates captured agent trace vectors against nominal execution baselines to identify the exact divergence boundary.
          </div>
        </div>

        {/* Right Column: Detailed Diagnosis Investigation View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDiagnosis?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <DiagnosisDetailView
                diagnosis={selectedDiagnosis}
                omitFullWidthSections={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Full-Width Execution Divergence Map (Spans entire layout width, zero useless side gaps) */}
      <ExecutionDivergenceMap
        failedExecutionId={selectedDiagnosis.executionId}
        divergenceStep={selectedDiagnosis.suspiciousStepNumber || 73}
        divergenceRegion={selectedDiagnosis.affectedRegionName || "Validation"}
      />

      {/* 5. Full-Width Next Steps & Investigation Actions (Spans entire layout width, zero useless side gaps) */}
      <DiagnosisNextStepsSection diagnosis={selectedDiagnosis} />
    </div>
  );
}

export default function DiagnosesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-12 text-center text-xs font-sans text-zinc-400">
          Loading diagnostic telemetry...
        </div>
      }
    >
      <DiagnosesContent />
    </React.Suspense>
  );
}
