"use client";

import * as React from "react";
import { Terminal, Search, Sparkles, Play } from "lucide-react";
import { HistorySummaryStats } from "@/types";

interface HistorySummaryBarProps {
  stats: HistorySummaryStats;
}

export function HistorySummaryBar({ stats }: HistorySummaryBarProps) {
  const statItems = [
    {
      label: "Total Executions",
      value: stats.totalExecutions.toLocaleString(),
      subtext: "Traces recorded in workspace",
      icon: Terminal,
      color: "text-white",
      accent: "text-zinc-400 group-hover:text-white",
      glow: "hover:border-white/20",
    },
    {
      label: "Investigations",
      value: stats.investigations.toLocaleString(),
      subtext: "Deep-dives & inspected spans",
      icon: Search,
      color: "text-white",
      accent: "text-zinc-400 group-hover:text-white",
      glow: "hover:border-white/20",
    },
    {
      label: "Diagnoses",
      value: stats.diagnoses.toLocaleString(),
      subtext: "Root cause analyses evaluated",
      icon: Sparkles,
      color: "text-white",
      accent: "text-zinc-400 group-hover:text-white",
      glow: "hover:border-white/20",
    },
    {
      label: "Replays",
      value: stats.replays.toLocaleString(),
      subtext: "Forked simulations created",
      icon: Play,
      color: "text-white",
      accent: "text-zinc-400 group-hover:text-white",
      glow: "hover:border-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-sans items-stretch">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`group relative rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 transition-all duration-200 hover:bg-[#141822] flex flex-col justify-between h-full ${item.glow}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400">
                {item.label}
              </span>
              <Icon className={`h-4 w-4 transition-colors ${item.accent}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-bold font-sans tracking-tight ${item.color}`}>
                {item.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400 font-sans truncate">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
