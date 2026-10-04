"use client";

import * as React from "react";
import { GitFork, History } from "lucide-react";
import { AlternativeInvestigation, AlternativeOutcomeStatus } from "@/types";
import { AlternativeCard } from "./AlternativeCard";

interface AlternativeListProps {
  investigations: AlternativeInvestigation[];
  selectedId?: string;
  onSelectInvestigation: (item: AlternativeInvestigation) => void;
}

export function AlternativeList({
  investigations,
  selectedId,
  onSelectInvestigation,
}: AlternativeListProps) {
  const [filter, setFilter] = React.useState<"all" | "PROMISING" | "PARTIAL_RECOVERY" | "NO_IMPROVEMENT">("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return investigations;
    return investigations.filter((i) => i.alternativeStatus === filter);
  }, [investigations, filter]);

  return (
    <div className="flex flex-col gap-3 font-mono">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Recent Alternative Investigations
          </h3>
          <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] text-zinc-400">
            {filtered.length}
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-[#0c1017] p-0.5 text-[11px]">
          <button
            onClick={() => setFilter("all")}
            className={`rounded px-2 py-0.5 transition-colors ${
              filter === "all"
                ? "bg-white/[0.1] text-zinc-100 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("PROMISING")}
            className={`rounded px-2 py-0.5 transition-colors ${
              filter === "PROMISING"
                ? "bg-emerald-500/20 text-emerald-300 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Promising
          </button>
          <button
            onClick={() => setFilter("PARTIAL_RECOVERY")}
            className={`rounded px-2 py-0.5 transition-colors ${
              filter === "PARTIAL_RECOVERY"
                ? "bg-amber-500/20 text-amber-300 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Partial
          </button>
          <button
            onClick={() => setFilter("NO_IMPROVEMENT")}
            className={`rounded px-2 py-0.5 transition-colors ${
              filter === "NO_IMPROVEMENT"
                ? "bg-red-500/20 text-red-300 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Unchanged
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((item) => (
          <AlternativeCard
            key={item.id}
            investigation={item}
            onSelect={onSelectInvestigation}
            isSelected={selectedId === item.id}
          />
        ))}
      </div>
    </div>
  );
}
