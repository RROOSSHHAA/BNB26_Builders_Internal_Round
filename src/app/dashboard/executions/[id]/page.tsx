"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MOCK_EXECUTIONS } from "@/mock";
import { Execution, ExecutionRegion } from "@/types";
import { ExecutionDetailHeader } from "@/components/execution/detail/ExecutionDetailHeader";
import { ExecutionSummaryBanner } from "@/components/execution/detail/ExecutionSummaryBanner";
import { ExecutionMapInteractive } from "@/components/execution/detail/ExecutionMapInteractive";
import { AnomalousRegionPanel } from "@/components/execution/detail/AnomalousRegionPanel";
import { StepContextViewer } from "@/components/execution/detail/StepContextViewer";
import { ExecutionCausalStory } from "@/components/execution/detail/ExecutionCausalStory";
import { ExecutionHealthSummary } from "@/components/execution/detail/ExecutionHealthSummary";
import { ExecutionActionPanel } from "@/components/execution/detail/ExecutionActionPanel";
import { RawTraceViewer } from "@/components/execution/detail/RawTraceViewer";
import { useDemoState } from "@/context/DemoStateContext";
import { DetailSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PartialDataState } from "@/components/ui/partial-data-state";

export default function ExecutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { mode, triggerRetry } = useDemoState();
  const executionId = (params?.id as string) || "EX-2048";

  const [customExecutions, setCustomExecutions] = React.useState<Execution[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("blackbox_custom_executions") || "[]");
        setCustomExecutions(stored);
      } catch {}
    }
  }, []);

  // Check if execution exists in custom or mock dataset
  const foundExecution = React.useMemo(() => {
    const all = [...customExecutions, ...MOCK_EXECUTIONS];
    const match = all.find(
      (e) => e.id.toLowerCase() === executionId.toLowerCase()
    );

    const baseTemplate = MOCK_EXECUTIONS[0]; // EX-2048 high-fidelity flight recording

    if (match) {
      // If match has complete regions and steps, return directly
      if (
        match.regions &&
        match.regions.length > 0 &&
        match.regions[0].steps &&
        match.regions[0].steps.length > 0
      ) {
        return match;
      }
      // Otherwise merge with base flight telemetry so all charts & steps render smoothly
      return {
        ...baseTemplate,
        ...match,
        id: executionId,
        regions: baseTemplate.regions.map((r) => ({
          ...r,
          executionId: executionId,
        })),
      };
    }

    // Zero-Crash Demo Protection:
    // If ANY execution ID (e.g. EX-6695) is queried, dynamically synthesize its flight recorder payload
    return {
      ...baseTemplate,
      id: executionId,
      triggerPrompt: `Mission execution telemetry record for ${executionId}`,
      regions: baseTemplate.regions.map((r) => ({
        ...r,
        executionId: executionId,
      })),
    };
  }, [executionId, customExecutions]);

  const execution: Execution = foundExecution;
  const isFailed = execution.status === "failed";

  // Identify default selected region (anomalous region if failed, or first region if nominal)
  const defaultRegion = React.useMemo(() => {
    if (isFailed) {
      const anomalous = execution.regions.find(
        (r) => r.status === "critical" || r.isAnomaly || r.name.toLowerCase().includes("validation")
      );
      if (anomalous) return anomalous;
    }
    return execution.regions[0] || MOCK_EXECUTIONS[0].regions[0];
  }, [execution, isFailed]);

  const [selectedRegion, setSelectedRegion] = React.useState<ExecutionRegion>(defaultRegion);
  const [selectedStepNumber, setSelectedStepNumber] = React.useState<number>(
    execution.suspiciousStep || 73
  );

  // Sync selected region if execution changes
  React.useEffect(() => {
    setSelectedRegion(defaultRegion);
    setSelectedStepNumber(execution.suspiciousStep || 73);
  }, [defaultRegion, execution]);

  // Loading state
  if (mode === "loading") {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono">
        <DetailSkeleton />
      </div>
    );
  }

  // Error state only if mode explicitly set to error
  if (mode === "error") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto pt-10 pb-16 font-mono">
        <ErrorState
          title="Telemetry Stream Disrupted"
          message={`Unable to connect to live telemetry flight recorder stream for execution "${executionId}".`}
          details={{
            queriedId: executionId,
            workspace: "cham-cham",
            lookupTimestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Connection"
          secondaryAction={{
            label: "Back to Executions",
            href: "/dashboard/executions",
          }}
        />
      </div>
    );
  }

  // Action button handlers
  const handleInvestigateClick = () => {
    // Focus the suspicious region and scroll into view smoothly
    const anomalous = execution.regions.find(
      (r) => r.status === "critical" || r.isAnomaly
    );
    if (anomalous) {
      setSelectedRegion(anomalous);
      setSelectedStepNumber(execution.suspiciousStep || 73);
    }
  };

  const handleReplayClick = () => {
    router.push(`/dashboard/replays?executionId=${execution.id}`);
  };

  const handleCompareClick = () => {
    router.push(`/dashboard/comparisons?target=${execution.id}&baseline=EX-2047`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Header */}
      <ExecutionDetailHeader
        execution={execution}
        onInvestigateClick={handleInvestigateClick}
        onReplayClick={handleReplayClick}
        onCompareClick={handleCompareClick}
      />

      {/* Partial Data State Notification */}
      {mode === "partial" && (
        <PartialDataState
          missingDataName="Root-Cause Diagnosis Telemetry"
          impactDescription="Trace execution steps (1–127) and memory buffers are fully intact, but automated diagnosis classification is delayed."
          onRetry={triggerRetry}
        />
      )}

      {/* 2. Execution Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ExecutionSummaryBanner execution={execution} />
      </motion.div>

      {/* 3. Main Visualization: Execution Intelligence Map */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <ExecutionMapInteractive
          execution={execution}
          regions={execution.regions}
          selectedRegionId={selectedRegion?.id || ""}
          onSelectRegion={(reg) => setSelectedRegion(reg)}
        />
      </motion.div>

      {/* 4. Investigation Grid (Region Panel + Step Context) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Selected / Anomalous Region Deep Dive */}
        <div className="lg:col-span-5 space-y-6">
          <AnomalousRegionPanel
            region={selectedRegion}
            onSelectStep={(step) => setSelectedStepNumber(step)}
          />

          {/* Action Panel */}
          <ExecutionActionPanel
            execution={execution}
            onOpenStepDetail={() => setSelectedStepNumber(execution.suspiciousStep || 73)}
          />
        </div>

        {/* Right Column: Local Step Context & Step 73 Details */}
        <div className="lg:col-span-7 space-y-6">
          <StepContextViewer
            selectedStepNumber={selectedStepNumber}
            onSelectStep={(step) => setSelectedStepNumber(step)}
          />

          {/* Execution Health Summary */}
          <ExecutionHealthSummary execution={execution} />
        </div>
      </div>

      {/* 5. Causal Timeline Progression (Execution Context) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <ExecutionCausalStory execution={execution} />
      </motion.div>

      {/* 6. Raw Execution Trace (Collapsed by Default) */}
      <RawTraceViewer
        steps={selectedRegion?.steps}
        suspiciousStepNumber={execution.suspiciousStep || 73}
      />
    </div>
  );
}
