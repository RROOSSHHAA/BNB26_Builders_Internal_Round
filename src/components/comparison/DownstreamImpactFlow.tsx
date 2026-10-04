"use client";

import * as React from "react";
import { ArrowRight, GitCommit, CheckCircle2, XCircle } from "lucide-react";

interface DownstreamImpactFlowProps {
  divergenceStep: number;
  regionName: string;
  nextRegionName: string;
  leftOutcome: string;
  rightOutcome: string;
}

export function DownstreamImpactFlow({
  divergenceStep,
  regionName,
  nextRegionName,
  leftOutcome,
  rightOutcome,
}: DownstreamImpactFlowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-zinc-300" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Downstream Impact Propagation
          </h4>
        </div>
        <span className="text-[11px] text-zinc-400">
          Cascade from Step {divergenceStep}
        </span>
      </div>

      {/* Sequential Flow Nodes */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-white/[0.06] bg-[#090d14]">
        <div className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-amber-300 font-medium text-xs">
          Divergence: <span className="font-mono">Step {divergenceStep}</span>
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-zinc-500 shrink-0" />

        <div className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-zinc-300 text-xs">
          {regionName}
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-zinc-500 shrink-0" />

        <div className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-zinc-300 text-xs">
          {nextRegionName}
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-zinc-500 shrink-0" />

        <div className="rounded-md bg-white/[0.08] border border-white/[0.12] px-2.5 py-1 text-zinc-200 font-medium text-xs">
          Final Outcome
        </div>
      </div>

      {/* Outcome Comparison Dual Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-[#090d14] p-3">
          <span className="text-zinc-400 text-xs">Left Outcome:</span>
          <div className="flex items-center gap-1.5 text-red-300 font-medium text-xs">
            <XCircle className="h-3.5 w-3.5 text-red-400" />
            <span>{leftOutcome}</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-[#090d14] p-3">
          <span className="text-zinc-400 text-xs">Right Outcome:</span>
          <div className="flex items-center gap-1.5 text-emerald-300 font-medium text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{rightOutcome}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
