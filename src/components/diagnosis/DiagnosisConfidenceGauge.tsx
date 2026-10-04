"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, Info } from "lucide-react";

interface DiagnosisConfidenceGaugeProps {
  score: number; // 0 to 1, e.g. 0.91
  label?: string; // e.g. "High confidence"
  className?: string;
}

export function DiagnosisConfidenceGauge({
  score = 0.91,
  label = "High confidence",
  className,
}: DiagnosisConfidenceGaugeProps) {
  const percentage = Math.round(score * 100);

  // SVG circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#0c1017] p-5 flex flex-col items-center justify-between text-center select-none relative overflow-hidden font-sans",
        className
      )}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-white/[0.05] pb-2.5">
        <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
          DIAGNOSIS CONFIDENCE
        </span>
        <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full border border-white/20 bg-white/[0.06] text-zinc-200 font-semibold">
          {label}
        </span>
      </div>

      {/* Circular Gauge */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-white/[0.07]"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Active progress stroke */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-white transition-all duration-1000 ease-out"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-sans tracking-tight text-white">
            {percentage}%
          </span>
          <span className="text-[9px] font-sans uppercase text-zinc-400 -mt-1 font-semibold">
            Likelihood
          </span>
        </div>
      </div>

      {/* Supporting Text */}
      <div className="pt-2 border-t border-white/[0.04] text-[11px] font-sans text-zinc-400 leading-relaxed text-center">
        <p>Confidence reflects the strength of the available diagnostic signals.</p>
        <span className="text-[10px] font-sans text-zinc-500 block mt-1">
          Grounding: Statistical divergence from 28 golden runs
        </span>
      </div>
    </div>
  );
}
