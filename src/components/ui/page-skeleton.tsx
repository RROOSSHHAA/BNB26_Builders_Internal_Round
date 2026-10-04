import * as React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";
import { Activity, Cpu, Layers } from "lucide-react";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-[#0c1017] p-5 space-y-3 font-mono",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.07] bg-[#090d14] overflow-hidden font-mono",
        className
      )}
    >
      <div className="border-b border-white/[0.06] bg-[#0c1017] px-4 py-3 flex items-center justify-between">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-3.5 w-48 max-w-full" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.07] bg-[#0c1017] p-5 space-y-4 font-mono",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-2.5 w-48" />
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <div className="h-48 flex items-end gap-2 pt-4 px-2">
        {[40, 65, 30, 85, 45, 90, 70, 50, 80, 60, 95, 75].map((heightPct, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full">
            <Skeleton
              className="w-full rounded-t"
              style={{ height: `${heightPct}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-2 border-t border-white/[0.04]">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-2.5 w-12" />
      </div>
    </div>
  );
}

export function IntelligenceMapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#0a0e16] p-6 space-y-6 font-mono text-center relative overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400/60" />
          <Skeleton className="h-3.5 w-44" />
        </div>
        <Skeleton className="h-6 w-28 rounded-md" />
      </div>

      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border border-cyan-500/20 animate-ping" />
          <div className="absolute h-10 w-10 rounded-full border border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <Cpu className="h-5 w-5 text-cyan-400 relative z-10" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
            Synthesizing Execution Intelligence Map...
          </h4>
          <p className="text-[11px] text-zinc-500 max-w-sm">
            Constructing Catmull-Rom execution spline across 127 telemetry blocks
          </p>
        </div>
        {/* Progressive nodes skeleton */}
        <div className="flex items-center gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-7 w-24 rounded-md" />
              {i < 4 && <div className="h-0.5 w-4 bg-white/[0.06]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 font-mono", className)}>
      {/* Detail header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-64 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main visualization / Split views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <IntelligenceMapSkeleton />
          <TableSkeleton rows={4} />
        </div>
        <div className="space-y-4">
          <CardSkeleton className="h-64" />
          <CardSkeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton({
  title = "Telemetry View",
  showCards = true,
  cardCount = 4,
  showTable = true,
  className,
}: {
  title?: string;
  showCards?: boolean;
  cardCount?: number;
  showTable?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 font-mono", className)}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400/50" />
            <Skeleton className="h-4 w-48" />
            <span className="sr-only">{title}</span>
          </div>
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      {/* Metric Cards */}
      {showCards && (
        <div
          className={cn(
            "grid gap-4",
            cardCount === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {Array.from({ length: cardCount }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Main Content / Table */}
      {showTable && <TableSkeleton rows={6} />}
    </div>
  );
}
