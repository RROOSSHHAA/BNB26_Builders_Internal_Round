"use client";

import * as React from "react";
import { Search, X, Filter } from "lucide-react";

export type ProviderFilterOption = "all" | "connected" | "not_connected" | "custom";

interface ProviderFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: ProviderFilterOption;
  onFilterChange: (filter: ProviderFilterOption) => void;
  counts: {
    all: number;
    connected: number;
    not_connected: number;
    custom: number;
  };
}

export function ProviderFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts,
}: ProviderFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search providers, models, endpoints..."
          className="w-full rounded-lg border border-white/[0.08] bg-[#0c1017] pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-2.5 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0c1017] p-1 text-xs overflow-x-auto">
        <button
          onClick={() => onFilterChange("all")}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-white/[0.1] text-zinc-100 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>All</span>
          <span className="rounded bg-black/40 px-1.5 py-0.2 text-[10px] text-zinc-500">
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("connected")}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
            activeFilter === "connected"
              ? "bg-emerald-500/20 text-emerald-300 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Connected</span>
          <span className="rounded bg-black/40 px-1.5 py-0.2 text-[10px] text-emerald-400/80">
            {counts.connected}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("not_connected")}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
            activeFilter === "not_connected"
              ? "bg-white/[0.1] text-zinc-100 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Not connected</span>
          <span className="rounded bg-black/40 px-1.5 py-0.2 text-[10px] text-zinc-500">
            {counts.not_connected}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("custom")}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
            activeFilter === "custom"
              ? "bg-cyan-500/20 text-cyan-300 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Custom</span>
          <span className="rounded bg-black/40 px-1.5 py-0.2 text-[10px] text-cyan-400/80">
            {counts.custom}
          </span>
        </button>
      </div>
    </div>
  );
}
