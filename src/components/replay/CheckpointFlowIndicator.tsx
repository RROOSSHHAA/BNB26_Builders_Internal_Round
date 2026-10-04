"use client";

import * as React from "react";
import { Play, ArrowDown, Database, Cpu, CheckCircle2, Sparkles } from "lucide-react";

interface CheckpointFlowIndicatorProps {
  checkpointStep: number;
  modifiedStep: number;
  totalSteps: number;
  stepsReused: number;
  stepsReplayed: number;
}

export function CheckpointFlowIndicator({
  checkpointStep = 70,
  modifiedStep = 73,
  totalSteps = 127,
  stepsReused = 70,
  stepsReplayed = 57,
}: CheckpointFlowIndicatorProps) {
  const cachePercent = Math.round((stepsReused / totalSteps) * 100);
  const replayPercent = 100 - cachePercent;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-zinc-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider font-sans text-zinc-200">
            Checkpoint Execution Path
          </h3>
        </div>
        <span className="text-[11px] font-sans text-emerald-400 flex items-center gap-1.5 self-start sm:self-auto font-medium">
          <CheckCircle2 className="h-3 w-3" />
          {cachePercent}% Execution Reused (Zero Rerun)
        </span>
      </div>

      {/* Progress Track with Checkpoint and Modified Node */}
      <div className="relative pt-4 pb-2 px-2">
        {/* Track Line */}
        <div className="relative h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
          {/* Reused Cached bar */}
          <div
            className="absolute top-0 left-0 h-full bg-zinc-500/80 rounded-l-full transition-all duration-300"
            style={{ width: `${cachePercent}%` }}
          />
          {/* Replayed Path bar */}
          <div
            className="absolute top-0 h-full bg-white rounded-r-full transition-all duration-300"
            style={{ left: `${cachePercent}%`, width: `${replayPercent}%` }}
          />
        </div>

        {/* Node Markers on Track */}
        <div
          className="absolute -top-1.5 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${cachePercent}%` }}
        >
          <div className="h-5 w-5 rounded-full bg-zinc-300 ring-4 ring-[#0e121b] flex items-center justify-center shadow-lg">
            <div className="h-2 w-2 rounded-full bg-[#0e121b]" />
          </div>
        </div>

        <div
          className="absolute -top-1.5 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${Math.min(96, Math.round((modifiedStep / totalSteps) * 100))}%` }}
        >
          <div className="h-5 w-5 rounded-full bg-white ring-4 ring-[#0e121b] flex items-center justify-center shadow-lg">
            <div className="h-2 w-2 rounded-full bg-[#0e121b]" />
          </div>
        </div>
      </div>

      {/* 3-Stage Replay Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {/* 1. Cached Prefix */}
        <div className="flex flex-col rounded-lg border border-white/[0.08] bg-[#090d14] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-zinc-300 text-xs font-sans font-medium mb-1">
            <Database className="h-3.5 w-3.5 text-zinc-400" />
            <span>REUSED STATE</span>
          </div>
          <div className="text-sm font-semibold font-mono text-zinc-100">
            Steps 1 → {stepsReused}
          </div>
          <p className="mt-1 text-xs text-zinc-400 font-sans">
            State snapshot preserved. Tokens & latency cached.
          </p>
        </div>

        {/* 2. Checkpoint & Modification */}
        <div className="flex flex-col rounded-lg border border-white/20 bg-[#141824] p-3 text-center relative">
          <div className="flex items-center justify-center gap-1.5 text-white text-xs font-sans font-semibold mb-1">
            <Cpu className="h-3.5 w-3.5 text-zinc-300" />
            <span>CHECKPOINT: STEP {checkpointStep}</span>
          </div>
          <div className="text-sm font-semibold font-mono text-white">
            Modify Step {modifiedStep}
          </div>
          <p className="mt-1 text-xs text-zinc-300 font-sans">
            Alternative payload / rule injected at divergence point.
          </p>
        </div>

        {/* 3. Replayed Suffix */}
        <div className="flex flex-col rounded-lg border border-white/[0.08] bg-[#090d14] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-zinc-300 text-xs font-sans font-medium mb-1">
            <Play className="h-3.5 w-3.5 text-zinc-400" />
            <span>REPLAY PATH</span>
          </div>
          <div className="text-sm font-semibold font-mono text-zinc-100">
            Steps {checkpointStep + 1} → {totalSteps}
          </div>
          <p className="mt-1 text-xs text-zinc-400 font-sans">
            {stepsReplayed} downstream steps simulated in isolation.
          </p>
        </div>
      </div>
    </div>
  );
}
