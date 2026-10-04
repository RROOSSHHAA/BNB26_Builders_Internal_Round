"use client";

import * as React from "react";
import Link from "next/link";
import { Execution } from "@/types";
import { ExecutionStatusBadge } from "../execution-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  Terminal,
  Cpu,
  Server,
  Clock,
  Sparkles,
  GitFork,
  SearchAlert,
  Play,
  Copy,
  Check,
} from "lucide-react";

interface ExecutionDetailHeaderProps {
  execution: Execution;
  onInvestigateClick: () => void;
  onReplayClick: () => void;
  onCompareClick: () => void;
}

export function ExecutionDetailHeader({
  execution,
  onInvestigateClick,
  onReplayClick,
  onCompareClick,
}: ExecutionDetailHeaderProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(execution.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 border-b border-white/[0.06] pb-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/executions"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Executions</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="font-mono text-zinc-400">
            RECORDED RUN
          </Badge>
          <Badge variant="cyan" size="sm" className="font-mono">
            AI-COMPRESSED
          </Badge>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              EXECUTION
            </span>
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-400">
              {execution.framework} Run
            </span>
          </div>

          {/* Heading with Agent Name & Execution ID */}
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {execution.agentName}
            </h1>

            {/* Execution ID Badge with copy */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-950/30 text-xs font-mono font-semibold text-cyan-300">
              <span>{execution.id}</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-zinc-500 hover:text-cyan-300 transition-colors p-0.5"
                title="Copy ID"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Status Badge */}
            <ExecutionStatusBadge status={execution.status} size="md" />
          </div>

          {/* Compact Metadata Strip */}
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="font-bold text-white">{execution.totalSteps}</span>
              <span>steps</span>
            </div>

            <span className="text-zinc-600">•</span>

            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="font-bold text-white">
                {formatDuration(execution.durationMs)}
              </span>
              <span>duration</span>
            </div>

            <span className="text-zinc-600">•</span>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              <span>Started {formatRelativeTime(execution.startTime)}</span>
            </div>

            <span className="hidden sm:inline text-zinc-600">•</span>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              <Cpu className="h-3.5 w-3.5 text-zinc-500" />
              <span>Model: Demo Reasoning Model</span>
            </div>

            <span className="hidden sm:inline text-zinc-600">•</span>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              <Server className="h-3.5 w-3.5 text-zinc-500" />
              <span>Environment: Development</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onInvestigateClick}
            className="font-mono text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <SearchAlert className="h-3.5 w-3.5 mr-1.5" />
            <span>Investigate</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReplayClick}
            className="font-mono text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            <span>Replay</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onCompareClick}
            className="font-mono text-xs border-white/10 text-zinc-300 hover:bg-white/[0.06]"
          >
            <GitFork className="h-3.5 w-3.5 mr-1.5" />
            <span>Compare</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
