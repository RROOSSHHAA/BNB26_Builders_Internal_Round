"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  GitCompare,
  Sparkles,
  Layers,
} from "lucide-react";
import { ComparisonRegionDetail } from "@/types";

interface ExecutionDivergenceMapProps {
  regions: ComparisonRegionDetail[];
  leftLabel: string;
  leftStatus: "FAILED" | "SUCCESS" | "ANOMALY";
  rightLabel: string;
  rightStatus: "SUCCESS" | "FAILED" | "ANOMALY";
  selectedRegionName?: string;
  onSelectRegion: (region: ComparisonRegionDetail) => void;
}

export function ExecutionDivergenceMap({
  regions,
  leftLabel,
  leftStatus,
  rightLabel,
  rightStatus,
  selectedRegionName,
  onSelectRegion,
}: ExecutionDivergenceMapProps) {
  const getStatusIcon = (status: "ok" | "warn" | "fail") => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "warn":
        return <AlertTriangle className="h-3.5 w-3.5 text-zinc-400" />;
      case "fail":
        return <XCircle className="h-3.5 w-3.5 text-rose-400" />;
    }
  };

  const getStatusBadge = (status: "ok" | "warn" | "fail") => {
    switch (status) {
      case "ok":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      case "warn":
        return "border-white/10 bg-white/[0.04] text-zinc-300";
      case "fail":
        return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-zinc-300" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Execution Divergence Map
          </h3>
        </div>
        <span className="text-[11px] text-zinc-400">
          Click any region to inspect localized differences
        </span>
      </div>

      {/* Side-by-side Aligned Regions Grid */}
      <div className="space-y-4">
        {/* Execution Labels Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-zinc-300 truncate">
              {leftLabel}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                leftStatus === "FAILED"
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {leftStatus}
            </span>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-zinc-300 truncate">
              {rightLabel}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                rightStatus === "SUCCESS"
                  ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-300"
                  : "border-rose-500/20 bg-rose-500/10 text-rose-300"
              }`}
            >
              {rightStatus}
            </span>
          </div>
        </div>

        {/* Region Rows Aligned Side-by-Side */}
        <div className="space-y-2.5">
          {regions.map((reg) => {
            const isSelected = selectedRegionName === reg.name;
            const hasDivergence = reg.leftStatus !== reg.rightStatus;

            return (
              <div
                key={reg.name}
                onClick={() => onSelectRegion(reg)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-white/40 bg-[#141824] shadow-sm ring-1 ring-white/20"
                    : hasDivergence
                    ? "border-white/20 bg-white/[0.02] hover:border-white/30"
                    : "border-white/[0.06] bg-[#080c13] hover:border-white/[0.14]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-100">
                      {reg.name}
                    </span>
                    {hasDivergence ? (
                      <span className="rounded bg-white/[0.08] text-zinc-300 border border-white/10 text-[9px] px-1.5 py-0.2 font-semibold">
                        Divergence Detected
                      </span>
                    ) : (
                      <span className="rounded bg-white/[0.04] text-zinc-400 text-[9px] px-1.5 py-0.2">
                        Equivalent Behavior
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-400">
                    {isSelected ? "Inspecting" : "Click to Inspect"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Left Region Box */}
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2.5 ${getStatusBadge(
                      reg.leftStatus
                    )}`}
                  >
                    <div>
                      <div className="font-semibold text-zinc-200">
                        {reg.name} ({reg.leftRange})
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">
                        {reg.leftDescription}
                      </div>
                    </div>
                    {getStatusIcon(reg.leftStatus)}
                  </div>

                  {/* Right Region Box */}
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2.5 ${getStatusBadge(
                      reg.rightStatus
                    )}`}
                  >
                    <div>
                      <div className="font-semibold text-zinc-200">
                        {reg.name} ({reg.rightRange})
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">
                        {reg.rightDescription}
                      </div>
                    </div>
                    {getStatusIcon(reg.rightStatus)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
