"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  GitFork,
  Sparkles,
} from "lucide-react";

interface RegionNode {
  name: string;
  status: "ok" | "warn" | "fail";
  range?: string;
}

interface BranchingPathVisualizerProps {
  originalPath: RegionNode[];
  alternativePath: RegionNode[];
  divergenceStep: number;
  divergenceRegion: string;
  originalOutcome: "FAILED" | "ANOMALY";
  alternativeOutcome: "SUCCESS" | "PARTIAL RECOVERY" | "NO IMPROVEMENT";
}

export function BranchingPathVisualizer({
  originalPath,
  alternativePath,
  divergenceStep,
  divergenceRegion,
  originalOutcome,
  alternativeOutcome,
}: BranchingPathVisualizerProps) {
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

  const getStatusBadge = (status: "ok" | "warn" | "fail") => {
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
      {/* Header with Divergence Anchor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-zinc-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-sans">
            Branching Path Comparison
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="text-zinc-400">Divergence Point:</span>
          <span className="rounded bg-white/[0.06] border border-white/10 text-zinc-300 px-2 py-0.5 font-semibold text-[11px] font-sans">
            Step {divergenceStep} ({divergenceRegion})
          </span>
        </div>
      </div>

      {/* Visual Branching Paths */}
      <div className="space-y-4">
        {/* 1. ORIGINAL PATH */}
        <div className="rounded-xl border border-white/[0.07] bg-[#080c13] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5 font-sans">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              ORIGINAL PATH
            </span>
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold border border-rose-500/20 bg-rose-500/10 text-rose-300 font-sans">
              {originalOutcome}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {originalPath.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className={`flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors font-sans ${getStatusBadge(
                  node.status
                )}`}
              >
                <div>
                  <div className="font-semibold text-zinc-200">{node.name}</div>
                  {node.range && (
                    <div className="text-[10px] opacity-70">Steps {node.range}</div>
                  )}
                </div>
                {getStatusIcon(node.status)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Branching Divergence Ribbon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-center -my-2 relative z-10"
        >
          <div className="rounded-full bg-[#0e121b] border border-white/20 px-3.5 py-1 text-[11px] text-zinc-200 shadow-lg flex items-center gap-2 font-sans">
            <Sparkles className="h-3 w-3 text-zinc-400" />
            <span>Path diverged at Step {divergenceStep} with alternative decision</span>
          </div>
        </motion.div>

        {/* 2. ALTERNATIVE PATH */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5 font-sans">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              ALTERNATIVE SIMULATED PATH
            </span>
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-sans">
              {alternativeOutcome}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {alternativePath.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.25 + idx * 0.05 }}
                className={`flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors ${getStatusBadge(
                  node.status
                )}`}
              >
                <div>
                  <div className="font-semibold text-zinc-100">{node.name}</div>
                  {node.range && (
                    <div className="text-[10px] opacity-70">Steps {node.range}</div>
                  )}
                </div>
                {getStatusIcon(node.status)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
