"use client";

import * as React from "react";
import { Search, X, RotateCcw, ArrowUpDown } from "lucide-react";

export interface AgentFilterState {
  search: string;
  status: string;
  model: string;
  failureRate: string;
  sortBy: "most-active" | "highest-failure" | "recently-active" | "recently-created";
}

interface AgentFilterBarProps {
  filters: AgentFilterState;
  onFilterChange: (filters: AgentFilterState) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function AgentFilterBar({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}: AgentFilterBarProps) {
  const updateFilter = <K extends keyof AgentFilterState>(
    key: K,
    value: AgentFilterState[K]
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const activeCount = React.useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.status !== "all") count++;
    if (filters.model !== "all") count++;
    if (filters.failureRate !== "all") count++;
    if (filters.sortBy !== "most-active") count++;
    return count;
  }, [filters]);

  return (
    <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0c1017] flex flex-wrap items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search agents, models, tags..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-full pl-9 pr-7 py-1.5 rounded-lg border border-white/10 bg-[#070a0f] text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter("search", "")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="needs_attention">Needs Attention</option>
          <option value="idle">Idle</option>
        </select>

        {/* Model Filter */}
        <select
          value={filters.model}
          onChange={(e) => updateFilter("model", e.target.value)}
          className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Models</option>
          <option value="Demo Reasoning Model">Demo Reasoning Model</option>
          <option value="GPT-4o">GPT-4o</option>
          <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
          <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
        </select>

        {/* Failure Rate Filter */}
        <select
          value={filters.failureRate}
          onChange={(e) => updateFilter("failureRate", e.target.value)}
          className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">Any Failure Rate</option>
          <option value="low">&lt; 5% (Low)</option>
          <option value="moderate">5% – 15% (Moderate)</option>
          <option value="high">&gt; 15% (High)</option>
        </select>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/[0.08]">
          <ArrowUpDown className="h-3 w-3 text-zinc-500" />
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value as AgentFilterState["sortBy"])}
            className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="most-active">Most Active</option>
            <option value="highest-failure">Highest Failure Rate</option>
            <option value="recently-active">Recently Active</option>
            <option value="recently-created">Recently Created</option>
          </select>
        </div>

        {/* Reset Button */}
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-red-500/10 hover:text-red-300 text-xs font-mono text-zinc-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset ({activeCount})</span>
          </button>
        )}
      </div>

      <div className="text-xs font-mono text-zinc-500">
        Showing <span className="text-zinc-200 font-semibold">{filteredCount}</span> of {totalCount} agents
      </div>
    </div>
  );
}
