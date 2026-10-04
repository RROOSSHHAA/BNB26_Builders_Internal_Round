"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GitFork, CheckCircle2, AlertTriangle, ArrowRight, ArrowDown } from "lucide-react";

interface ExecutionDivergenceMapProps {
  failedExecutionId?: string;
  divergenceStep?: number;
  divergenceRegion?: string;
  className?: string;
}

export function ExecutionDivergenceMap({
  failedExecutionId = "EX-2048",
  divergenceStep = 73,
  divergenceRegion = "Validation",
  className,
}: ExecutionDivergenceMapProps) {
  const nominalRegions = [
    { name: "Retrieval", status: "ok", label: "Normal" },
    { name: "Reasoning", status: "ok", label: "Normal" },
    { name: "Validation", status: "ok", label: "Nominal" },
    { name: "Finalization", status: "ok", label: "Nominal" },
  ];

  const failedRegions = [
    { name: "Retrieval", status: "ok", label: "Normal" },
    { name: "Reasoning", status: "ok", label: "Normal" },
    { name: "Validation", status: "divergence", label: "Divergence (Step 73)" },
    { name: "Finalization", status: "affected", label: "Affected" },
  ];

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-5 select-none font-sans",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-zinc-400" />
            <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-300 font-semibold">
              WHERE DID THE EXECUTION DIVERGE?
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            AI-compressed execution path comparison against nominal golden trace baseline.
          </p>
        </div>

        <span className="text-[10px] font-sans px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-zinc-300 font-semibold self-start sm:self-center">
          FORK DETECTED AT REGION 03
        </span>
      </div>

      <div className="space-y-4">
        {/* 1. Successful Path (Baseline) */}
        <div className="space-y-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/[0.08]">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Successful Path (Golden Baseline)</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">EX-2047 Reference</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans text-xs">
            {nominalRegions.map((reg, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono">0{idx + 1}</span>
                  <span className="text-emerald-400 font-semibold">{reg.label}</span>
                </div>
                <span className="font-semibold text-zinc-200 mt-1 uppercase text-xs">
                  {reg.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divergence Fork Transition Marker */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-white/15" />
          </div>
          <div className="relative px-3 py-1 rounded-full bg-[#0e121b] border border-white/20 text-[10px] font-sans text-zinc-200 flex items-center justify-center gap-1.5 shadow-lg max-w-[95%] text-center">
            <AlertTriangle className="h-3 w-3 text-zinc-400 shrink-0" />
            <span className="truncate">Path Divergence in {divergenceRegion} (Step {divergenceStep})</span>
          </div>
        </div>

        {/* 2. Failed Path (Captured Run) */}
        <div className="space-y-2 p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/[0.08]">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Failed Path ({failedExecutionId})</span>
            </span>
            <span className="text-[10px] text-rose-300">Diverged at Step {divergenceStep}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans text-xs">
            {failedRegions.map((reg, idx) => {
              const isDivergence = reg.status === "divergence";
              const isAffected = reg.status === "affected";

              return (
                <div
                  key={idx}
                  className={cn(
                    "p-2.5 rounded-lg border flex flex-col justify-between transition-all",
                    isDivergence
                      ? "border-rose-500/50 bg-rose-950/30 ring-1 ring-rose-500/40"
                      : isAffected
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-white/[0.06] bg-[#0c1017]"
                  )}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-mono">0{idx + 1}</span>
                    <span
                      className={cn(
                        "font-semibold uppercase",
                        isDivergence
                          ? "text-rose-300"
                          : isAffected
                          ? "text-zinc-400"
                          : "text-emerald-400"
                      )}
                    >
                      {reg.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-semibold mt-1 uppercase text-xs",
                      isDivergence
                        ? "text-rose-200"
                        : isAffected
                        ? "text-zinc-300"
                        : "text-zinc-200"
                    )}
                  >
                    {reg.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
