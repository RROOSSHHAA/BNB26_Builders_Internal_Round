"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Execution } from "@/types";
import { ExecutionStatusBadge } from "./execution-status";
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
  Terminal,
  Clock,
  ArrowRight,
  ExternalLink,
  SearchAlert,
  Sparkles,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

interface ExecutionCardItemProps {
  execution: Execution;
  onQuickPeek: (execution: Execution) => void;
}

export function ExecutionCardItem({
  execution,
  onQuickPeek,
}: ExecutionCardItemProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const isFailed = execution.status === "failed";

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(execution.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // If user clicked a button or anchor or form input, don't hijack
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("select") ||
      target.closest("input")
    ) {
      return;
    }
    // Navigate directly to the execution detail page
    router.push(`/dashboard/executions/${execution.id}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isFailed
          ? "border-white/[0.08] hover:border-red-500/40 bg-[#090d14] hover:bg-[#0c101a]"
          : "border-white/[0.08] hover:border-cyan-500/30 bg-[#090d14] hover:bg-[#0b111c]"
      }`}
    >
      {/* Subtle failure indicator accent bar on the left edge */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
          isFailed
            ? "bg-red-500/50 group-hover:bg-red-400"
            : "bg-emerald-500/30 group-hover:bg-emerald-400"
        }`}
      />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6 space-y-3.5">
        {/* Top Header Row: Agent, Framework, ID, Status, Relative Time, Quick Peek */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Agent Icon */}
            <div
              className={`p-1.5 rounded-lg border shrink-0 ${
                isFailed
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-white/[0.08] bg-[#121824] text-cyan-400"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
            </div>

            {/* Agent Name */}
            <span className="font-semibold text-sm text-zinc-100 group-hover:text-cyan-300 transition-colors">
              {execution.agentName}
            </span>

            {/* Framework Badge */}
            <span className="text-[11px] font-mono text-zinc-500 px-1.5 py-0.5 rounded border border-white/[0.05] bg-white/[0.02]">
              {execution.framework}
            </span>

            {/* Execution ID */}
            <div className="inline-flex items-center gap-1 font-mono text-xs text-cyan-400/90 font-semibold bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
              <span>{execution.id}</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-zinc-500 hover:text-cyan-300 transition-colors p-0.5"
                title="Copy Execution ID"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Status Badge */}
            <ExecutionStatusBadge status={execution.status} size="sm" />
          </div>

          {/* Right Header: Relative timestamp and Quick Peek */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 self-end sm:self-center">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(execution.startTime)}</span>
            </div>

            {/* Quick Peek Drawer Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickPeek(execution);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Quick inspect execution drawer"
            >
              <Eye className="h-3 w-3" />
              <span className="hidden md:inline">Quick Peek</span>
            </button>
          </div>
        </div>

        {/* Trigger Prompt */}
        <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2 max-w-4xl">
          {execution.triggerPrompt}
        </p>

        {/* AI-Compressed Execution Visualization (Micro Regions) */}
        <div className="pt-2 border-t border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 shrink-0">
              AI Regions:
            </span>
            <ExecutionMicroFlow regions={execution.regions} />
          </div>

          {/* Key execution telemetry metrics */}
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0">
            <div>
              <span className="text-zinc-200 font-semibold">{execution.totalSteps}</span>
              <span className="text-[10px] text-zinc-500 ml-1">steps</span>
            </div>

            <div className="pl-3 border-l border-white/[0.06]">
              <span className="text-zinc-200 font-semibold">{formatDuration(execution.durationMs)}</span>
            </div>

            <div className="hidden sm:block pl-3 border-l border-white/[0.06]">
              <span className="text-zinc-200 font-semibold">{formatNumber(execution.tokenUsage.total)}</span>
              <span className="text-[10px] text-zinc-500 ml-1">tok</span>
            </div>

            <div className="hidden lg:block pl-3 border-l border-white/[0.06]">
              <span className="text-zinc-300">{formatCurrency(execution.costUsd)}</span>
            </div>
          </div>
        </div>

        {/* Execution Intelligence Preview Banner */}
        <div
          className={`mt-2 p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono ${
            isFailed
              ? "border-red-500/25 bg-red-500/[0.05]"
              : "border-emerald-500/20 bg-emerald-500/[0.03]"
          }`}
        >
          {/* Intelligence summary info */}
          <div className="flex flex-wrap items-center gap-3">
            {isFailed ? (
              <>
                <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>FAILED</span>
                </div>

                <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08] text-zinc-300">
                  <span className="text-zinc-500 text-[11px]">Likely issue:</span>
                  <span className="font-semibold text-red-300">
                    {execution.failureCategory || "Validation"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08] text-zinc-300">
                  <span className="text-zinc-500 text-[11px]">Step:</span>
                  <span className="font-semibold text-zinc-200">
                    {execution.suspiciousStep || 73}
                  </span>
                </div>

                {execution.anomalyConfidence && (
                  <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08] text-zinc-300">
                    <span className="text-zinc-500 text-[11px]">Confidence:</span>
                    <span className="font-bold text-red-400">
                      {execution.anomalyConfidence}%
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>SUCCESS</span>
                </div>

                <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08] text-zinc-400">
                  <span>No anomaly detected</span>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {isFailed ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickPeek(execution);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-mono font-medium transition-colors"
              >
                <SearchAlert className="h-3 w-3" />
                <span>Investigate</span>
              </button>
            ) : (
              <Link
                href={`/dashboard/executions/${execution.id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              >
                <span>View Execution</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
