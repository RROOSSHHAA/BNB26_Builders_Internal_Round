"use client";

import * as React from "react";
import { ShieldCheck, Info } from "lucide-react";

export function SafetyNotice() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#0e121b] px-4 py-2.5 text-xs font-sans text-zinc-400">
      <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
        <ShieldCheck className="h-3 w-3" />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <span>
          <strong className="text-zinc-200 font-medium">Isolated Execution:</strong>{" "}
          Replay runs are isolated from production side effects and downstream API mutations.
        </span>
        <span className="text-[11px] text-zinc-500 shrink-0">
          State Cache · Zero Ingress Impact
        </span>
      </div>
    </div>
  );
}
