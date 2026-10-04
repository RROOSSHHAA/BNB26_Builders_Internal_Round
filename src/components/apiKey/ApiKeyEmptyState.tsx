"use client";

import * as React from "react";
import { KeyRound, Plus, RotateCcw } from "lucide-react";

interface ApiKeyEmptyStateProps {
  onCreateKey: () => void;
  onResetDemo?: () => void;
}

export function ApiKeyEmptyState({
  onCreateKey,
  onResetDemo,
}: ApiKeyEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#0c1017]/60 p-12 text-center backdrop-blur-xs font-mono">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-zinc-400 mb-4 shadow-inner">
        <KeyRound className="h-6 w-6 text-cyan-300" />
      </div>

      <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
        No API keys yet
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-zinc-400 leading-relaxed font-sans">
        Create a Black Box API key to connect your first application or AI agent.
      </p>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onCreateKey}
          className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/15 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-500/60 transition-all shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create API Key</span>
        </button>

        {onResetDemo && (
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.04] px-3.5 py-2 text-xs text-zinc-300 hover:bg-white/[0.08] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo State</span>
          </button>
        )}
      </div>
    </div>
  );
}
