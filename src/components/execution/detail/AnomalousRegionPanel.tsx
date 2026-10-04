"use client";

import * as React from "react";
import { ExecutionRegion } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnomalousRegionPanelProps {
  region: ExecutionRegion;
  onSelectStep?: (stepNumber: number) => void;
}

export function AnomalousRegionPanel({
  region,
  onSelectStep,
}: AnomalousRegionPanelProps) {
  const isAnomalous = region.status === "critical" || region.isAnomaly;
  const isAffected = region.status === "affected" || region.status === "warning";

  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 space-y-5 transition-all ${
        isAnomalous
          ? "border-red-500/40 bg-red-950/10 shadow-[0_0_25px_rgba(239,68,68,0.08)]"
          : isAffected
          ? "border-amber-500/30 bg-amber-950/10"
          : "border-white/[0.08] bg-[#090d14]"
      }`}
    >
      {/* Panel Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${
                isAnomalous
                  ? "text-red-400"
                  : isAffected
                  ? "text-amber-400"
                  : "text-cyan-400"
              }`}
            >
              {isAnomalous
                ? "ANOMALOUS REGION"
                : isAffected
                ? "AFFECTED REGION"
                : "SELECTED REGION"}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-[11px] font-mono text-zinc-500">
              Region Investigation
            </span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-white tracking-tight">
            {region.name} (Steps {region.startStep}–{region.endStep})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-3 py-1 rounded-md border font-bold uppercase ${
              isAnomalous
                ? "border-red-500/40 bg-red-500/20 text-red-300"
                : isAffected
                ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {isAnomalous ? "Anomalous" : isAffected ? "Affected" : "Normal"}
          </span>
        </div>
      </div>

      {/* Primary Intelligence Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Region</span>
          <span className="text-zinc-200 font-bold mt-1 block truncate">
            {region.name}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Steps</span>
          <span className="text-zinc-200 font-bold mt-1 block">
            {region.startStep}–{region.endStep}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">
            Most Suspicious
          </span>
          <span
            className={`font-bold mt-1 block ${
              isAnomalous ? "text-red-400" : "text-zinc-400"
            }`}
          >
            {isAnomalous ? "Step 73" : "None"}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Confidence</span>
          <span
            className={`font-bold mt-1 block ${
              isAnomalous ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {isAnomalous ? "91%" : "99.4%"}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Duration</span>
          <span className="text-zinc-200 font-bold mt-1 block">
            {((region.metrics?.latencyMs || 2800) / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#070a0f]">
          <span className="text-[10px] text-zinc-500 uppercase block">Status</span>
          <span
            className={`font-bold mt-1 block uppercase ${
              isAnomalous
                ? "text-red-400"
                : isAffected
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {isAnomalous ? "Anomalous" : isAffected ? "Affected" : "Normal"}
          </span>
        </div>
      </div>

      {/* Diagnostic Evidence List */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
          Diagnostic Evidence
        </span>

        {isAnomalous ? (
          <ul className="space-y-2 text-xs font-mono text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
              <span>Output deviated from previous successful executions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
              <span>Validation result did not match expected structure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
              <span>Downstream steps were affected</span>
            </li>
          </ul>
        ) : isAffected ? (
          <ul className="space-y-2 text-xs font-mono text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
              <span>Ingested anomalous upstream validation artifact from Step 73</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
              <span>Propagated deviation into final response summary payload</span>
            </li>
          </ul>
        ) : (
          <ul className="space-y-2 text-xs font-mono text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span>All steps completed within nominal latency bounds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span>No token overflow or tool schema mismatches detected</span>
            </li>
          </ul>
        )}
      </div>

      {/* Mock telemetry disclaimer */}
      <div className="pt-2 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
        <Info className="h-3 w-3 text-zinc-500" />
        <span>Mock diagnostic evaluations. Structured for ML anomaly inference integration.</span>
      </div>
    </div>
  );
}
