"use client";

import * as React from "react";
import { Execution } from "@/types";
import { formatDuration } from "@/lib/utils";
import { HeartPulse, CheckCircle2, AlertTriangle, Layers, Clock } from "lucide-react";

interface ExecutionHealthSummaryProps {
  execution: Execution;
}

export function ExecutionHealthSummary({ execution }: ExecutionHealthSummaryProps) {
  const isFailed = execution.status === "failed";

  // Calculate region counts
  const healthyCount = execution.regions.filter(
    (r) => r.status === "healthy" && !r.isAnomaly
  ).length;

  const anomalousCount = execution.regions.filter(
    (r) => r.status === "critical" || r.isAnomaly
  ).length;

  const affectedCount = execution.regions.filter(
    (r) => r.status === "affected" || (r.status === "warning" && isFailed)
  ).length;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
            EXECUTION HEALTH
          </span>
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
            isFailed
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          }`}
        >
          {isFailed ? "FAILED" : "SUCCESS"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Overall Status</span>
          <span
            className={`font-bold mt-1 block uppercase ${
              isFailed ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {isFailed ? "FAILED" : "SUCCESS"}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Healthy Regions</span>
          <span className="text-emerald-400 font-bold mt-1 block">
            {healthyCount}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Anomalous Regions</span>
          <span
            className={`font-bold mt-1 block ${
              anomalousCount > 0 ? "text-red-400" : "text-zinc-500"
            }`}
          >
            {anomalousCount}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Affected Regions</span>
          <span
            className={`font-bold mt-1 block ${
              affectedCount > 0 ? "text-amber-400" : "text-zinc-500"
            }`}
          >
            {affectedCount}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Total Steps</span>
          <span className="text-zinc-200 font-bold mt-1 block">
            {execution.totalSteps}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Total Duration</span>
          <span className="text-zinc-200 font-bold mt-1 block">
            {formatDuration(execution.durationMs)}
          </span>
        </div>
      </div>
    </div>
  );
}
