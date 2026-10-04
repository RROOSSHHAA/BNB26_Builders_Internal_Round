"use client";

import * as React from "react";
import {
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Terminal,
  Cpu,
} from "lucide-react";
import { ReplayInvestigation } from "@/types";

interface ReplayCardProps {
  replay: ReplayInvestigation;
  onSelect: (replay: ReplayInvestigation) => void;
  isSelected?: boolean;
}

export function ReplayCard({
  replay,
  onSelect,
  isSelected,
}: ReplayCardProps) {
  const isSuccess = replay.replayResult === "SUCCESS";

  return (
    <div
      onClick={() => onSelect(replay)}
      className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer backdrop-blur-xs ${
        isSelected
          ? "border-cyan-500/50 bg-[#101726] shadow-lg shadow-cyan-500/5"
          : "border-white/[0.08] bg-[#0c1017]/80 hover:border-white/[0.16] hover:bg-[#0f1422]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3 mb-3">
        {/* Agent & Execution Identity */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg border shrink-0 ${
              isSuccess
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <Play className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-zinc-100 font-mono group-hover:text-cyan-200 transition-colors">
                {replay.agentName}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {replay.originalExecutionId}
              </span>
              {replay.framework && (
                <span className="rounded bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                  {replay.framework}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {replay.createdAtAgo}
              </span>
              <span>•</span>
              <span>{replay.totalSteps} total steps</span>
            </div>
          </div>
        </div>

        {/* Delta Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="rounded px-2 py-0.5 text-[10px] font-medium border border-red-500/30 bg-red-500/10 text-red-300">
              {replay.originalResult}
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-500" />
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
                isSuccess
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {replay.replayResult}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(replay);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-zinc-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all shrink-0 ml-1"
          >
            <span>View Replay</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Checkpoint & Modification Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Checkpoint
          </span>
          <span className="text-zinc-200 font-semibold">
            Step {replay.checkpointStep}
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Modified Step
          </span>
          <span className="text-amber-300 font-semibold truncate block">
            Step {replay.modifiedStep} — {replay.modifiedStepTitle}
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            State Reused
          </span>
          <span className="text-emerald-400 font-medium">
            Steps 1 → {replay.stepsReused} (Cached)
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Simulated Path
          </span>
          <span className="text-cyan-300 font-medium">
            {replay.stepsReplayed} steps replayed
          </span>
        </div>
      </div>

      {/* Outcome Summary snippet */}
      <p className="mt-2.5 text-xs text-zinc-400 font-mono line-clamp-1 leading-relaxed">
        {replay.outcomeSummary}
      </p>
    </div>
  );
}
