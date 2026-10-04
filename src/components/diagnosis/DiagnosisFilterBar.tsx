"use client";

import * as React from "react";
import { Search, X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Agent } from "@/types";

export interface DiagnosisFilterState {
  search: string;
  agent: string;
  category: string;
  confidence: string;
  status: string;
}

interface DiagnosisFilterBarProps {
  filters: DiagnosisFilterState;
  onFilterChange: (filters: DiagnosisFilterState) => void;
  onReset: () => void;
  agents: Agent[];
  totalCount: number;
  filteredCount: number;
}

export function DiagnosisFilterBar({
  filters,
  onFilterChange,
  onReset,
  agents,
  totalCount,
  filteredCount,
}: DiagnosisFilterBarProps) {
  const updateFilter = (key: keyof DiagnosisFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const activeCount = React.useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.agent !== "all") count++;
    if (filters.category !== "all") count++;
    if (filters.confidence !== "all") count++;
    if (filters.status !== "all") count++;
    return count;
  }, [filters]);

  return (
    <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0c1017] flex flex-wrap items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search diagnoses, agent, step, or root cause..."
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

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Agent Filter */}
        <select
          value={filters.agent}
          onChange={(e) => updateFilter("agent", e.target.value)}
          className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Agents</option>
          {agents.map((ag) => (
            <option key={ag.id} value={ag.id}>
              {ag.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Validation">Validation</option>
          <option value="Retrieval">Retrieval</option>
          <option value="Tool Failure">Tool Failure</option>
          <option value="Reasoning">Reasoning</option>
          <option value="Context Overflow">Context Overflow</option>
          <option value="Timeout">Timeout</option>
        </select>

        {/* Confidence Filter */}
        <select
          value={filters.confidence}
          onChange={(e) => updateFilter("confidence", e.target.value)}
          className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Confidence</option>
          <option value="high">&gt; 90% (High)</option>
          <option value="medium">80% – 90% (Moderate)</option>
          <option value="low">&lt; 80%</option>
        </select>

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
        Showing <span className="text-zinc-200 font-semibold">{filteredCount}</span> of {totalCount}
      </div>
    </div>
  );
}
