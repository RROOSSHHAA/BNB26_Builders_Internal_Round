"use client";

import * as React from "react";
import { ExecutionRegion } from "@/types";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Database,
  Brain,
  Wrench,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
  Zap,
} from "lucide-react";

interface ExecutionRegionProps {
  region: ExecutionRegion;
  totalExecutionSteps?: number;
  isSelected?: boolean;
  onSelect?: (region: ExecutionRegion) => void;
  className?: string;
}

export function ExecutionRegionCard({
  region,
  totalExecutionSteps = 127,
  isSelected,
  onSelect,
  className,
}: ExecutionRegionProps) {
  const percentage = Math.round((region.stepCount / (totalExecutionSteps || 1)) * 100);

  const categoryIcon = {
    retrieval: Database,
    reasoning: Brain,
    tool_call: Wrench,
    anomaly: AlertTriangle,
    finalization: CheckSquare,
    recovery: Sparkles,
  }[region.category];

  const Icon = categoryIcon || Layers;

  const statusConfig = {
    healthy: {
      badge: "emerald" as const,
      border: "border-white/[0.08] hover:border-emerald-500/40",
      statusIcon: CheckCircle2,
      statusColor: "text-emerald-400",
      tagText: "HEALTHY",
      glowBg: "from-emerald-500/[0.02] to-transparent",
    },
    warning: {
      badge: "amber" as const,
      border: "border-amber-500/30 hover:border-amber-500/50",
      statusIcon: AlertCircle,
      statusColor: "text-amber-400",
      tagText: "WARNING",
      glowBg: "from-amber-500/[0.04] to-transparent",
    },
    critical: {
      badge: "crimson" as const,
      border: "border-red-500/40 hover:border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.06)]",
      statusIcon: AlertTriangle,
      statusColor: "text-red-400",
      tagText: "SUSPICIOUS REGION",
      glowBg: "from-red-500/[0.08] to-transparent",
    },
    affected: {
      badge: "amber" as const,
      border: "border-amber-500/30 hover:border-amber-500/50",
      statusIcon: AlertCircle,
      statusColor: "text-amber-400",
      tagText: "AFFECTED",
      glowBg: "from-amber-500/[0.04] to-transparent",
    },
  }[region.status];

  const StatusIcon = statusConfig.statusIcon;

  return (
    <div
      onClick={() => onSelect?.(region)}
      className={cn(
        "group relative rounded-xl border bg-[#0b0f17] p-5 transition-all duration-200 cursor-pointer overflow-hidden",
        statusConfig.border,
        isSelected && "ring-2 ring-cyan-500/60 bg-[#0e1420]",
        className
      )}
    >
      {/* Subtle top gradient aura based on status */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          region.status === "critical"
            ? "from-red-500/50 via-rose-500 to-amber-500/50"
            : region.status === "warning"
            ? "from-amber-500/30 via-amber-400 to-amber-500/30"
            : "from-emerald-500/20 via-cyan-500/20 to-transparent"
        )}
      />

      {/* Header bar of region */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border",
              region.status === "critical"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : region.status === "warning"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-white/10 bg-[#121824] text-zinc-300"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-cyan-300 transition-colors">
                {region.name}
              </h4>
              <Badge variant={statusConfig.badge} size="sm">
                {statusConfig.tagText}
              </Badge>
              {region.isAnomaly && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="text-cyan-400/90 font-medium">
                Steps {region.startStep}–{region.endStep}
              </span>
              <span>•</span>
              <span>{region.stepCount} steps ({percentage}% of trace)</span>
            </div>
          </div>
        </div>

        {/* Telemetry pill metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400 bg-[#070a0f] px-2.5 py-1 rounded border border-white/[0.04]">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>{formatDuration(region.metrics.latencyMs)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400 bg-[#070a0f] px-2.5 py-1 rounded border border-white/[0.04]">
            <Zap className="h-3.5 w-3.5 text-zinc-500" />
            <span>{formatNumber(region.metrics.tokenCount)} tok</span>
          </div>

          <div className="flex items-center text-zinc-400">
            <span className="text-[11px] text-zinc-500 mr-1.5">Confidence:</span>
            <span
              className={cn(
                "font-semibold",
                region.confidence >= 0.9 ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {Math.round(region.confidence * 100)}%
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(region);
            }}
            className="text-xs gap-1 border-white/10 hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <span>Drill Down</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Summary Narrative */}
      <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed pl-12">
        {region.summary}
      </p>

      {/* Anomaly Callout Box if Critical */}
      {region.isAnomaly && region.anomalyReason && (
        <div className="mt-4 ml-12 rounded-lg border border-red-500/30 bg-red-950/20 p-3.5 flex items-start gap-3">
          <StatusIcon className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-red-300 font-semibold block">
              Divergence Root Identified
            </span>
            <p className="mt-0.5 text-xs text-zinc-300 leading-relaxed font-sans">
              {region.anomalyReason}
            </p>
          </div>
        </div>
      )}

      {/* Timeline Representation Bar */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
        <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden flex">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              region.status === "critical"
                ? "bg-gradient-to-r from-red-500 to-rose-400"
                : region.status === "warning"
                ? "bg-amber-400"
                : "bg-emerald-400/80"
            )}
            style={{ width: `${Math.max(percentage, 8)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
