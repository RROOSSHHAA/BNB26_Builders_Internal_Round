"use client";

import * as React from "react";
import Link from "next/link";
import { Execution } from "@/types";
import { ExecutionStatusBadge } from "./execution-status";
import { formatDuration } from "@/lib/utils";
import {
  Terminal,
  ChevronRight,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface RecentExecutionsListProps {
  executions: Execution[];
  className?: string;
}

export function RecentExecutionsList({
  executions,
  className,
}: RecentExecutionsListProps) {
  // Focus on EX-2048, EX-2047, EX-2046
  const recentList = executions.slice(0, 3);

  const getSuspiciousStep = (id: string) => {
    if (id === "EX-2048") return "Step 73 (Validation)";
    if (id === "EX-2046") return "Step 41 (Tool Call)";
    return null;
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {recentList.map((exec) => {
          const suspiciousStep = getSuspiciousStep(exec.id);

          return (
            <Link
              key={exec.id}
              href={`/dashboard/executions/${exec.id}`}
              className="group block rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 sm:p-5 hover:border-white/20 hover:bg-[#121624] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg border mt-0.5 shrink-0 ${
                      exec.status === "failed" || exec.status === "anomaly"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        : "border-white/10 bg-white/[0.04] text-zinc-300"
                    }`}
                  >
                    <Terminal className="h-4 w-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-zinc-100 transition-colors">
                        {exec.agentName}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        #{exec.id}
                      </span>
                      <ExecutionStatusBadge status={exec.status} size="sm" />
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 font-sans">
                      {exec.triggerPrompt}
                    </p>

                    {suspiciousStep && (
                      <div className="flex items-center gap-1.5 text-[11px] font-sans text-rose-400 pt-0.5 font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Suspicious: {suspiciousStep}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-sans text-zinc-400 sm:text-right shrink-0">
                  <div>
                    <span className="text-zinc-200 font-semibold block font-mono">
                      {exec.totalSteps} steps
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {formatDuration(exec.durationMs)}
                    </span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
