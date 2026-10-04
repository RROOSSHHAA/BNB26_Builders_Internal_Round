"use client";

import * as React from "react";
import {
  GitCompare,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ComparisonInvestigation, ComparisonScenarioType } from "@/types";

interface ComparisonCardProps {
  comparison: ComparisonInvestigation;
  onSelect: (item: ComparisonInvestigation) => void;
  isSelected?: boolean;
}

export function ComparisonCard({
  comparison,
  onSelect,
  isSelected,
}: ComparisonCardProps) {
  const getScenarioLabel = (type: ComparisonScenarioType) => {
    switch (type) {
      case "successful_vs_failed":
        return {
          label: "Successful vs Failed",
          badgeClass: "bg-red-500/10 text-red-300 border-red-500/20",
        };
      case "original_vs_replay":
        return {
          label: "Original vs Replay",
          badgeClass: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        };
      case "original_vs_alternative":
        return {
          label: "Original vs Alternative",
          badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/20",
        };
    }
  };

  const scenario = getScenarioLabel(comparison.scenarioType);

  return (
    <div
      onClick={() => onSelect(comparison)}
      className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer font-sans ${
        isSelected
          ? "border-white/20 bg-[#141822] shadow-md shadow-black/40"
          : "border-white/[0.08] bg-[#0e121b] hover:border-white/[0.16] hover:bg-[#121624]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3 mb-3">
        {/* Title & Agent Identity */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 shrink-0">
            <GitCompare className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-zinc-100 group-hover:text-cyan-200 transition-colors">
                {comparison.title}
              </span>
              <span className="text-xs text-zinc-400">
                {comparison.agentName}
              </span>
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${scenario.badgeClass}`}
              >
                {scenario.label}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {comparison.createdAtAgo}
              </span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">
                Divergence: {comparison.divergenceRegion} (Step {comparison.approximateDivergenceStep})
              </span>
            </div>
          </div>
        </div>

        {/* View Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(comparison);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all shrink-0"
          >
            <span>View Comparison</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Comparison Snapshot Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Left Execution
          </span>
          <span className="text-red-300 font-semibold truncate block">
            {comparison.leftExecution.id} ({comparison.leftExecution.status})
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Right Execution
          </span>
          <span className="text-emerald-300 font-semibold truncate block">
            {comparison.rightExecution.id} ({comparison.rightExecution.status})
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Divergence Point
          </span>
          <span className="text-amber-300 font-semibold truncate block">
            Step {comparison.approximateDivergenceStep}
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Outcome Summary
          </span>
          <span className="text-zinc-200 font-medium truncate block">
            {comparison.resultSummary}
          </span>
        </div>
      </div>
    </div>
  );
}
