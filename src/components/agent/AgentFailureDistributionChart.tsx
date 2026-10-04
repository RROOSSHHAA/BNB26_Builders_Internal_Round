"use client";

import * as React from "react";
import { AgentFailureDistribution } from "@/types";
import { cn } from "@/lib/utils";
import { PieChart, AlertTriangle } from "lucide-react";

interface AgentFailureDistributionChartProps {
  distribution?: AgentFailureDistribution[];
  className?: string;
}

export function AgentFailureDistributionChart({
  distribution,
  className,
}: AgentFailureDistributionChartProps) {
  const defaultDistribution: AgentFailureDistribution[] = [
    { category: "Validation", percentage: 42 },
    { category: "Retrieval", percentage: 26 },
    { category: "Tool Failure", percentage: 18 },
    { category: "Reasoning", percentage: 9 },
    { category: "Other", percentage: 5 },
  ];

  const items = distribution && distribution.length > 0 ? distribution : defaultDistribution;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "validation":
        return "bg-amber-400";
      case "retrieval":
        return "bg-cyan-400";
      case "tool failure":
        return "bg-red-400";
      case "reasoning":
        return "bg-purple-400";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-4 select-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
            FAILURE CATEGORY DISTRIBUTION
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">Historical Breakdown</span>
      </div>

      {/* Horizontal Multi-Segment Progress Bar */}
      <div className="h-3 w-full rounded-full bg-white/[0.04] overflow-hidden flex">
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${item.percentage}%` }}
            title={`${item.category}: ${item.percentage}%`}
            className={cn(
              "h-full transition-all hover:brightness-125 cursor-pointer",
              getCategoryColor(item.category)
            )}
          />
        ))}
      </div>

      {/* Categories Breakdown List */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 text-xs font-mono">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg border border-white/[0.04] bg-[#0c1017] space-y-1"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  getCategoryColor(item.category)
                )}
              />
              <span className="text-zinc-400 text-[10px] uppercase truncate">
                {item.category}
              </span>
            </div>
            <span className="text-sm font-bold font-mono text-white block">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] font-sans text-zinc-500 leading-relaxed pt-1">
        Validation failures represent the largest statistical cluster, primarily resulting from numerical tolerance divergence at Step 73.
      </p>
    </div>
  );
}
