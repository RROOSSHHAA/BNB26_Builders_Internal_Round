"use client";

import * as React from "react";
import Link from "next/link";
import { Execution } from "@/types";
import { ExecutionStatusBadge } from "@/components/execution/execution-status";
import { ExecutionMicroFlow } from "@/components/execution/ExecutionMicroFlow";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
import { ChevronRight, Clock, AlertTriangle, Layers, ArrowRight } from "lucide-react";

interface AgentRecentExecutionsProps {
  executions: Execution[];
  agentName: string;
}

export function AgentRecentExecutions({
  executions,
  agentName,
}: AgentRecentExecutionsProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
              RECENT AGENT EXECUTIONS
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Latest captured runs for {agentName}. Click any execution to inspect complete telemetry.
          </p>
        </div>

        <Link
          href="/dashboard/executions"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>All Runs</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List of Recent Executions */}
      <div className="space-y-3">
        {executions.map((exec) => {
          const isFailed = exec.status === "failed";

          return (
            <Link
              key={exec.id}
              href={`/dashboard/executions/${exec.id}`}
              className={`group block p-4 rounded-xl border transition-all duration-200 ${
                isFailed
                  ? "border-red-500/30 bg-red-950/[0.08] hover:border-red-500/50 hover:bg-red-950/[0.15]"
                  : "border-white/[0.06] bg-[#0c1017] hover:border-white/20 hover:bg-[#101520]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: ID, Status, Step Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {exec.id}
                    </span>
                    <ExecutionStatusBadge status={exec.status} size="sm" />
                    <span className="text-xs font-mono text-zinc-400">
                      {exec.totalSteps} steps
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs font-mono text-zinc-400">
                      {formatDuration(exec.durationMs)}
                    </span>
                  </div>

                  {/* Failure Info if applicable */}
                  {isFailed ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-red-300 font-semibold">
                      <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                      <span>
                        Step {exec.suspiciousStep || 73} — {exec.failureCategory || "Validation"}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-sans line-clamp-1">
                      {exec.triggerPrompt}
                    </p>
                  )}
                </div>

                {/* Right: Timestamp and Arrow */}
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(exec.startTime)}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Compressed Execution Region Preview Bar */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0">
                  Compressed Regions:
                </span>
                <ExecutionMicroFlow regions={exec.regions} compact />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
