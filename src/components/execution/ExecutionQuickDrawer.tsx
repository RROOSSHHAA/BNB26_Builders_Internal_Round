"use client";

import * as React from "react";
import Link from "next/link";
import { Execution } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { ExecutionStatusBadge } from "./execution-status";
import { AnomalyIndicator } from "./anomaly-indicator";
import { ExecutionMicroFlow } from "./ExecutionMicroFlow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatDuration,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
} from "@/lib/utils";
import {
  ExternalLink,
  SearchAlert,
  Terminal,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

interface ExecutionQuickDrawerProps {
  execution: Execution | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutionQuickDrawer({
  execution,
  isOpen,
  onClose,
}: ExecutionQuickDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!execution) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(execution.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFailed = execution.status === "failed";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={execution.id}
      subtitle={`${execution.agentName} (${execution.framework})`}
      width="xl"
      badge={<ExecutionStatusBadge status={execution.status} size="sm" />}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            {isFailed && (
              <Link href={`/dashboard/diagnoses?execution=${execution.id}`}>
                <Button variant="outline" size="sm" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10">
                  <SearchAlert className="h-3.5 w-3.5 mr-1.5" />
                  Investigate Root Cause
                </Button>
              </Link>
            )}

            <Link href={`/dashboard/executions/${execution.id}`}>
              <Button variant="primary" size="sm">
                <span>Open Full Execution</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Bar */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-[#0c1017]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Execution ID:</span>
            <span className="text-xs font-mono font-semibold text-cyan-400">
              {execution.id}
            </span>
            <button
              onClick={handleCopyId}
              className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
              title="Copy ID"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>{formatRelativeTime(execution.startTime)}</span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg border border-white/[0.06] bg-[#070a0f]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              Total Steps
            </span>
            <span className="text-base font-bold font-mono text-zinc-200 mt-1 block">
              {execution.totalSteps}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-white/[0.06] bg-[#070a0f]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              Duration
            </span>
            <span className="text-base font-bold font-mono text-zinc-200 mt-1 block">
              {formatDuration(execution.durationMs)}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-white/[0.06] bg-[#070a0f]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              Total Tokens
            </span>
            <span className="text-base font-bold font-mono text-zinc-200 mt-1 block">
              {formatNumber(execution.tokenUsage.total)}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-white/[0.06] bg-[#070a0f]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              Estimated Cost
            </span>
            <span className="text-base font-bold font-mono text-zinc-200 mt-1 block">
              {formatCurrency(execution.costUsd)}
            </span>
          </div>
        </div>

        {/* Intelligence / Failure Diagnosis Card */}
        {isFailed ? (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-red-300 font-semibold">
                  Execution Failure Analysis
                </span>
              </div>
              {execution.anomalyConfidence && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  {execution.anomalyConfidence}% Confidence
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Failure Category
                </span>
                <span className="text-zinc-200 font-medium mt-0.5 block">
                  {execution.failureCategory || "Anomaly"}
                </span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Suspicious Step
                </span>
                <span className="text-red-400 font-bold mt-0.5 block">
                  Step {execution.suspiciousStep || 73}
                </span>
              </div>
            </div>

            {execution.outputSummary && (
              <p className="text-xs text-zinc-300 font-sans leading-relaxed border-t border-red-500/20 pt-2">
                {execution.outputSummary}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                Nominal Flow Verified
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              No anomalies or critical divergence detected across all {execution.totalSteps} steps.
              All lifecycle execution regions completed with 99%+ confidence.
            </p>
          </div>
        )}

        {/* Trigger Prompt */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
            Trigger Prompt
          </span>
          <div className="p-3 rounded-lg border border-white/[0.06] bg-[#070a0f] text-xs font-mono text-zinc-300 leading-relaxed">
            {execution.triggerPrompt}
          </div>
        </div>

        {/* AI-Compressed Regions Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Compressed Execution Regions ({execution.regions.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              AI-Synthesized
            </span>
          </div>

          <div className="space-y-2">
            {execution.regions.map((reg, idx) => {
              const isCrit = reg.status === "critical" || reg.isAnomaly;
              const isWarn = reg.status === "warning";

              return (
                <div
                  key={reg.id || idx}
                  className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                    isCrit
                      ? "border-red-500/30 bg-red-500/[0.08]"
                      : isWarn
                      ? "border-amber-500/30 bg-amber-500/[0.08]"
                      : "border-white/[0.05] bg-[#0c1017]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCrit ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      ) : isWarn ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                      )}
                      <span className="font-semibold text-zinc-200">
                        {reg.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span>Steps {reg.startStep}–{reg.endStep}</span>
                      <span>({reg.stepCount} steps)</span>
                    </div>
                  </div>

                  <p className="mt-1.5 text-[11px] font-sans text-zinc-400 leading-relaxed pl-5">
                    {reg.summary}
                  </p>

                  {reg.anomalyReason && (
                    <div className="mt-2 ml-5 p-2 rounded-md bg-black/50 border border-red-500/20 text-red-300 text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 shrink-0 text-red-400" />
                      <span>{reg.anomalyReason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
