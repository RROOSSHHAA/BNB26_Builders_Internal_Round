"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface AgentHealthChartProps {
  agentName: string;
  className?: string;
}

export function AgentHealthChart({ agentName, className }: AgentHealthChartProps) {
  // 14-day mock trend data points: nominal vs anomaly executions
  const dataPoints = [
    { day: "Sep 20", total: 12, ok: 11, fail: 1 },
    { day: "Sep 21", total: 14, ok: 14, fail: 0 },
    { day: "Sep 22", total: 18, ok: 17, fail: 1 },
    { day: "Sep 23", total: 15, ok: 13, fail: 2 },
    { day: "Sep 24", total: 22, ok: 20, fail: 2 },
    { day: "Sep 25", total: 19, ok: 18, fail: 1 },
    { day: "Sep 26", total: 25, ok: 24, fail: 1 },
    { day: "Sep 27", total: 16, ok: 16, fail: 0 },
    { day: "Sep 28", total: 28, ok: 25, fail: 3 },
    { day: "Sep 29", total: 24, ok: 22, fail: 2 },
    { day: "Sep 30", total: 31, ok: 30, fail: 1 },
    { day: "Oct 01", total: 26, ok: 24, fail: 2 },
    { day: "Oct 02", total: 34, ok: 31, fail: 3 },
    { day: "Oct 03", total: 29, ok: 26, fail: 3 },
  ];

  const maxTotal = Math.max(...dataPoints.map((d) => d.total));

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-5 select-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
              EXECUTION HEALTH TIMELINE
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Success vs failure divergence frequency over the past 14 days.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-xs bg-emerald-400" />
            <span>Nominal (89%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="h-2 w-2 rounded-xs bg-red-400" />
            <span>Anomalies (11%)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-4 px-1">
        {dataPoints.map((dp, idx) => {
          const heightPercent = Math.round((dp.total / maxTotal) * 100);
          const okPercent = Math.round((dp.ok / dp.total) * 100);
          const failPercent = 100 - okPercent;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end cursor-pointer"
            >
              {/* Hover Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 px-2 py-1 rounded bg-[#05080e] border border-white/20 text-[10px] font-mono text-zinc-200 whitespace-nowrap shadow-xl">
                <div>{dp.day}</div>
                <div className="text-emerald-400">{dp.ok} nominal</div>
                {dp.fail > 0 && <div className="text-red-400">{dp.fail} failed</div>}
              </div>

              {/* Stacked Bar Container */}
              <div
                className="w-full rounded-t-sm overflow-hidden flex flex-col justify-end bg-white/[0.03] group-hover:brightness-125 transition-all"
                style={{ height: `${heightPercent}%` }}
              >
                {/* Fail portion (top) */}
                {dp.fail > 0 && (
                  <div
                    className="w-full bg-red-500/80"
                    style={{ height: `${failPercent}%` }}
                  />
                )}
                {/* OK portion (bottom) */}
                <div
                  className="w-full bg-emerald-500/80"
                  style={{ height: `${okPercent}%` }}
                />
              </div>

              {/* Day label */}
              <span className="text-[9px] font-mono text-zinc-500 block truncate">
                {dp.day.split(" ")[1]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>Mean time between anomalies: 18.2 hours</span>
        <span>Statistical stability score: 91.4/100</span>
      </div>
    </div>
  );
}
