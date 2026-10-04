"use client";

import * as React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface KeyDifferencesCardProps {
  differences: string[];
}

export function KeyDifferencesCard({ differences }: KeyDifferencesCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
        <Sparkles className="h-4 w-4 text-zinc-300" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
          Key Execution Differences
        </h4>
      </div>

      <div className="space-y-2.5 pt-1">
        {differences.map((diff, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-[#090d14] p-3 text-zinc-300"
          >
            <div className="flex h-5 w-5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300 items-center justify-center font-mono font-medium text-[10px] shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p className="text-xs leading-relaxed text-zinc-300">
              {diff}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
