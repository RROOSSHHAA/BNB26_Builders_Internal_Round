"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Agent } from "@/types";
import { AgentStatusIndicator } from "./AgentStatusIndicator";
import { AgentHealthBar } from "./AgentHealthBar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import {
  Terminal,
  Cpu,
  Clock,
  ArrowRight,
  Flame,
  SearchAlert,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(`/dashboard/agents/${agent.id}`);
  };

  const hasFailures = (agent.failureCount || 0) > 0;

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-xl border border-white/[0.08] bg-[#0e121b] hover:border-white/[0.16] hover:bg-[#121624] transition-all duration-200 cursor-pointer overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-lg shadow-black/40 font-sans"
    >
      {/* Top Header: Name, Status, Framework */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base font-sans text-white group-hover:text-zinc-200 transition-colors">
              {agent.name}
            </h3>
          </div>

          <AgentStatusIndicator status={agent.status} />
        </div>

        <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* Model & Execution Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.04] text-xs font-sans">
        <div className="p-2.5 rounded-lg border border-white/[0.04] bg-[#090d14]">
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Model</span>
          <span className="font-medium text-zinc-200 mt-0.5 block truncate text-[11px]">
            {agent.model}
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-white/[0.04] bg-[#090d14]">
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Executions</span>
          <span className="font-bold font-mono text-zinc-200 mt-0.5 block">
            {agent.totalExecutions}
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-white/[0.04] bg-[#090d14]">
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Success Rate</span>
          <span className="font-bold font-mono text-emerald-400 mt-0.5 block">
            {agent.successRate || 89}%
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-white/[0.04] bg-[#090d14]">
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Failures</span>
          <span className="font-bold font-mono text-red-400 mt-0.5 block">
            {agent.failureCount || 0}
          </span>
        </div>
      </div>

      {/* Health Pattern Visualization */}
      <AgentHealthBar runs={agent.recentHealth} />

      {/* Failure Insight Strip (if agent has failures) */}
      {hasFailures && agent.failureInsight && (
        <Link
          href={`/dashboard/diagnoses?execution=${agent.failureInsight.latestFailureExecutionId}`}
          onClick={(e) => e.stopPropagation()}
          className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] hover:bg-amber-500/10 transition-colors flex items-center justify-between text-xs font-sans text-zinc-300 group/failure"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium text-[11px]">
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Most frequent issue: {agent.failureInsight.mostFrequentIssue}</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">
              Latest failure: Step {agent.failureInsight.latestFailureStep} (
              {agent.failureInsight.mostSuspiciousRegion})
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-300 group-hover/failure:translate-x-0.5 transition-transform shrink-0">
            <span>Diagnose</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </Link>
      )}

      {/* Card Footer: Last Execution & View Agent Button */}
      <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-zinc-400">
        <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
          <Clock className="h-3 w-3" />
          <span>Last run: {formatRelativeTime(agent.lastRunAt)}</span>
        </div>

        <Link
          href={`/dashboard/agents/${agent.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            className="font-sans font-medium text-xs border-white/[0.08] text-zinc-200 hover:border-white/20 hover:text-white"
          >
            <span>View Agent</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
