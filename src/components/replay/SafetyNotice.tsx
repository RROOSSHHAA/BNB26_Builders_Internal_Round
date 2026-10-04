"use client";

import * as React from "react";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

interface SafetyNoticeProps {
  currentStage?: "created" | "running" | "applied" | "verification" | "completed";
  sourceExecutionId?: string;
}

export function SafetyNotice({ currentStage = "completed", sourceExecutionId = "EX-2048" }: SafetyNoticeProps) {
  const stages = [
    { id: "created", label: "Sandbox Created" },
    { id: "running", label: "Replay Running" },
    { id: "applied", label: "Correction Applied" },
    { id: "verification", label: "Verification" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c1017] p-3.5 space-y-3 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-zinc-100 block text-xs">
              Secure Isolated Replay Sandbox
            </span>
            <p className="text-[11px] text-zinc-400">
              Ephemeral container isolation. Original execution (<span className="text-zinc-200 font-mono font-medium">{sourceExecutionId}</span>) remains <strong className="text-emerald-300 font-medium">immutable & unchanged</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.06]">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-mono text-zinc-300">Production Protected</span>
        </div>
      </div>

      {/* 5-State Sandbox Progression Pipeline */}
      <div className="pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 mr-1 shrink-0">Lifecycle:</span>
          {stages.map((st, idx) => (
            <React.Fragment key={st.id}>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>{st.label}</span>
              </div>
              {idx < stages.length - 1 && (
                <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
