"use client";

import * as React from "react";
import { Search, X, Calendar, Filter, RotateCcw } from "lucide-react";
import { ActivityCategory, ActivityDateFilter } from "@/types";

interface HistoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ActivityCategory;
  onCategoryChange: (cat: ActivityCategory) => void;
  selectedDate: ActivityDateFilter;
  onDateChange: (d: ActivityDateFilter) => void;
  totalFilteredCount: number;
  onReset: () => void;
}

export function HistoryFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
  totalFilteredCount,
  onReset,
}: HistoryFilterBarProps) {
  const categories: Array<{ id: ActivityCategory; label: string }> = [
    { id: "all", label: "All Activity" },
    { id: "executions", label: "Executions" },
    { id: "diagnoses", label: "Diagnoses" },
    { id: "replays", label: "Replays" },
    { id: "comparisons", label: "Comparisons" },
    { id: "agents", label: "Agents" },
    { id: "integrations", label: "Integrations" },
    { id: "api_keys", label: "API Keys" },
    { id: "settings", label: "Settings" },
  ];

  const dateFilters: Array<{ id: ActivityDateFilter; label: string }> = [
    { id: "all", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "last_7_days", label: "Last 7 Days" },
    { id: "last_30_days", label: "Last 30 Days" },
  ];

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "all" ||
    selectedDate !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 font-sans">
      {/* Top row: Search input + Date Selector + Active count / Reset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activity by execution ID (e.g. EX-2048), agent, diagnosis, or keyword..."
            className="w-full h-9 rounded-lg bg-[#090d14] pl-9 pr-9 text-xs text-zinc-200 placeholder:text-zinc-500 border border-white/[0.08] focus:border-white/20 focus:outline-hidden transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0 font-sans">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Calendar className="h-3 w-3" />
            Time:
          </span>
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#090d14] p-0.5">
            {dateFilters.map((df) => (
              <button
                key={df.id}
                onClick={() => onDateChange(df.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-sans transition-colors whitespace-nowrap ${
                  selectedDate === df.id
                    ? "bg-white/[0.12] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="ml-1 flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors font-sans"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Category filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-t border-white/[0.04] pt-2.5 font-sans">
        <span className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 mr-1.5 shrink-0">
          <Filter className="h-3 w-3" />
          Filter:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-sans transition-all whitespace-nowrap border ${
                isSelected
                  ? "bg-white/[0.12] text-white border-white/20 font-medium shadow-xs"
                  : "bg-white/[0.02] text-zinc-400 border-white/[0.05] hover:text-zinc-200 hover:border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        <div className="ml-auto pl-2 text-xs text-zinc-400 font-sans shrink-0">
          Showing <span className="text-zinc-200 font-medium font-mono">{totalFilteredCount}</span> events
        </div>
      </div>
    </div>
  );
}
