"use client";

import * as React from "react";
import { AlertTriangle, ArrowRight, Sparkles, CheckCircle2, XCircle } from "lucide-react";

interface DivergencePointCardProps {
  step: number;
  stepTitle: string;
  leftBehavior: string;
  rightBehavior: string;
  downstreamEffect: string;
  divergenceRegion: string;
}

export function DivergencePointCard({
  step,
  stepTitle,
  leftBehavior,
  rightBehavior,
  downstreamEffect,
  divergenceRegion,
}: DivergencePointCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.08] shrink-0">
            <AlertTriangle className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
              Primary Divergence Point
            </span>
            <h3 className="text-sm font-semibold text-white">
              <span className="font-mono text-zinc-300">Step {step}</span> — {stepTitle}
            </h3>
          </div>
        </div>

        <span className="rounded-full bg-white/[0.06] text-zinc-300 border border-white/10 px-2.5 py-0.5 text-xs font-medium self-start sm:self-center">
          {divergenceRegion} Region
        </span>
      </div>

      {/* Side-by-Side Behavior Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
        {/* Left Execution Behavior */}
        <div className="rounded-lg border border-rose-500/20 bg-[#090d14] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-medium text-xs">
            <XCircle className="h-3.5 w-3.5" />
            <span>Left Execution Behavior</span>
          </div>
          <p className="text-zinc-300 leading-relaxed text-xs">
            {leftBehavior}
          </p>
        </div>

        {/* Right Execution Behavior */}
        <div className="rounded-lg border border-emerald-500/20 bg-[#090d14] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Right Execution Behavior</span>
          </div>
          <p className="text-zinc-300 leading-relaxed text-xs">
            {rightBehavior}
          </p>
        </div>
      </div>

      {/* Downstream Impact Alert */}
      <div className="rounded-lg border border-white/[0.06] bg-[#090d14] p-3.5 text-xs font-sans">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
          Downstream Effect
        </span>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {downstreamEffect}
        </p>
      </div>
    </div>
  );
}
