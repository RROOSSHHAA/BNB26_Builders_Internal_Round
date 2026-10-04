"use client";

import * as React from "react";
import { DiagnosisEvidenceSignal } from "@/types";
import { cn } from "@/lib/utils";
import { Activity, Sparkles, BarChart2 } from "lucide-react";

interface DiagnosisEvidenceSignalsProps {
  signals?: DiagnosisEvidenceSignal[];
  className?: string;
}

export function DiagnosisEvidenceSignals({
  signals,
  className,
}: DiagnosisEvidenceSignalsProps) {
  const defaultSignals: DiagnosisEvidenceSignal[] = [
    { name: "Output deviation", level: "High", percentage: 92 },
    { name: "Latency deviation", level: "Moderate", percentage: 58 },
    { name: "Downstream impact", level: "High", percentage: 88 },
    { name: "Historical difference", level: "High", percentage: 94 },
  ];

  const activeSignals = signals && signals.length > 0 ? signals : defaultSignals;

  // Render 12-segment meter for each signal
  const renderSegments = (percentage: number) => {
    const totalSegments = 12;
    const filledSegments = Math.round((percentage / 100) * totalSegments);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isFilled = i < filledSegments;
          return (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-xs transition-all",
                isFilled
                  ? "bg-zinc-200"
                  : "bg-white/[0.08]"
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#0c1017] p-5 space-y-4 select-none font-sans",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-zinc-400" />
          <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-300 font-semibold">
            DIAGNOSTIC EVIDENCE SIGNALS
          </span>
        </div>
        <span className="text-[10px] font-sans text-zinc-500">Heuristic Telemetry</span>
      </div>

      {/* Signal Rows */}
      <div className="space-y-3.5">
        {activeSignals.map((signal, idx) => {
          return (
            <div key={signal.name || idx} className="space-y-1.5 font-sans text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-xs font-medium text-zinc-200">{signal.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500">
                    {signal.percentage}%
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-white/[0.06] text-zinc-300 border border-white/10">
                    {signal.level}
                  </span>
                </div>
              </div>

              {/* Segmented Bar Visualizer */}
              {renderSegments(signal.percentage)}
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-white/[0.04] text-[10px] font-sans text-zinc-500">
        Signals calibrated against automated anomaly detection baseline.
      </div>
    </div>
  );
}
