import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  variant?: "telemetry-scan" | "skeleton-card" | "table-rows";
  className?: string;
}

export function LoadingState({
  label = "Scanning execution telemetry...",
  variant = "telemetry-scan",
  className,
}: LoadingStateProps) {
  if (variant === "telemetry-scan") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-12 text-center",
          className
        )}
      >
        <div className="relative flex items-center justify-center mb-4">
          <div className="h-10 w-10 rounded-full border border-cyan-500/20 animate-ping" />
          <div className="absolute h-6 w-6 rounded-full border border-cyan-400/40 border-t-cyan-400 animate-spin" />
          <div className="absolute h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
        </div>
        <p className="text-xs font-mono tracking-wider text-cyan-400 uppercase">
          {label}
        </p>
        <span className="mt-1 text-[11px] font-mono text-zinc-500">
          Decrypting black box telemetry blocks...
        </span>
      </div>
    );
  }

  if (variant === "skeleton-card") {
    return (
      <div className={cn("rounded-lg border border-white/[0.06] bg-[#0c1017] p-5 space-y-3", className)}>
        <div className="h-4 w-1/3 bg-white/[0.04] rounded animate-pulse" />
        <div className="h-8 w-1/2 bg-white/[0.06] rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-white/[0.03] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-12 w-full rounded border border-white/[0.04] bg-[#0b0f16] animate-pulse flex items-center px-4 gap-4"
        >
          <div className="h-4 w-4 rounded-full bg-white/[0.08]" />
          <div className="h-3 w-48 bg-white/[0.06] rounded" />
          <div className="ml-auto h-3 w-16 bg-white/[0.06] rounded" />
        </div>
      ))}
    </div>
  );
}
