"use client";

import * as React from "react";
import { Execution, ExecutionRegion } from "@/types";
import { cn } from "@/lib/utils";
import { Execution3DMap } from "@/components/3d/Execution3DMap";
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ArrowDown,
  Layers,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";

interface ExecutionMapInteractiveProps {
  regions: ExecutionRegion[];
  selectedRegionId: string;
  onSelectRegion: (region: ExecutionRegion) => void;
  execution?: Execution;
  className?: string;
}

export function ExecutionMapInteractive({
  regions,
  selectedRegionId,
  onSelectRegion,
  execution,
  className,
}: ExecutionMapInteractiveProps) {
  const [viewMode, setViewMode] = React.useState<"3d" | "2d">("2d");

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-5",
        className
      )}
    >
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.05] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              EXECUTION INTELLIGENCE MAP
            </span>
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              AI-Compressed Graph
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Click any region to inspect localized step telemetry and automated failure diagnosis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
          {/* 3D / 2D View Switcher if execution object available */}
          {execution && (
            <div className="hidden sm:flex items-center p-0.5 rounded-lg border border-white/[0.08] bg-[#0c1017]">
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 transition-all",
                  viewMode === "3d"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
                title="3D Vector View"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>3D Vector</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("2d")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 transition-all",
                  viewMode === "2d"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
                title="2D Flow View"
              >
                <Layers className="h-3 w-3" />
                <span>2D Flow</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span>Anomalous</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Affected</span>
          </div>
        </div>
      </div>

      {/* 3D Vector View when active */}
      {viewMode === "3d" && execution && (
        <div className="hidden md:block">
          <Execution3DMap
            execution={execution}
            selectedRegionId={selectedRegionId}
            onSelectRegion={onSelectRegion}
            height={320}
          />
        </div>
      )}

      {/* Connected Regions Flow */}
      <div className={cn(
        "gap-3 relative",
        viewMode === "2d" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid md:hidden grid-cols-1"
      )}>
        {regions.map((region, idx) => {
          const isSelected = region.id === selectedRegionId;
          const isAnomalous = region.status === "critical" || region.isAnomaly;
          const isAffected = region.status === "affected" || region.status === "warning";
          const isNormal = region.status === "healthy";

          // State label
          const stateLabel = isAnomalous
            ? "ANOMALOUS"
            : isAffected
            ? "AFFECTED"
            : "NORMAL";

          return (
            <div key={region.id || idx} className="relative flex flex-col">
              {/* Region Card */}
              <button
                type="button"
                onClick={() => onSelectRegion(region)}
                className={cn(
                  "group relative flex-1 text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[148px]",
                  isSelected
                    ? isAnomalous
                      ? "border-red-500/80 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.2)] ring-1 ring-red-500/50"
                      : "border-cyan-500/80 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
                    : isAnomalous
                    ? "border-red-500/40 bg-red-500/[0.06] hover:border-red-500/60 hover:bg-red-500/10"
                    : isAffected
                    ? "border-amber-500/30 bg-amber-500/[0.04] hover:border-amber-500/50 hover:bg-amber-500/10"
                    : "border-white/[0.07] bg-[#0c1017] hover:border-white/20 hover:bg-[#101520]"
                )}
              >
                {/* Active Indicator Top Pill */}
                {isSelected && (
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1",
                      isAnomalous ? "bg-red-400" : "bg-cyan-400"
                    )}
                  />
                )}

                {/* Top Row: Region Index & Step Span */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <span className="font-semibold text-zinc-300">0{idx + 1}</span>
                    <span>•</span>
                    <span>Steps {region.startStep}–{region.endStep}</span>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                      isAnomalous
                        ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                        : isAffected
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    )}
                  >
                    {stateLabel}
                  </span>
                </div>

                {/* Center: Region Name */}
                <div className="my-2">
                  <h3
                    className={cn(
                      "text-sm sm:text-base font-bold font-mono tracking-tight transition-colors uppercase",
                      isSelected
                        ? "text-white"
                        : isAnomalous
                        ? "text-red-200"
                        : isAffected
                        ? "text-amber-200"
                        : "text-zinc-100 group-hover:text-cyan-300"
                    )}
                  >
                    {region.name}
                  </h3>

                  {isAnomalous && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-red-400 font-semibold">
                      <Flame className="h-3 w-3 shrink-0" />
                      <span>Step 73 Anomaly (91%)</span>
                    </div>
                  )}

                  {isAffected && (
                    <span className="mt-1 text-[11px] font-mono text-amber-400/90 block">
                      ↳ Downstream impacted
                    </span>
                  )}
                </div>

                {/* Bottom Row: Steps Count & Duration */}
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-400 w-full">
                  <span>{region.stepCount} steps</span>
                  <span>{((region.metrics?.latencyMs || 2800) / 1000).toFixed(1)}s</span>
                </div>
              </button>

              {/* Directional Connector Arrow between cards */}
              {idx < regions.length - 1 && (
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center rounded-full bg-[#05080e] border border-white/20 text-zinc-400">
                  <ArrowRight className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
