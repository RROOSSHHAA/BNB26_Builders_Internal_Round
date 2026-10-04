"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowUpRight,
} from "lucide-react";

interface ExecutionMetricsSummaryProps {
  totalCount?: number;
  successCount?: number;
  failedCount?: number;
  investigationCount?: number;
  activeFilter?: string;
  onFilterChange?: (filterType: "all" | "success" | "failed" | "investigate") => void;
}

export function ExecutionMetricsSummary({
  totalCount = 342,
  successCount = 287,
  failedCount = 55,
  investigationCount = 12,
  activeFilter = "all",
  onFilterChange,
}: ExecutionMetricsSummaryProps) {
  const metrics: {
    id: "all" | "success" | "failed" | "investigate";
    label: string;
    value: number;
    sublabel: string;
    icon: typeof Layers;
    color: string;
    accent: string;
    activeBorder: string;
    iconColor: string;
    tag: string;
  }[] = [
    {
      id: "all",
      label: "Total Executions",
      value: totalCount,
      sublabel: "Across 8 deployed agents",
      icon: Layers,
      color: "text-white",
      accent: "border-white/[0.08] hover:border-white/20",
      activeBorder: "border-white/30 bg-white/[0.06]",
      iconColor: "text-zinc-300",
      tag: "All Traces",
    },
    {
      id: "success",
      label: "Successful",
      value: successCount,
      sublabel: "83.9% nominal flow",
      icon: CheckCircle2,
      color: "text-emerald-400",
      accent: "border-white/[0.08] hover:border-emerald-500/30",
      activeBorder: "border-emerald-500/40 bg-emerald-500/10",
      iconColor: "text-emerald-400",
      tag: "83.9%",
    },
    {
      id: "failed",
      label: "Failed",
      value: failedCount,
      sublabel: "16.1% failure rate",
      icon: XCircle,
      color: "text-rose-400",
      accent: "border-white/[0.08] hover:border-rose-500/30",
      activeBorder: "border-rose-500/40 bg-rose-500/10",
      iconColor: "text-rose-400",
      tag: "16.1%",
    },
    {
      id: "investigate",
      label: "Needs Investigation",
      value: investigationCount,
      sublabel: "Automated triage active",
      icon: AlertOctagon,
      color: "text-rose-300",
      accent: "border-white/[0.08] hover:border-rose-500/30",
      activeBorder: "border-rose-500/40 bg-rose-500/10",
      iconColor: "text-rose-300",
      tag: "Priority",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
      {metrics.map((item) => {
        const Icon = item.icon;
        const isActive = activeFilter === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange && onFilterChange(item.id)}
            className={cn(
              "group relative flex flex-col justify-between p-4 rounded-xl border bg-[#0e121b] text-left transition-all cursor-pointer h-full",
              isActive ? item.activeBorder : item.accent
            )}
          >
            {/* Header row */}
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
                {item.label}
              </span>
              <div className="p-1.5 rounded-md bg-white/[0.04] text-zinc-400 group-hover:text-white transition-colors">
                <Icon className={cn("h-3.5 w-3.5", item.iconColor)} />
              </div>
            </div>

            {/* Metric Value */}
            <div className="mt-2.5 flex items-baseline justify-between w-full">
              <span className={cn("text-2xl sm:text-3xl font-bold font-sans tracking-tight", item.color)}>
                {item.value}
              </span>
              <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-zinc-400">
                {item.tag}
              </span>
            </div>

            {/* Context Sublabel */}
            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-zinc-400 font-sans w-full">
              <span>{item.sublabel}</span>
              <ArrowUpRight className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
