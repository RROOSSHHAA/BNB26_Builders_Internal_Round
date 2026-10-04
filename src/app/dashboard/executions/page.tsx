"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_EXECUTIONS, MOCK_AGENTS } from "@/mock";
import { Execution } from "@/types";
import { ExecutionMetricsSummary } from "@/components/execution/ExecutionMetricsSummary";
import {
  ExecutionFilterBar,
  FilterState,
} from "@/components/execution/ExecutionFilterBar";
import { ExecutionCardItem } from "@/components/execution/ExecutionCardItem";
import { ExecutionQuickDrawer } from "@/components/execution/ExecutionQuickDrawer";
import { ExecutionEmptyState } from "@/components/execution/ExecutionEmptyState";
import { RecordExecutionModal } from "@/components/execution/RecordExecutionModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Radio, RefreshCw } from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function ExecutionsPage() {
  const { mode, triggerRetry } = useDemoState();

  const [selectedExecutionForDrawer, setSelectedExecutionForDrawer] =
    React.useState<Execution | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);
  const [activeMetricFilter, setActiveMetricFilter] = React.useState<
    "all" | "success" | "failed" | "investigate"
  >("all");
  const [simulateEmptyFirstTime, setSimulateEmptyFirstTime] = React.useState(false);

  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    agent: "all",
    status: "all",
    failureCategory: "all",
    dateRange: "all",
    duration: "all",
    sortBy: "newest",
  });

  const handleResetFilters = () => {
    setFilters({
      search: "",
      agent: "all",
      status: "all",
      failureCategory: "all",
      dateRange: "all",
      duration: "all",
      sortBy: "newest",
    });
    setActiveMetricFilter("all");
    setSimulateEmptyFirstTime(false);
  };

  const handleMetricCardClick = (
    metricType: "all" | "success" | "failed" | "investigate"
  ) => {
    setActiveMetricFilter(metricType);
    if (metricType === "all") {
      setFilters((prev) => ({ ...prev, status: "all" }));
    } else if (metricType === "success") {
      setFilters((prev) => ({ ...prev, status: "success" }));
    } else if (metricType === "failed") {
      setFilters((prev) => ({ ...prev, status: "failed" }));
    } else if (metricType === "investigate") {
      setFilters((prev) => ({ ...prev, status: "failed" }));
    }
  };

  const [customExecutions, setCustomExecutions] = React.useState<Execution[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("blackbox_custom_executions") || "[]");
        setCustomExecutions(stored);
      } catch {}
    }
  }, []);

  // Filter and sort executions
  const filteredAndSortedExecutions = React.useMemo(() => {
    if (simulateEmptyFirstTime) return [];

    const all = [...customExecutions, ...MOCK_EXECUTIONS];
    const seen = new Set<string>();
    let result: Execution[] = [];
    for (const ex of all) {
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        result.push(ex);
      }
    }

    // Filter by Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (ex) =>
          ex.id.toLowerCase().includes(q) ||
          ex.agentName.toLowerCase().includes(q) ||
          ex.framework.toLowerCase().includes(q) ||
          ex.triggerPrompt.toLowerCase().includes(q) ||
          (ex.outputSummary && ex.outputSummary.toLowerCase().includes(q)) ||
          (ex.failureCategory && ex.failureCategory.toLowerCase().includes(q)) ||
          ex.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Agent
    if (filters.agent !== "all") {
      result = result.filter(
        (ex) => ex.agentId === filters.agent || ex.agentName === filters.agent
      );
    }

    // Filter by Status
    if (filters.status !== "all") {
      result = result.filter((ex) => ex.status === filters.status);
    }

    // Filter by Metric Card "Needs Investigation"
    if (activeMetricFilter === "investigate") {
      result = result.filter((ex) => ex.needsInvestigation || ex.status === "failed");
    }

    // Filter by Failure Category
    if (filters.failureCategory !== "all") {
      result = result.filter(
        (ex) => ex.failureCategory?.toLowerCase() === filters.failureCategory.toLowerCase()
      );
    }

    // Filter by Duration
    if (filters.duration === "fast") {
      result = result.filter((ex) => ex.durationMs < 10000);
    } else if (filters.duration === "medium") {
      result = result.filter((ex) => ex.durationMs >= 10000 && ex.durationMs <= 20000);
    } else if (filters.duration === "long") {
      result = result.filter((ex) => ex.durationMs > 20000);
    }

    // Filter by Date Range (mock relative timestamps from 2026-10-03)
    if (filters.dateRange === "24h") {
      // All mock runs in this dataset are within the last 24h
      result = result.filter((ex) => ex.startTime.startsWith("2026-10-03"));
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case "oldest":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case "duration-desc":
          return b.durationMs - a.durationMs;
        case "duration-asc":
          return a.durationMs - b.durationMs;
        case "steps-desc":
          return b.totalSteps - a.totalSteps;
        case "steps-asc":
          return a.totalSteps - b.totalSteps;
        default:
          return 0;
      }
    });

    return result;
  }, [filters, activeMetricFilter, simulateEmptyFirstTime]);

  // 1. Loading state
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <PageSkeleton cardCount={4} showTable={true} />
      </div>
    );
  }

  // 2. Error state
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto pt-8 pb-16 font-sans">
        <ErrorState
          title="Unable to load executions"
          message="Black Box could not load this execution data from the cluster."
          details={{
            clusterNode: "us-east-1.execution-mesh-04",
            errorCode: "ERR_FETCH_EXECUTIONS_FAILED",
            lastAttempt: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Try Again"
          secondaryAction={{
            label: "Return to Overview",
            href: "/dashboard",
          }}
        />
      </div>
    );
  }

  // 3. Full empty state
  if (mode === "empty") {
    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto pt-8 pb-16 font-sans">
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">Executions</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Execution history and step-level telemetry.
          </p>
        </div>

        <EmptyState
          icon={Radio}
          title="No executions yet"
          description="Once your agents send execution traces to Black Box, they will appear here."
          primaryAction={{
            label: "Connect an Agent",
            href: "/dashboard/agents",
          }}
          secondaryAction={{
            label: "View Integrations",
            href: "/dashboard/integrations",
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
              EXECUTION HISTORY
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-[11px] font-sans text-zinc-400">
              Agent Flight Telemetry
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Executions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
            Explore recorded agent runs, investigate failures, and jump directly into
            execution intelligence.
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5">
          {/* Demo toggle to test first-time empty state */}
          <button
            type="button"
            onClick={() => setSimulateEmptyFirstTime(!simulateEmptyFirstTime)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle first-time empty state preview"
          >
            <Radio className="h-3 w-3 text-zinc-400" />
            <span>{simulateEmptyFirstTime ? "Restore Runs" : "Test Empty State"}</span>
          </button>

          {/* Record Execution Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRecordModalOpen(true)}
            className="font-sans font-medium text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            <span>Record Execution</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Metrics Bar */}
      <ExecutionMetricsSummary
        totalCount={342}
        successCount={287}
        failedCount={55}
        investigationCount={12}
        activeFilter={activeMetricFilter}
        onFilterChange={handleMetricCardClick}
      />

      {/* 3. Filter & Search Controls */}
      <ExecutionFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        agents={MOCK_AGENTS}
        totalCount={MOCK_EXECUTIONS.length}
        filteredCount={filteredAndSortedExecutions.length}
      />

      {/* 4. Execution List or Empty States */}
      <div className="space-y-3">
        {simulateEmptyFirstTime ? (
          <ExecutionEmptyState
            type="first_time"
            onRecordExecution={() => setIsRecordModalOpen(true)}
          />
        ) : filteredAndSortedExecutions.length === 0 ? (
          <ExecutionEmptyState
            type="no_matches"
            onClearFilters={handleResetFilters}
          />
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExecutions.map((execution, index) => (
              <motion.div
                key={execution.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(index * 0.03, 0.3) }}
              >
                <ExecutionCardItem
                  execution={execution}
                  onQuickPeek={(ex) => setSelectedExecutionForDrawer(ex)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Detail Drawer for Quick Inspection */}
      <ExecutionQuickDrawer
        execution={selectedExecutionForDrawer}
        isOpen={!!selectedExecutionForDrawer}
        onClose={() => setSelectedExecutionForDrawer(null)}
      />

      {/* 6. Record Execution Code Snippet Modal */}
      <RecordExecutionModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
    </div>
  );
}
