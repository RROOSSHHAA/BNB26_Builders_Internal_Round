"use client";

import { AlertTriangle } from "lucide-react";
import { RetryButton } from "./retry-button";
import { cn } from "@/lib/utils";

export interface InlineErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  className?: string;
}

export function InlineError({
  title = "Component Data Unavailable",
  message = "This section failed to load telemetry blocks. Other sections remain functional.",
  onRetry,
  retryLabel = "Retry Section",
  className,
}: InlineErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-[#140e08]/90 p-4 font-mono text-xs backdrop-blur-xs",
        className
      )}
    >
      <div className="flex items-start sm:items-center gap-2.5">
        <div className="p-1.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <span className="font-semibold text-amber-200 block text-xs">{title}</span>
          <span className="text-[11px] text-zinc-400 font-sans sm:font-mono">{message}</span>
        </div>
      </div>

      {onRetry && (
        <div className="self-end sm:self-center shrink-0">
          <RetryButton
            onRetry={onRetry}
            idleLabel={retryLabel}
            size="sm"
            className="border-amber-500/30 hover:bg-amber-500/10 text-amber-300 text-[11px] h-7 px-2.5"
          />
        </div>
      )}
    </div>
  );
}
