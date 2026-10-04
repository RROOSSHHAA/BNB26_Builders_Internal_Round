"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Layers, X } from "lucide-react";
import { ComparisonRegionDetail } from "@/types";

interface RegionComparisonPanelProps {
  region: ComparisonRegionDetail | null;
  leftLabel: string;
  rightLabel: string;
  onClose?: () => void;
}

export function RegionComparisonPanel({
  region,
  leftLabel,
  rightLabel,
  onClose,
}: RegionComparisonPanelProps) {
  if (!region) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs shadow-lg animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-zinc-300" />
          <h4 className="text-sm font-semibold text-white tracking-normal">
            {region.name} Region Comparison
          </h4>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Side by side Region summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left */}
        <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
              {leftLabel}
            </span>
            <span className="text-[10px] text-zinc-300">
              Steps {region.leftRange}
            </span>
          </div>
          <p className="text-zinc-200 text-xs leading-relaxed">
            {region.leftDescription}
          </p>
        </div>

        {/* Right */}
        <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
              {rightLabel}
            </span>
            <span className="text-[10px] text-zinc-300">
              Steps {region.rightRange}
            </span>
          </div>
          <p className="text-zinc-200 text-xs leading-relaxed">
            {region.rightDescription}
          </p>
        </div>
      </div>

      {/* What Changed? Table */}
      <div className="space-y-2 pt-1 border-t border-white/[0.06]">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
          WHAT CHANGED IN THIS REGION?
        </span>

        <div className="rounded-lg border border-white/[0.06] bg-[#080c13] divide-y divide-white/[0.05]">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-zinc-400">Output Structure:</span>
            <span className="text-zinc-200 font-medium text-right">
              {region.whatChanged.outputStructure}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-zinc-400">Latency Profile:</span>
            <span className="text-zinc-200 font-medium text-right">
              {region.whatChanged.latency}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-zinc-400">Downstream Status:</span>
            <span className="text-amber-300 font-medium text-right">
              {region.whatChanged.downstreamStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
