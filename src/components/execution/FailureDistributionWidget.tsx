"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Wrench, Database, Brain, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FailureCategory {
  name: string;
  percentage: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const FAILURE_DATA: FailureCategory[] = [
  {
    name: "Validation",
    percentage: 32,
    color: "bg-rose-400",
    icon: AlertTriangle,
    description: "Output schema validation errors & hallucination consistency checks",
  },
  {
    name: "Tool Failure",
    percentage: 24,
    color: "bg-rose-500/80",
    icon: Wrench,
    description: "HTTP 4xx/5xx API rejects, timeout latency, and expired credentials",
  },
  {
    name: "Retrieval",
    percentage: 21,
    color: "bg-zinc-300",
    icon: Database,
    description: "Zero cosine similarity matches, empty vector chunks, or stale indices",
  },
  {
    name: "Reasoning",
    percentage: 15,
    color: "bg-zinc-400",
    icon: Brain,
    description: "Cyclic self-referential thought loops and context window overflows",
  },
  {
    name: "Other",
    percentage: 8,
    color: "bg-zinc-600",
    icon: HelpCircle,
    description: "Client abort signals and infrastructure socket disconnects",
  },
];

export function FailureDistributionWidget({ className }: { className?: string }) {
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
              Taxonomy Breakdown
            </span>
            <Badge variant="default" size="sm">
              Root Causes
            </Badge>
          </div>
          <h4 className="text-sm font-semibold text-white font-sans">
            What Kinds of Failures Are Happening?
          </h4>
        </div>
        <span className="text-[11px] font-sans text-zinc-500">
          55 Failures Classified
        </span>
      </div>

      {/* Proportional Stacked Segment Bar */}
      <div className="w-full h-2 rounded-full overflow-hidden flex bg-white/[0.05] p-0.5 gap-0.5">
        {FAILURE_DATA.map((cat) => (
          <div
            key={cat.name}
            style={{ width: `${cat.percentage}%` }}
            className={cn("h-full rounded-full transition-all duration-500", cat.color)}
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      {/* Categorical Breakdown Rows */}
      <div className="space-y-2.5 pt-1">
        {FAILURE_DATA.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="group flex items-center justify-between text-xs font-sans"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                <Icon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="text-zinc-200 font-medium truncate">
                  {cat.name}
                </span>
                <span className="text-[10px] text-zinc-500 truncate hidden sm:inline">
                  — {cat.description}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 bg-white/[0.04] h-1.5 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className={cn("h-full rounded-full", cat.color)}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <span className="text-zinc-200 font-bold w-9 text-right font-mono">
                  {cat.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-sans text-zinc-500">
        <span>Validation & Tools comprise 56% of anomalies</span>
        <span>Heuristic Filter</span>
      </div>
    </div>
  );
}
