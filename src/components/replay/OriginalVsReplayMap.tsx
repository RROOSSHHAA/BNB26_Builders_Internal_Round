"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, GitBranch, Sparkles, Play } from "lucide-react";
import { ReplayRegionComparison } from "@/types";

interface OriginalVsReplayMapProps {
  originalRegions: ReplayRegionComparison[];
  replayRegions: ReplayRegionComparison[];
  whatChanged: string;
  downstreamEffect: string;
  finalResultText: string;
  originalResult: "FAILED" | "ANOMALY";
  replayResult: "SUCCESS" | "FAILED";
}

export function OriginalVsReplayMap({
  originalRegions,
  replayRegions,
  whatChanged,
  downstreamEffect,
  finalResultText,
  originalResult,
  replayResult,
}: OriginalVsReplayMapProps) {
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [activeSimIndex, setActiveSimIndex] = React.useState<number | null>(null);

  const handleSimulateFlow = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimIndex(0);

    const stepInterval = setInterval(() => {
      setActiveSimIndex((prev) => {
        if (prev === null || prev >= 3) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          return null;
        }
        return prev + 1;
      });
    }, 450);
  };

  const getStatusIcon = (status: "ok" | "warn" | "fail") => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "warn":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "fail":
        return <XCircle className="h-3.5 w-3.5 text-red-400" />;
    }
  };

  const getStatusBadge = (status: "ok" | "warn" | "fail", isSimActive = false) => {
    if (isSimActive) {
      return "border-white/40 bg-white/[0.1] text-white ring-1 ring-white/20 scale-[1.03]";
    }
    switch (status) {
      case "ok":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      case "warn":
        return "border-white/10 bg-white/[0.04] text-zinc-300";
      case "fail":
        return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-zinc-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Original vs. Replay Region Map
          </h3>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-sans">
          {/* Simulate Path Button */}
          <button
            type="button"
            onClick={handleSimulateFlow}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.04] text-[10px] text-zinc-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-50 transition-all font-sans font-medium"
            title="Step through path simulation"
          >
            <Play className="h-3 w-3 text-zinc-400" />
            <span>{isSimulating ? "Simulating..." : "Simulate Path Flow"}</span>
          </button>

          <span className="rounded px-2 py-0.5 text-[10px] border border-rose-500/20 bg-rose-500/10 text-rose-300 font-medium">
            {originalResult}
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-500" />
          <span className="rounded px-2 py-0.5 text-[10px] border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-semibold">
            {replayResult}
          </span>
        </div>
      </div>

      {/* Side-by-side Dual Region Flow */}
      <div className="space-y-4">
        {/* 1. ORIGINAL PATH */}
        <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              ORIGINAL EXECUTION PATH
            </span>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.2 rounded">
              Diverged at Validation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {originalRegions.map((reg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.04 }}
                className={`flex items-center justify-between rounded-md border p-2 text-xs font-mono transition-all ${getStatusBadge(
                  reg.status
                )}`}
              >
                <div>
                  <div className="font-semibold">{reg.name}</div>
                  <div className="text-[10px] opacity-70">Steps {reg.range}</div>
                </div>
                {getStatusIcon(reg.status)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. REPLAY SIMULATED PATH */}
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.02] p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              REPLAY SIMULATED PATH
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 rounded font-medium">
              Recovered & Converged
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {replayRegions.map((reg, idx) => {
              const isSimActive = activeSimIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: 0.1 + idx * 0.04 }}
                  className={`flex items-center justify-between rounded-md border p-2 text-xs font-mono transition-all ${getStatusBadge(
                    reg.status,
                    isSimActive
                  )}`}
                >
                  <div>
                    <div className="font-semibold">{reg.name}</div>
                    <div className="text-[10px] opacity-70">
                      {idx < 2 ? `Cached: Steps ${reg.range}` : `Replayed: Steps ${reg.range}`}
                    </div>
                  </div>
                  {getStatusIcon(reg.status)}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Structured Replay Differences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 text-xs font-mono">
        {/* What Changed */}
        <div className="rounded-md border border-white/[0.06] bg-[#080c13] p-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
            WHAT CHANGED?
          </span>
          <p className="text-zinc-200 leading-relaxed font-mono">
            {whatChanged}
          </p>
        </div>

        {/* Downstream Effect */}
        <div className="rounded-md border border-white/[0.06] bg-[#080c13] p-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
            DOWNSTREAM EFFECT
          </span>
          <p className="text-zinc-200 leading-relaxed font-mono">
            {downstreamEffect}
          </p>
        </div>

        {/* Final Result */}
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 block mb-1">
            FINAL RESULT
          </span>
          <p className="text-emerald-300 font-semibold font-mono">
            {finalResultText}
          </p>
        </div>
      </div>
    </div>
  );
}
