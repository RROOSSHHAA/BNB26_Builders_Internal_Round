"use client";

import * as React from "react";
import { Check, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { AlternativeOutcomeStatus } from "@/types";

interface ChangeSummaryCardProps {
  whatChanged: {
    decision: string;
    original: string;
    alternative: string;
  };
  downstreamEffect: {
    original: string;
    alternative: string;
  };
  finalOutcomeText: string;
  alternativeStatus: AlternativeOutcomeStatus;
  statusExplanation: string;
}

export function ChangeSummaryCard({
  whatChanged,
  downstreamEffect,
  finalOutcomeText,
  alternativeStatus,
  statusExplanation,
}: ChangeSummaryCardProps) {
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

  const statusInfo = getStatusBadge(alternativeStatus);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0c1017]/85 p-5 backdrop-blur-xs font-mono text-xs">
      {/* Status Confidence Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400">
            Alternative Status:
          </span>
          <span
            className={`rounded px-2.5 py-0.5 font-bold border ${statusInfo.badgeClass}`}
          >
            {statusInfo.label}
          </span>
        </div>
        <span className="text-[10px] text-zinc-400">
          Simulated Investigation Result
        </span>
      </div>

      <p className="text-zinc-300 text-xs leading-relaxed">
        {statusExplanation}
      </p>

      {/* Grid of Structured Changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* 1. What Changed */}
        <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3 space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
            WHAT CHANGED?
          </span>
          <div className="text-[11px] text-zinc-300 font-medium">
            {whatChanged.decision}
          </div>
          <div className="text-[10px] text-red-400 line-through truncate">
            Orig: {whatChanged.original}
          </div>
          <div className="text-[10px] text-emerald-400 truncate">
            Alt: {whatChanged.alternative}
          </div>
        </div>

        {/* 2. Downstream Effect */}
        <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3 space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
            DOWNSTREAM EFFECT
          </span>
          <div className="text-[10px] text-zinc-400">
            <strong className="text-zinc-300">Original:</strong> {downstreamEffect.original}
          </div>
          <div className="text-[10px] text-emerald-300">
            <strong className="text-zinc-300">Alternative:</strong> {downstreamEffect.alternative}
          </div>
        </div>

        {/* 3. Final Outcome */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 block font-semibold">
            FINAL OUTCOME
          </span>
          <div className="text-sm font-bold text-emerald-300">
            {finalOutcomeText}
          </div>
          <p className="text-[10px] text-zinc-400 leading-tight">
            Alternative path completed without cascade divergence.
          </p>
        </div>
      </div>
    </div>
  );
}
