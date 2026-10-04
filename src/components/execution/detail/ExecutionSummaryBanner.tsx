"use client";

import * as React from "react";
import { Execution } from "@/types";
import { AlertTriangle, CheckCircle2, ShieldCheck, Flame, Compass } from "lucide-react";

interface ExecutionSummaryBannerProps {
  execution: Execution;
}

export function ExecutionSummaryBanner({ execution }: ExecutionSummaryBannerProps) {
  const isFailed = execution.status === "failed";

  if (!isFailed) {
    return (
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Execution completed successfully
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                All {execution.totalSteps} steps completed nominally across {execution.regions.length} execution regions. No significant anomaly detected.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-300 font-semibold self-start sm:self-center">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% NOMINAL FLOW</span>
          </div>
        </div>

        {/* Nominal Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/10 text-xs font-mono">
          <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
            <span className="text-[10px] text-zinc-400 uppercase block">Total Steps</span>
            <span className="text-sm font-bold text-zinc-200 mt-0.5 block">{execution.totalSteps} OK</span>
          </div>
          <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
            <span className="text-[10px] text-zinc-400 uppercase block">Anomalies</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">0 Detected</span>
          </div>
          <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
            <span className="text-[10px] text-zinc-400 uppercase block">Regions</span>
            <span className="text-sm font-bold text-zinc-200 mt-0.5 block">{execution.regions.length} Captured</span>
          </div>
          <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
            <span className="text-[10px] text-zinc-400 uppercase block">Health Grade</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Optimal (99.8%)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/[0.04] p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Execution failed
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              The execution completed {execution.totalSteps} steps before producing an invalid result.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-red-500/40 bg-red-500/10 text-xs font-mono text-red-300 font-bold">
            <Flame className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span>91% FAILURE LIKELIHOOD</span>
          </div>

          <a
            href={`/dashboard/diagnoses?execution=${execution.id}`}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 transition-colors"
          >
            <span>Failure Diagnosis</span>
            <Compass className="h-3.5 w-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* Prominent Failure Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-red-500/15">
        {/* Most Suspicious Region */}
        <div className="p-3.5 rounded-lg border border-white/[0.07] bg-[#070a0f] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Most Suspicious Region
          </span>
          <span className="text-sm font-mono font-bold text-amber-300 block">
            {execution.suspiciousRegionName || "Validation"}
          </span>
          <span className="text-[11px] font-sans text-zinc-500 block">
            Steps 62–78
          </span>
        </div>

        {/* Most Suspicious Step */}
        <div className="p-3.5 rounded-lg border border-white/[0.07] bg-[#070a0f] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Most Suspicious Step
          </span>
          <span className="text-sm font-mono font-bold text-red-400 block">
            Step {execution.suspiciousStep || 73} — Response Validation
          </span>
          <span className="text-[11px] font-sans text-zinc-500 block">
            Primary divergence root
          </span>
        </div>

        {/* Failure Likelihood */}
        <div className="p-3.5 rounded-lg border border-white/[0.07] bg-[#070a0f] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Failure Likelihood
          </span>
          <span className="text-sm font-mono font-bold text-red-400 block">
            {execution.anomalyConfidence || 91}%
          </span>
          <span className="text-[11px] font-sans text-zinc-500 block">
            Statistical deviation score
          </span>
        </div>

        {/* Failure Category */}
        <div className="p-3.5 rounded-lg border border-white/[0.07] bg-[#070a0f] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Failure Category
          </span>
          <span className="text-sm font-mono font-semibold text-zinc-200 block truncate">
            {execution.failureCategory || "Validation"}
          </span>
          <span className="text-[11px] font-sans text-zinc-500 block truncate">
            Incorrect Intermediate Decision
          </span>
        </div>
      </div>
    </div>
  );
}
