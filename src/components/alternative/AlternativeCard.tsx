"use client";

import * as React from "react";
import {
  GitFork,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { AlternativeInvestigation, AlternativeOutcomeStatus } from "@/types";

interface AlternativeCardProps {
  investigation: AlternativeInvestigation;
  onSelect: (item: AlternativeInvestigation) => void;
  isSelected?: boolean;
}

export function AlternativeCard({
  investigation,
  onSelect,
  isSelected,
}: AlternativeCardProps) {
  const getStatusBadge = (status: AlternativeOutcomeStatus) => {
    switch (status) {
      case "PROMISING":
        return {
          label: "PROMISING",
          badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        };
      case "PARTIAL_RECOVERY":
        return {
          label: "PARTIAL RECOVERY",
          badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        };
      case "NO_IMPROVEMENT":
        return {
          label: "NO IMPROVEMENT",
          badgeClass: "bg-red-500/10 text-red-300 border-red-500/30",
        };
    }
  };

  const statusInfo = getStatusBadge(investigation.alternativeStatus);

  return (
    <div
      onClick={() => onSelect(investigation)}
      className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer backdrop-blur-xs font-mono ${
        isSelected
          ? "border-purple-500/50 bg-[#14101e] shadow-lg shadow-purple-500/5"
          : "border-white/[0.08] bg-[#0c1017]/80 hover:border-white/[0.16] hover:bg-[#0f1422]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3 mb-3">
        {/* Agent & Execution Identity */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0">
            <GitFork className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-zinc-100 group-hover:text-purple-200 transition-colors">
                {investigation.agentName}
              </span>
              <span className="text-xs text-zinc-400">
                {investigation.originalExecutionId}
              </span>
              {investigation.framework && (
                <span className="rounded bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.2 text-[10px] text-zinc-400">
                  {investigation.framework}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {investigation.createdAtAgo}
              </span>
              <span>•</span>
              <span>{investigation.totalSteps} steps</span>
            </div>
          </div>
        </div>

        {/* Outcome Badges + View Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="rounded px-2 py-0.5 text-[10px] font-medium border border-red-500/30 bg-red-500/10 text-red-300">
              {investigation.originalOutcome}
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-500" />
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold border ${statusInfo.badgeClass}`}
            >
              {investigation.alternativeOutcome}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(investigation);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-300 transition-all shrink-0 ml-1"
          >
            <span>View Alternative</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Changed step & Impacted regions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Changed Decision
          </span>
          <span className="text-amber-300 font-semibold truncate block">
            Step {investigation.divergenceStep} — {investigation.divergenceStepTitle}
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Divergence Region
          </span>
          <span className="text-zinc-200 font-medium">
            {investigation.divergenceRegion}
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Affected Region
          </span>
          <span className="text-cyan-300 font-medium">
            {investigation.affectedRegion}
          </span>
        </div>

        <div className="rounded border border-white/[0.05] bg-[#080c13] p-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
            Simulation Status
          </span>
          <span className={`font-semibold ${statusInfo.badgeClass.split(" ")[1]}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
}
