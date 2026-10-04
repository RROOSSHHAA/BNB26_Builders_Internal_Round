"use client";

import * as React from "react";
import { AgentHealthRun } from "@/types";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle, X } from "lucide-react";

interface AgentHealthBarProps {
  runs?: AgentHealthRun[];
  className?: string;
}

export function AgentHealthBar({ runs, className }: AgentHealthBarProps) {
  const defaultRuns: AgentHealthRun[] = [
    { id: "1", status: "ok" },
    { id: "2", status: "ok" },
    { id: "3", status: "ok" },
    { id: "4", status: "ok" },
    { id: "5", status: "warn" },
    { id: "6", status: "ok" },
    { id: "7", status: "fail", stepNumber: 73 },
    { id: "8", status: "ok" },
  ];

  const activeRuns = runs && runs.length > 0 ? runs : defaultRuns;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
        <span>Recent Runs (8)</span>
        <span>Timeline →</span>
      </div>

      <div className="flex items-center gap-1.5 select-none">
        {activeRuns.map((run, i) => {
          if (run.status === "fail") {
            return (
              <div
                key={run.id || i}
                title={`Execution ${run.executionId || "Failed"}${
                  run.stepNumber ? ` at Step ${run.stepNumber}` : ""
                }`}
                className="flex h-5 w-5 items-center justify-center rounded border border-red-500/40 bg-red-500/20 text-red-400 hover:scale-110 transition-transform"
              >
                <X className="h-3 w-3 stroke-[2.5]" />
              </div>
            );
          }

          if (run.status === "warn") {
            return (
              <div
                key={run.id || i}
                title={`Execution ${run.executionId || "Warning"}: Latency / Divergence Alert`}
                className="flex h-5 w-5 items-center justify-center rounded border border-amber-500/40 bg-amber-500/20 text-amber-300 hover:scale-110 transition-transform"
              >
                <AlertTriangle className="h-2.5 w-2.5 stroke-[2.5]" />
              </div>
            );
          }

          return (
            <div
              key={run.id || i}
              title={`Execution ${run.executionId || "Nominal"}: Completed successfully`}
              className="flex h-5 w-5 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:scale-110 transition-transform"
            >
              <Check className="h-3 w-3 stroke-[2.5]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
