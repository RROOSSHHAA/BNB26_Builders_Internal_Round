"use client";

import * as React from "react";
import { Execution } from "@/types";
import { ArrowDown, CheckCircle2, AlertTriangle, Flame, Layers } from "lucide-react";

interface ExecutionCausalStoryProps {
  execution: Execution;
}

export function ExecutionCausalStory({ execution }: ExecutionCausalStoryProps) {
  const isFailed = execution.status === "failed";

  if (!isFailed) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              EXECUTION CONTEXT
            </span>
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              Causal Progression
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Nominal execution flow across all lifecycle stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">NORMAL</span>
            <span className="text-zinc-200 font-semibold mt-1 block">Retrieval Ingestion</span>
            <p className="text-[11px] text-zinc-400 mt-1">Prompt parsed and context chunks fetched nominally.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">NORMAL</span>
            <span className="text-zinc-200 font-semibold mt-1 block">Reasoning & Synthesis</span>
            <p className="text-[11px] text-zinc-400 mt-1">Derived valid allocation vector frontier.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">NORMAL</span>
            <span className="text-zinc-200 font-semibold mt-1 block">Safety Validation</span>
            <p className="text-[11px] text-zinc-400 mt-1">Verified schema invariants and output structure.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">NORMAL</span>
            <span className="text-zinc-200 font-semibold mt-1 block">Final Delivery</span>
            <p className="text-[11px] text-zinc-400 mt-1">Structured payload delivered to client.</p>
          </div>
        </div>
      </div>
    );
  }

  const stages = [
    {
      label: "NORMAL",
      badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      title: "Data Retrieval",
      description: "Data retrieval completed with 28 verified 10-K document chunks.",
    },
    {
      label: "NORMAL",
      badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      title: "Reasoning Phase",
      description: "Reasoning completed successfully with valid margin decomposition.",
    },
    {
      label: "ANOMALY",
      badgeClass: "bg-red-500/25 text-red-300 border-red-500/40 animate-pulse font-bold",
      title: "Validation Anomaly (Step 73)",
      description: "Validation output deviated from expected structure with 91% failure likelihood.",
    },
    {
      label: "AFFECTED",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/35 font-bold",
      title: "Downstream Finalization",
      description: "Downstream finalization became affected and emitted corrupted summary tables.",
    },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            EXECUTION CONTEXT
          </span>
          <span className="h-1 w-1 rounded-full bg-cyan-400" />
          <span className="text-[11px] font-mono text-zinc-500">
            Causal Timeline Progression
          </span>
        </div>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          How nominal reasoning escalated into an anomalous validation failure and downstream corruption.
        </p>
      </div>

      {/* Visual Progression Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {stages.map((stage, idx) => (
          <div key={idx} className="relative flex flex-col justify-between p-4 rounded-xl border border-white/[0.06] bg-[#0c1017]">
            <div>
              {/* State Pill */}
              <span
                className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${stage.badgeClass}`}
              >
                {stage.label}
              </span>

              {/* Title */}
              <h4 className="mt-2 text-xs font-bold font-mono text-zinc-100">
                {stage.title}
              </h4>

              {/* Description */}
              <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">
                {stage.description}
              </p>
            </div>

            {/* Step Counter */}
            <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
              Stage 0{idx + 1} of 04
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
