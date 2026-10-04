"use client";

import * as React from "react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ExecutionIntelligenceMap } from "@/components/execution/ExecutionIntelligenceMap";
import { InvestigationDrawer } from "@/components/execution/InvestigationDrawer";
import { ExecutionHealthWidget } from "@/components/execution/ExecutionHealthWidget";
import { FailureDistributionWidget } from "@/components/execution/FailureDistributionWidget";
import { RecentExecutionsList } from "@/components/execution/RecentExecutionsList";
import { MOCK_EXECUTIONS } from "@/mock";
import { ExecutionRegion } from "@/types";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  ChevronRight,
  Disc,
  Play,
  Copy,
  Check,
  Search,
  Code2,
} from "lucide-react";

import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton, IntelligenceMapSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { InlineError } from "@/components/ui/inline-error";

export default function DashboardOverviewPage() {
  const { mode, triggerRetry } = useDemoState();

  // Flagship execution EX-2048 (Research Agent, 127 steps, 18.4s, Failed)
  const flagshipExecution =
    MOCK_EXECUTIONS.find((e) => e.id === "EX-2048") || MOCK_EXECUTIONS[0];

  // State for the investigation drawer
  const [selectedRegion, setSelectedRegion] = React.useState<ExecutionRegion | null>(null);
  const [isInvestigationDrawerOpen, setIsInvestigationDrawerOpen] = React.useState(false);
  const [targetStepNumber, setTargetStepNumber] = React.useState<number>(73);

  // State for mock Record Execution modal
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  // Section error demonstration state
  const [isMapUnavailable, setIsMapUnavailable] = React.useState(false);

  const handleSelectRegion = (region: ExecutionRegion) => {
    setSelectedRegion(region);
    setTargetStepNumber(region.isAnomaly ? 73 : region.startStep);
    setIsInvestigationDrawerOpen(true);
  };

  const handleInvestigateAnomaly = () => {
    const anomalyRegion =
      flagshipExecution.regions.find((r) => r.isAnomaly) || flagshipExecution.regions[2];
    setSelectedRegion(anomalyRegion);
    setTargetStepNumber(73);
    setIsInvestigationDrawerOpen(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`from blackbox import BlackBox\n\nrecorder = BlackBox.init(workspace="cham-cham")\n\n@recorder.record(name="Research Agent")\ndef run_agent_workflow(prompt):\n    # Agent logic executes here\n    return result`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 1. Full Page Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-8 pb-12 font-mono">
        <PageSkeleton cardCount={4} showTable={false} />
        <IntelligenceMapSkeleton />
        <PageSkeleton showCards={false} cardCount={0} showTable={true} />
      </div>
    );
  }

  // 2. Full Page Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto pt-8 font-sans">
        <ErrorState
          title="Unable to load dashboard telemetry"
          message="Black Box could not synchronize live telemetry stream for workspace Cham Cham. The telemetry socket connection timed out."
          details={{
            errorCode: "ERR_TELEMETRY_SYNC_TIMEOUT",
            workspaceId: "ws_cham_cham",
            targetEndpoint: "wss://telemetry.blackbox.internal/v1/stream",
            retryAttempt: 3,
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Try Again"
          secondaryAction={{
            label: "View Executions",
            href: "/dashboard/executions",
          }}
        />
      </div>
    );
  }

  // 3. Workspace Empty State
  if (mode === "empty") {
    return (
      <div className="space-y-8 pb-12 max-w-3xl mx-auto pt-6 font-sans">
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">Workspace Overview</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Workspace &ldquo;Cham Cham&rdquo; has not received telemetry yet.
          </p>
        </div>

        <EmptyState
          icon={Activity}
          title="No executions recorded yet"
          description="Once your AI agents are instrumented with the Black Box recorder, real-time telemetry and execution regions will appear here."
          primaryAction={{
            label: "Record Execution",
            onClick: () => setIsRecordModalOpen(true),
          }}
          secondaryAction={{
            label: "View Integrations",
            href: "/dashboard/integrations",
          }}
        />

        {/* Modal preserved for recording */}
        <Modal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          title="Record AI Agent Execution"
          description="Instrument your agent runtime with the Black Box flight recorder tracer."
          footer={
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyCode}
              className="text-xs font-sans font-medium gap-1.5"
            >
              {copiedCode ? "Snippet Copied" : "Copy Python Hook"}
            </Button>
          }
        >
          <pre className="p-3.5 rounded-lg bg-black/80 border border-white/[0.08] text-xs font-mono text-zinc-200">
{`from blackbox import BlackBox
recorder = BlackBox.init(workspace="cham-cham")`}
          </pre>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-400 font-semibold">
              EXECUTION INTELLIGENCE
            </span>
            <Badge variant="default" size="sm">
              Workspace: Cham Cham
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Understand why your agents fail.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed font-sans">
            Black Box analyzes AI-agent execution paths, identifies suspicious regions, and helps you investigate failures without drowning in raw logs.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0 font-sans">
          <Link href="/dashboard/executions">
            <Button variant="secondary" size="sm" className="text-xs gap-1.5 font-medium">
              <Terminal className="h-3.5 w-3.5 text-zinc-400" />
              <span>View Executions</span>
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRecordModalOpen(true)}
            className="text-xs gap-1.5 font-medium"
          >
            <Disc className="h-3.5 w-3.5" />
            <span>Record Execution</span>
          </Button>
        </div>
      </div>

      {/* 2. KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Executions"
          value="342"
          subtext="Total agent workflows captured"
          icon={Activity}
          trend={{ value: "+18 24h", positive: true }}
          accentColor="default"
        />
        <MetricCard
          title="Successful"
          value="287"
          subtext="83.9% baseline completion"
          icon={CheckCircle2}
          trend={{ value: "Nominal", positive: true }}
          accentColor="default"
        />
        <MetricCard
          title="Failed"
          value="55"
          subtext="16.1% execution divergence"
          icon={XCircle}
          trend={{ value: "5 flagged today", positive: false }}
          accentColor="crimson"
        />
        <MetricCard
          title="Failure Detection"
          value="91%"
          subtext="Demo heuristic classification"
          icon={Sparkles}
          trend={{ value: "50/55 isolated", positive: true }}
          accentColor="default"
        />
      </div>

      {/* 3 & 4 & 5. EXECUTION INTELLIGENCE MAP (CENTERPIECE) */}
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-normal text-zinc-200 font-sans">
              Active Focus: Flagship Execution Analysis
            </h2>
            <Badge variant="default" size="sm">
              Interactive Map
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMapUnavailable((prev) => !prev)}
              className="text-[11px] font-sans text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isMapUnavailable ? "[Restore Map]" : "[Simulate Section Error]"}
            </button>
            <span className="text-xs font-sans text-zinc-400 hidden sm:inline">
              Click any region to open step investigation
            </span>
          </div>
        </div>

        {isMapUnavailable ? (
          <InlineError
            title="Execution Intelligence Map Unavailable"
            message="The WebGL visualization context or trajectory telemetry stream encountered a synchronization timeout. Other dashboard widgets remain operational."
            onRetry={() => setIsMapUnavailable(false)}
            retryLabel="Retry Map"
          />
        ) : (
          <ExecutionIntelligenceMap
            execution={flagshipExecution}
            onSelectRegion={handleSelectRegion}
            onInvestigateAnomaly={handleInvestigateAnomaly}
          />
        )}
      </div>

      {/* 7 & 8. EXECUTION HEALTH & FAILURE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <ExecutionHealthWidget
            total={342}
            successful={287}
            failed={55}
            diagnosed={50}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-6 flex flex-col">
          <FailureDistributionWidget className="h-full" />
        </div>
      </div>

      {/* 9. RECENT EXECUTIONS */}
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-200 font-sans">
              Recent Executions
            </h2>
            <Badge variant="default" size="sm">
              Live Stream
            </Badge>
          </div>
          <Link
            href="/dashboard/executions"
            className="text-xs font-sans font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>All 342 runs</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <RecentExecutionsList executions={MOCK_EXECUTIONS} />
      </div>

      {/* INVESTIGATION DRAWER (Step 73 & Region Deep Dive) */}
      <InvestigationDrawer
        isOpen={isInvestigationDrawerOpen}
        onClose={() => setIsInvestigationDrawerOpen(false)}
        region={selectedRegion}
        targetStepNumber={targetStepNumber}
      />

      {/* MOCK RECORD EXECUTION MODAL */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record AI Agent Execution"
        description="Instrument your agent runtime with the Black Box flight recorder tracer."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecordModalOpen(false)}
              className="text-xs font-sans"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyCode}
              className="text-xs font-sans font-medium gap-1.5"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Snippet Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Python Hook</span>
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Add the lightweight flight recorder decorator to your agent execution entrypoint. Telemetry spans are captured with sub-millisecond overhead and automatically partitioned into compressed regions:
          </p>

          <pre className="p-3.5 rounded-lg bg-black/80 border border-white/[0.08] text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
{`from blackbox import BlackBox

recorder = BlackBox.init(workspace="cham-cham")

@recorder.record(name="Research Agent")
def run_agent_workflow(prompt):
    # Agent logic executes here
    return result`}
          </pre>

          <div className="rounded-lg border border-white/[0.06] bg-[#070a10] p-3 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Workspace: Cham Cham</span>
            <span className="text-emerald-400">Socket: Live Ingestion (0.4ms)</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
