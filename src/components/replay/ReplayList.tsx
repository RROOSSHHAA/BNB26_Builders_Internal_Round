"use client";

import * as React from "react";
import { History, Play, Filter } from "lucide-react";
import { ReplayInvestigation } from "@/types";
import { ReplayCard } from "./ReplayCard";

interface ReplayListProps {
  replays: ReplayInvestigation[];
  selectedReplayId?: string;
  onSelectReplay: (replay: ReplayInvestigation) => void;
}

export function ReplayList({
  replays,
  selectedReplayId,
  onSelectReplay,
}: ReplayListProps) {
  const [filter, setFilter] = React.useState<"all" | "success" | "failed">("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return replays;
    if (filter === "success") return replays.filter((r) => r.replayResult === "SUCCESS");
    if (filter === "failed") return replays.filter((r) => r.replayResult === "FAILED");
    return replays;
  }, [replays, filter]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-200">
            Recent Replay Investigations
          </h3>
          <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] font-mono text-zinc-400">
            {filtered.length}
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-[#0c1017] p-0.5 text-[11px] font-mono">
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
            onClick={() => setFilter("success")}
            className={`rounded px-2 py-0.5 transition-colors ${
              filter === "success"
                ? "bg-emerald-500/20 text-emerald-300 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Recovered
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`rounded px-2 py-0.5 transition-colors ${
              filter === "failed"
                ? "bg-red-500/20 text-red-300 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            No Improvement
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((replay) => (
          <ReplayCard
            key={replay.id}
            replay={replay}
            onSelect={onSelectReplay}
            isSelected={selectedReplayId === replay.id}
          />
        ))}
      </div>
    </div>
  );
}
