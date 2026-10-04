"use client";

import * as React from "react";
import { Execution, ExecutionRegion } from "@/types";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Execution3DMap } from "@/components/3d/Execution3DMap";
import {
  Database,
  Brain,
  AlertTriangle,
  Layers,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  ArrowDown,
  Clock,
  Zap,
  Sparkles,
  ChevronRight,
  Flame,
  Search,
} from "lucide-react";

interface ExecutionIntelligenceMapProps {
  execution: Execution;
  onSelectRegion?: (region: ExecutionRegion) => void;
  onInvestigateAnomaly?: () => void;
  className?: string;
}

export function ExecutionIntelligenceMap({
  execution,
  onSelectRegion,
  onInvestigateAnomaly,
  className,
}: ExecutionIntelligenceMapProps) {
  const [hoveredRegionId, setHoveredRegionId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"3d" | "2d">("3d");

  const regions = execution.regions;
  const anomalousRegion = regions.find((r) => r.isAnomaly) || regions[2];

  const getRegionIcon = (category: string) => {
    switch (category) {
      case "retrieval":
        return Database;
      case "reasoning":
        return Brain;
      case "anomaly":
        return AlertTriangle;
      case "finalization":
        return Layers;
      default:
        return Layers;
    }
  };

  const getRegionStatusConfig = (region: ExecutionRegion) => {
    if (region.isAnomaly || region.status === "critical") {
      return {
        label: "Investigate",
        badgeVariant: "amber" as const,
        borderColor: "border-amber-500/40 hover:border-amber-400/80 bg-[#12100d]",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.06)]",
        iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        accentLine: "bg-amber-400",
      };
    }
    if (region.status === "warning") {
      return {
        label: "Affected",
        badgeVariant: "default" as const,
        borderColor: "border-white/10 hover:border-white/20 bg-[#0c1017]",
        glow: "",
        iconColor: "text-zinc-400 bg-white/[0.04] border-white/10",
        accentLine: "bg-zinc-500",
      };
    }
    return {
      label: "Nominal",
      badgeVariant: "emerald" as const,
      borderColor: "border-white/[0.08] hover:border-emerald-500/40 bg-[#090d14]",
      glow: "",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      accentLine: "bg-emerald-400",
    };
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#070a10] p-6 lg:p-7 space-y-6 overflow-hidden relative",
        className
      )}
    >
      {/* Map Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
              Execution Intelligence Map
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-zinc-400">
              {execution.agentName} (#{execution.id})
            </span>
            <Badge variant="crimson" size="sm">
              FAILED
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            AI-Compressed Trajectory (127 Steps &rarr; 4 Meaningful Regions)
          </h3>
          <p className="text-xs text-zinc-400 max-w-2xl font-sans">
            Autonomous execution compressed into semantically connected regions. The system isolated Step 73 inside the anomalous validation region as the primary divergence root.
          </p>
        </div>

        {/* Telemetry metadata tags + View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-zinc-400 sm:text-right shrink-0">
          {/* View Mode Toggle: 3D Vector vs 2D Flow */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg border border-white/[0.08] bg-[#0c1017]">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-all",
                viewMode === "3d"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
              title="3D Vector Execution Map"
            >
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>3D Vector</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("2d")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-all",
                viewMode === "2d"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
              title="2D Structured Flow View"
            >
              <Layers className="h-3 w-3" />
              <span>2D Flow</span>
            </button>
          </div>

          <div className="bg-[#0c1017] px-3 py-1.5 rounded-lg border border-white/[0.06]">
            <span className="text-[10px] text-zinc-500 uppercase block">Duration</span>
            <span className="font-semibold text-zinc-200">
              {formatDuration(execution.durationMs)}
            </span>
          </div>

          <div className="bg-[#0c1017] px-3 py-1.5 rounded-lg border border-white/[0.06]">
            <span className="text-[10px] text-zinc-500 uppercase block">Total Steps</span>
            <span className="font-semibold text-zinc-200">{execution.totalSteps} steps</span>
          </div>
        </div>
      </div>

      {/* THE COMPRESSED REGIONS INTELLIGENT FLOW GRAPH */}
      <div className="relative pt-2 pb-2">
        {/* 3D Vector View (Desktop/Tablet) */}
        {viewMode === "3d" && (
          <div className="hidden md:block mb-4">
            <Execution3DMap
              execution={execution}
              selectedRegionId={hoveredRegionId}
              onSelectRegion={onSelectRegion}
              onInvestigateAnomaly={onInvestigateAnomaly}
              height={360}
            />
          </div>
        )}

        {/* Desktop / Tablet: Horizontal connected flow (active when 2D mode selected) */}
        <div className={cn(
          "gap-4 relative",
          viewMode === "2d" ? "hidden md:grid md:grid-cols-4" : "hidden"
        )}>
          {regions.map((region, index) => {
            const config = getRegionStatusConfig(region);
            const Icon = getRegionIcon(region.category);
            const isHovered = hoveredRegionId === region.id;
            const isLast = index === regions.length - 1;

            return (
              <div key={region.id} className="relative flex items-center">
                {/* Region Card */}
                <div
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => onSelectRegion?.(region)}
                  className={cn(
                    "w-full rounded-xl border p-4.5 transition-all duration-200 cursor-pointer relative group flex flex-col justify-between min-h-[220px]",
                    config.borderColor,
                    config.glow,
                    isHovered && "scale-[1.02] ring-1 ring-cyan-500/40"
                  )}
                >
                  {/* Top Accent Strip */}
                  <div
                    className={cn(
                      "absolute top-0 inset-x-0 h-1 rounded-t-xl transition-opacity",
                      config.accentLine,
                      region.isAnomaly ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                    )}
                  />

                  {/* Header: Icon & Category */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={cn("p-2 rounded-lg border", config.iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant={config.badgeVariant} size="sm">
                        {config.label}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                        {region.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs font-mono text-cyan-400">
                        <span>Steps {region.startStep}–{region.endStep}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">{region.stepCount} steps</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content / Anomaly Highlight */}
                  <div className="my-2.5">
                    {region.isAnomaly ? (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                          <span>Suspicious Step</span>
                          <span>91% Likelihood</span>
                        </div>
                        <div className="text-xs font-bold text-amber-200 font-mono">
                          Step 73 — Validation
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-snug font-sans">
                          Unusual output pattern & deviation from nominal runs.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                        {region.summary}
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Metrics & Action Hint */}
                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span>{formatDuration(region.metrics.latencyMs)}</span>
                    </div>

                    <span className="group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex items-center gap-0.5 text-zinc-400">
                      <span>Inspect</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                {/* Directional Flow Connector Arrow (between horizontal cards) */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 z-10 items-center justify-center pointer-events-none">
                    <div className="h-6 w-6 rounded-full bg-[#0c111a] border border-white/10 flex items-center justify-center text-zinc-400 shadow-md">
                      <ArrowRight className="h-3 w-3 text-cyan-400/80" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: Vertically connected flow */}
        <div className="md:hidden space-y-3">
          {regions.map((region, index) => {
            const config = getRegionStatusConfig(region);
            const Icon = getRegionIcon(region.category);
            const isLast = index === regions.length - 1;

            return (
              <div key={region.id} className="space-y-2">
                <div
                  onClick={() => onSelectRegion?.(region)}
                  className={cn(
                    "rounded-xl border p-4 cursor-pointer relative",
                    config.borderColor,
                    config.glow
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("p-1.5 rounded border", config.iconColor)}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-100">
                        {region.name}
                      </span>
                    </div>
                    <Badge variant={config.badgeVariant} size="sm">
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 mb-2">
                    <span>Steps {region.startStep}–{region.endStep}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{region.stepCount} steps</span>
                    <span>•</span>
                    <span className="text-zinc-400">{formatDuration(region.metrics.latencyMs)}</span>
                  </div>

                  {region.isAnomaly && (
                    <div className="mt-2 rounded bg-amber-500/10 border border-amber-500/30 p-2 text-xs font-mono text-amber-200">
                      Most suspicious: Step 73 — Validation (91% failure likelihood)
                    </div>
                  )}
                </div>

                {!isLast && (
                  <div className="flex justify-center text-zinc-600 py-0.5">
                    <ArrowDown className="h-3.5 w-3.5 text-cyan-400/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ANOMALY FOCUS DISCOVERY CALLOUT */}
      <div className="rounded-xl border border-rose-500/25 bg-[#0e121b] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-sans uppercase tracking-wider text-rose-400 font-semibold">
                Anomaly Discovery
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-sans text-zinc-200 font-bold">
                Step 73 — Validation
              </span>
              <span className="rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 text-[10px] font-sans font-semibold">
                91% failure likelihood
              </span>
              <span className="text-[10px] font-sans text-zinc-400">
                (Demo heuristic)
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-3xl">
              Unusual output schema pattern detected at Step 73 with strong downstream failure correlation. Downstream Finalization steps (79–127) were corrupted by this divergence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pl-11 sm:pl-0">
          <Button
            variant="primary"
            size="sm"
            onClick={onInvestigateAnomaly}
            className="text-xs font-sans font-medium gap-1.5"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Investigate Step 73</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
