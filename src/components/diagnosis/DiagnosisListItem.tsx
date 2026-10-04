"use client";

import * as React from "react";
import { Diagnosis } from "@/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import { AlertTriangle, Clock, ChevronRight, Terminal, Flame, Zap } from "lucide-react";

interface DiagnosisListItemProps {
  diagnosis: Diagnosis;
  isSelected?: boolean;
  onSelect: (diagnosis: Diagnosis) => void;
}

export function DiagnosisListItem({
  diagnosis,
  isSelected = false,
  onSelect,
}: DiagnosisListItemProps) {
  const confidencePercent = Math.round(diagnosis.confidenceScore * 100);

  return (
    <button
      type="button"
      onClick={() => onSelect(diagnosis)}
      className={cn(
        "group w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 font-sans",
        isSelected
          ? "border-white/40 bg-[#141824] shadow-sm ring-1 ring-white/20"
          : "border-white/[0.08] bg-[#0e121b] hover:border-white/20 hover:bg-[#141822]"
      )}
    >
      {/* Active Accent Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
      )}

      {/* Top Row: Agent, Framework, Execution ID, Status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-xs sm:text-sm text-zinc-100 group-hover:text-white transition-colors">
            {diagnosis.agentName || "Agent"}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/[0.06] bg-white/[0.02] text-zinc-400">
            {diagnosis.framework || "Agent"}
          </span>
          <span className="text-xs font-mono font-medium text-zinc-300">
            {diagnosis.executionId}
          </span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20 shrink-0">
          FAILED
        </span>
      </div>

      {/* Center: Failure Category & Suspicious Step */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-sans">
          <span className="text-zinc-200 font-semibold">
            {diagnosis.failureCategory || "Failure"} Anomaly:
          </span>
          <span className="text-zinc-400 font-medium truncate">
            Step {diagnosis.suspiciousStepNumber || 73} —{" "}
            {diagnosis.suspiciousStepTitle || "Validation"}
          </span>
        </div>

        {diagnosis.subcategory && (
          <p className="text-[11px] font-sans text-zinc-400 italic line-clamp-1">
            ↳ {diagnosis.subcategory}
          </p>
        )}
      </div>

      {/* Bottom Row: Confidence, Timestamp, Chevron */}
      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-zinc-400 w-full">
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <Flame className="h-3 w-3 text-zinc-400" />
          <span>{confidencePercent}% confidence</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500">
            {formatRelativeTime(diagnosis.detectedAt)}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
}
