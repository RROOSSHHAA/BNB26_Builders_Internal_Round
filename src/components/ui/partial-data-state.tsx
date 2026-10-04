"use client";

import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RetryButton } from "./retry-button";

export interface PartialDataStateProps {
  label?: string;
  missingDataName: string;
  impactDescription?: string;
  onRetry?: () => void | Promise<void>;
  className?: string;
}

export function PartialDataState({
  label = "Partial Telemetry Available",
  missingDataName,
  impactDescription = "Execution stream and trace blocks are healthy, but this diagnostic block was omitted or delayed.",
  onRetry,
  className,
}: PartialDataStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#0c1017]/80 p-4 font-mono text-xs backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3",
        className
      )}
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-1.5 rounded-md bg-white/[0.05] text-zinc-400 border border-white/10 shrink-0">
          <HelpCircle className="h-4 w-4 text-cyan-400/70" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-200">{missingDataName} unavailable</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400 uppercase tracking-wider">
              {label}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed font-sans sm:font-mono">
            {impactDescription}
          </p>
        </div>
      </div>

      {onRetry && (
        <div className="self-end sm:self-center shrink-0">
          <RetryButton
            onRetry={onRetry}
            idleLabel="Fetch Block"
            size="sm"
            className="text-[11px] h-7 px-2.5"
          />
        </div>
      )}
    </div>
  );
}
