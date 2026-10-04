"use client";

import * as React from "react";
import { ExecutionRegion } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

interface ExecutionMicroFlowProps {
  regions: ExecutionRegion[];
  className?: string;
  compact?: boolean;
}

export function ExecutionMicroFlow({
  regions,
  className,
  compact = false,
}: ExecutionMicroFlowProps) {
  if (!regions || regions.length === 0) {
    return (
      <span className="text-xs font-mono text-zinc-500 italic">
        No regions captured
      </span>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 font-mono text-xs select-none",
        className
      )}
    >
      {regions.map((region, idx) => {
        const isCritical = region.status === "critical" || region.isAnomaly;
        const isWarning = region.status === "warning";
        const isHealthy = region.status === "healthy";

        return (
          <React.Fragment key={region.id || idx}>
            <div
              className={cn(
                "group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-all",
                isCritical
                  ? "border-red-500/40 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.15)] font-semibold"
                  : isWarning
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-white/[0.07] bg-[#111622] text-zinc-300 hover:border-white/20 hover:text-white"
              )}
              title={`${region.name} (Steps ${region.startStep}–${region.endStep})${
                region.anomalyReason ? `\n[Anomaly]: ${region.anomalyReason}` : ""
              }`}
            >
              {/* Status Indicator */}
              {isCritical ? (
                <span className="flex items-center text-red-400">
                  <AlertTriangle className="h-3 w-3 animate-pulse" />
                </span>
              ) : isWarning ? (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              )}

              {/* Region Name */}
              <span className="tracking-tight">{region.name}</span>

              {/* Step Span */}
              {!compact && (
                <span
                  className={cn(
                    "text-[10px] opacity-60 font-sans",
                    isCritical ? "text-red-200" : "text-zinc-500"
                  )}
                >
                  {region.startStep}–{region.endStep}
                </span>
              )}
            </div>

            {/* Directional Connector between regions */}
            {idx < regions.length - 1 && (
              <div className="flex items-center text-zinc-600 px-0.5">
                <span className="hidden sm:inline-block w-2.5 h-[1px] bg-zinc-700" />
                <ArrowRight className="h-2.5 w-2.5 text-zinc-600 sm:-ml-1" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
