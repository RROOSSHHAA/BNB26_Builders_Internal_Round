"use client";

import * as React from "react";
import Link from "next/link";
import { Play, ArrowRight, RotateCcw } from "lucide-react";

interface ReplayEmptyStateProps {
  onReset?: () => void;
}

export function ReplayEmptyState({ onReset }: ReplayEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#0c1017]/60 p-12 text-center backdrop-blur-xs">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-zinc-400 mb-4 shadow-inner">
        <Play className="h-6 w-6 text-zinc-300" />
      </div>

      <h3 className="text-base font-semibold text-zinc-100 font-mono tracking-tight">
        No replay investigations yet.
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-zinc-400 font-mono leading-relaxed">
        Choose a checkpoint from a failed execution to explore an alternative path without rerunning unaffected execution.
      </p>

      <div className="flex items-center gap-3 mt-6">
        <Link
          href="/dashboard/executions"
          className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-mono font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all shadow-xs"
        >
          <span>View Failed Executions</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.04] px-3.5 py-2 text-xs font-mono text-zinc-300 hover:bg-white/[0.08] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo State</span>
          </button>
        )}
      </div>
    </div>
  );
}
