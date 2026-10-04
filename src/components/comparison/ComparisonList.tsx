"use client";

import * as React from "react";
import { History, GitCompare } from "lucide-react";
import { ComparisonInvestigation, ComparisonScenarioType } from "@/types";
import { ComparisonCard } from "./ComparisonCard";

interface ComparisonListProps {
  comparisons: ComparisonInvestigation[];
  selectedId?: string;
  onSelectComparison: (item: ComparisonInvestigation) => void;
}

export function ComparisonList({
  comparisons,
  selectedId,
  onSelectComparison,
}: ComparisonListProps) {
  const [filter, setFilter] = React.useState<"all" | ComparisonScenarioType>("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return comparisons;
    return comparisons.filter((c) => c.scenarioType === filter);
  }, [comparisons, filter]);

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-zinc-300" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Comparison History
          </h3>
          <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] text-zinc-400">
            {filtered.length}
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0c1017] p-1 text-[11px] overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-2.5 py-1 transition-colors whitespace-nowrap ${
              filter === "all"
                ? "bg-white/[0.12] text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("successful_vs_failed")}
            className={`rounded-md px-2.5 py-1 transition-colors whitespace-nowrap ${
              filter === "successful_vs_failed"
                ? "bg-white/[0.12] text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Success vs Fail
          </button>
          <button
            onClick={() => setFilter("original_vs_replay")}
            className={`rounded-md px-2.5 py-1 transition-colors whitespace-nowrap ${
              filter === "original_vs_replay"
                ? "bg-white/[0.12] text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            vs Replay
          </button>
          <button
            onClick={() => setFilter("original_vs_alternative")}
            className={`rounded-md px-2.5 py-1 transition-colors whitespace-nowrap ${
              filter === "original_vs_alternative"
                ? "bg-white/[0.12] text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            vs Alternative
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((item) => (
          <ComparisonCard
            key={item.id}
            comparison={item}
            onSelect={onSelectComparison}
            isSelected={selectedId === item.id}
          />
        ))}
      </div>
    </div>
  );
}
