"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Sparkles, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExecutionHealthProps {
  total?: number; // 342
  successful?: number; // 287
  failed?: number; // 55
  diagnosed?: number; // 50 (91% of failed)
  className?: string;
}

export function ExecutionHealthWidget({
  total = 342,
  successful = 287,
  failed = 55,
  diagnosed = 50,
  className,
}: ExecutionHealthProps) {
  const successPct = Math.round((successful / total) * 100);
  const failedPct = 100 - successPct;
  const diagnosedPct = Math.round((diagnosed / failed) * 100); // 91%

  // SVG Ring calculation
  const size = 110;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const successOffset = circumference - (circumference * successPct) / 100;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 flex flex-col justify-between space-y-4 h-full",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans uppercase tracking-wider text-zinc-400 font-semibold">
              Fleet Health Ratio
            </span>
            <Badge variant="default" size="sm">
              342 Captured
            </Badge>
          </div>
          <h4 className="text-sm font-semibold text-white font-sans">
            Success vs. Divergence
          </h4>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-sans text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-medium">{diagnosedPct}% Diagnosed</span>
        </div>
      </div>

      {/* Center Visualization: Refined Dark Telemetry Ring + Stats */}
      <div className="flex items-center gap-6 py-1">
        {/* Ring Chart */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Background Track (Failed / Diverged base) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              className="opacity-40"
            />
            {/* Success Ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={successOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {successPct}%
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              Pass Rate
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-zinc-300">Successful</span>
            </div>
            <span className="font-semibold text-zinc-100 font-mono">{successful} runs</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="text-zinc-300">Failed / Diverged</span>
            </div>
            <span className="font-semibold text-rose-400 font-mono">{failed} runs</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[11px] text-zinc-400">
            <span>Automated Diagnosis:</span>
            <span className="text-white font-semibold font-mono">{diagnosed}/{failed} isolated</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Median Run Latency:</span>
            <span className="text-zinc-200 font-medium font-mono">1.84s</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Trace Ingest Buffer:</span>
            <span className="text-emerald-400 font-medium font-mono">0.0% drop</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-sans text-zinc-500">
        <span>Failure resolution rate: 94%</span>
        <span>Telemetry sealed</span>
      </div>
    </div>
  );
}
