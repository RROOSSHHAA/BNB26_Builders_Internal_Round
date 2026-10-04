"use client";

import * as React from "react";
import { Agent } from "@/types";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export interface FilterState {
  search: string;
  agent: string;
  status: string;
  failureCategory: string;
  dateRange: string;
  duration: string;
  sortBy: "newest" | "oldest" | "duration-desc" | "duration-asc" | "steps-desc" | "steps-asc";
}

interface ExecutionFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  agents: Agent[];
  totalCount: number;
  filteredCount: number;
}

export function ExecutionFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  agents,
  totalCount,
  filteredCount,
}: ExecutionFilterBarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  // Calculate active filter count (excluding default search and default sort)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.agent !== "all") count++;
    if (filters.status !== "all") count++;
    if (filters.failureCategory !== "all") count++;
    if (filters.dateRange !== "all") count++;
    if (filters.duration !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    return count;
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-3">
      {/* Main Filter Bar */}
      <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0c1017] flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search executions, agents, prompt text, or trace IDs..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-white/10 bg-[#070a0f] text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Desktop Filter Dropdowns (hidden on mobile, visible from md up) */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap">
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

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="failed">Failed Only</option>
            <option value="success">Success Only</option>
          </select>

          {/* Failure Category Filter */}
          <select
            value={filters.failureCategory}
            onChange={(e) => updateFilter("failureCategory", e.target.value)}
            className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Failure Categories</option>
            <option value="Validation">Validation</option>
            <option value="Retrieval">Retrieval</option>
            <option value="Tool Failure">Tool Failure</option>
            <option value="Reasoning">Reasoning</option>
            <option value="Context Overflow">Context Overflow</option>
            <option value="Upstream Timeout">Upstream Timeout</option>
          </select>

          {/* Date Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter("dateRange", e.target.value)}
            className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Duration Filter */}
          <select
            value={filters.duration}
            onChange={(e) => updateFilter("duration", e.target.value)}
            className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Any Duration</option>
            <option value="fast">&lt; 10s (Fast)</option>
            <option value="medium">10s – 20s</option>
            <option value="long">&gt; 20s (Long)</option>
          </select>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/[0.08]">
            <ArrowUpDown className="h-3 w-3 text-zinc-500" />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value as FilterState["sortBy"])}
              className="rounded-lg border border-white/10 bg-[#070a0f] px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration-desc">Duration: Longest</option>
              <option value="duration-asc">Duration: Shortest</option>
              <option value="steps-desc">Most Steps</option>
              <option value="steps-asc">Least Steps</option>
            </select>
          </div>
        </div>

        {/* Mobile / Tablet Filter Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileDrawerOpen(true)}
            className="relative font-mono text-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Quick Sort on Mobile */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value as FilterState["sortBy"])}
            className="rounded-lg border border-white/10 bg-[#070a0f] px-2 py-1.5 text-xs font-mono text-zinc-300"
          >
            <option value="newest">Newest</option>
            <option value="duration-desc">Duration</option>
            <option value="steps-desc">Steps</option>
          </select>
        </div>

        {/* Clear Filters Button (shown when filters are active) */}
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] hover:border-red-500/30 bg-white/[0.02] hover:bg-red-500/10 text-xs font-mono text-zinc-400 hover:text-red-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Showing Count Status Strip */}
      <div className="flex items-center justify-between px-1 text-xs font-mono text-zinc-500">
        <div>
          Showing <span className="text-zinc-200 font-semibold">{filteredCount}</span> of{" "}
          <span>{totalCount}</span> executions
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">Filters Active</span>
            <button
              onClick={onResetFilters}
              className="text-zinc-400 hover:text-zinc-200 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        title="Execution Filters"
        subtitle="Narrow down agent runs by telemetry attributes"
        width="md"
        footer={
          <div className="flex items-center justify-between gap-3 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onResetFilters();
                setMobileDrawerOpen(false);
              }}
            >
              Reset All
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setMobileDrawerOpen(false)}
            >
              Apply Filters ({filteredCount})
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Agent Filter */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Agent
            </label>
            <select
              value={filters.agent}
              onChange={(e) => updateFilter("agent", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200"
            >
              <option value="all">All Agents</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Execution Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200"
            >
              <option value="all">All Statuses</option>
              <option value="failed">Failed Only</option>
              <option value="success">Success Only</option>
            </select>
          </div>

          {/* Failure Category */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Failure Category
            </label>
            <select
              value={filters.failureCategory}
              onChange={(e) => updateFilter("failureCategory", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200"
            >
              <option value="all">All Failure Categories</option>
              <option value="Validation">Validation</option>
              <option value="Retrieval">Retrieval</option>
              <option value="Tool Failure">Tool Failure</option>
              <option value="Reasoning">Reasoning</option>
              <option value="Context Overflow">Context Overflow</option>
              <option value="Upstream Timeout">Upstream Timeout</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Time Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => updateFilter("dateRange", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Duration
            </label>
            <select
              value={filters.duration}
              onChange={(e) => updateFilter("duration", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200"
            >
              <option value="all">Any Duration</option>
              <option value="fast">&lt; 10s (Fast)</option>
              <option value="medium">10s – 20s</option>
              <option value="long">&gt; 20s (Long)</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value as FilterState["sortBy"])}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration-desc">Duration: Longest</option>
              <option value="duration-asc">Duration: Shortest</option>
              <option value="steps-desc">Most Steps</option>
              <option value="steps-asc">Least Steps</option>
            </select>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
