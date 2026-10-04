"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MOCK_AGENTS, MOCK_EXECUTIONS } from "@/mock";
import { Agent, Execution } from "@/types";
import { AgentStatusIndicator } from "@/components/agent/AgentStatusIndicator";
import { AgentHealthBar } from "@/components/agent/AgentHealthBar";
import { AgentHealthChart } from "@/components/agent/AgentHealthChart";
import { AgentFailureDistributionChart } from "@/components/agent/AgentFailureDistributionChart";
import { AgentRecentExecutions } from "@/components/agent/AgentRecentExecutions";
import { ExecutionMicroFlow } from "@/components/execution/ExecutionMicroFlow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  Terminal,
  Cpu,
  Clock,
  Layers,
  SearchAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  Server,
  Zap,
} from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { DetailSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { mode, triggerRetry } = useDemoState();
  const agentId = (params?.id as string) || "agt_research";

  // Check if agent exists
  const matchedAgent = React.useMemo(() => {
    return MOCK_AGENTS.find(
      (a) => a.id.toLowerCase() === agentId.toLowerCase() || a.slug === agentId.toLowerCase()
    );
  }, [agentId]);

  const agent: Agent = matchedAgent || MOCK_AGENTS[0];

  // Find related executions for this agent
  const agentExecutions: Execution[] = React.useMemo(() => {
    const matched = MOCK_EXECUTIONS.filter(
      (e) => e.agentId === agent.id || e.agentName.toLowerCase().includes(agent.name.toLowerCase())
    );
    if (matched.length > 0) return matched;
    return MOCK_EXECUTIONS.slice(0, 3);
  }, [agent]);

  const latestExecution = agentExecutions[0] || MOCK_EXECUTIONS[0];

  // Loading state
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <DetailSkeleton />
      </div>
    );
  }

  // Not found or Error state
  if (!matchedAgent || mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-10 pb-16 font-sans">
        <ErrorState
          title="Agent not found"
          message={`Agent telemetry profile "${agentId}" could not be located in workspace Cham Cham.`}
          details={{
            queriedAgentId: agentId,
            workspace: "cham-cham",
            lookupTimestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Lookup"
          secondaryAction={{
            label: "Back to Agents",
            href: "/dashboard/agents",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-16 font-sans">
      {/* 1. Navigation & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <Link
          href="/dashboard/agents"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Agents</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm" className="font-sans font-medium">
            {agent.environment || "Production"}
          </Badge>
          <span className="text-xs font-mono text-zinc-500">ID: {agent.id}</span>
        </div>
      </div>

      {/* 2. Agent Overview Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-200 shrink-0">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                  {agent.name}
                </h1>
                <AgentStatusIndicator status={agent.status} />
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                {agent.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Link href={`/dashboard/executions?agent=${agent.id}`}>
              <Button variant="outline" size="sm" className="font-sans font-medium text-xs border-white/[0.08] text-zinc-200 hover:border-white/20 hover:text-white">
                <span>View Traces</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Compact Metadata Sub-strip */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/[0.04] text-xs font-sans text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-zinc-500" />
            <span>Model: <strong className="text-zinc-200 font-medium">{agent.model}</strong></span>
          </div>

          <span className="text-zinc-600">•</span>

          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-zinc-500" />
            <span>Framework: <strong className="text-zinc-200 font-medium">{agent.framework}</strong></span>
          </div>

          <span className="text-zinc-600">•</span>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>Last run: <strong className="text-zinc-200 font-medium">{formatRelativeTime(agent.lastRunAt)}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Agent Detail Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-sans select-none">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e121b]">
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Total Executions</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {agent.totalExecutions}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block font-sans">
            Recorded runs
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c1017]">
          <span className="text-[10px] text-zinc-500 uppercase block">Successful</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">
            {agent.successfulCount || 113}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block font-sans">
            {agent.successRate || 89}% nominal
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c1017]">
          <span className="text-[10px] text-zinc-500 uppercase block">Failed</span>
          <span className="text-2xl font-bold text-red-400 mt-1 block">
            {agent.failureCount || 14}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block font-sans">
            Divergences flagged
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c1017]">
          <span className="text-[10px] text-zinc-500 uppercase block">Average Duration</span>
          <span className="text-2xl font-bold text-zinc-200 mt-1 block">
            {formatDuration(agent.avgDurationMs)}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block font-sans">
            Per execution
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c1017]">
          <span className="text-[10px] text-zinc-500 uppercase block">Most Common Issue</span>
          <span className="text-lg font-bold text-amber-300 mt-1.5 block truncate">
            {agent.mostCommonIssue || "Validation"}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block font-sans truncate">
            Primary failure root
          </span>
        </div>
      </div>

      {/* 4. Latest Execution Intelligence (Micro-Region Flow) */}
      <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
              LATEST EXECUTION INTELLIGENCE ({latestExecution.id})
            </span>
          </div>

          <Link
            href={`/dashboard/executions/${latestExecution.id}`}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Open Execution Trace</span>
            <ArrowLeft className="h-3 w-3 rotate-180" />
          </Link>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-xs font-sans text-zinc-400">
            AI-compressed execution regions for the most recent run:
          </p>
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#0c1017] overflow-x-auto">
            <ExecutionMicroFlow regions={latestExecution.regions} />
          </div>
        </div>
      </div>

      {/* 5. Health Timeline Chart & Failure Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AgentHealthChart agentName={agent.name} />
        </div>
        <div className="lg:col-span-5">
          <AgentFailureDistributionChart distribution={agent.failureDistribution} />
        </div>
      </div>

      {/* 6. Recent Agent Executions List */}
      <AgentRecentExecutions executions={agentExecutions} agentName={agent.name} />
    </div>
  );
}
