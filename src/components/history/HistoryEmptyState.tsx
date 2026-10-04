"use client";

import * as React from "react";
import { History, RotateCcw } from "lucide-react";

interface HistoryEmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function HistoryEmptyState({
  hasFilters,
  onReset,
}: HistoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#0c1017]/60 p-12 text-center backdrop-blur-xs">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-zinc-400 mb-4 shadow-inner">
        <History className="h-6 w-6 text-zinc-300" />
      </div>

      <h3 className="text-base font-semibold text-zinc-100 font-mono tracking-tight">
        {hasFilters ? "No matching workspace activity found" : "No activity yet."}
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-zinc-400 font-mono leading-relaxed">
        {hasFilters
          ? "No events match the current search query or filter selection. Try clearing or expanding your search parameters."
          : "Your Black Box investigations, executions, replays, and other workspace activity will appear here."}
      </p>

      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-xs font-mono text-zinc-200 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all shadow-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filter Selection</span>
        </button>
      )}
    </div>
  );
}
