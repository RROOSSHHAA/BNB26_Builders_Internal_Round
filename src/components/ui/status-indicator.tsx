import * as React from "react";
import { cn } from "@/lib/utils";

export type SystemStatusType =
  | "healthy"
  | "warning"
  | "critical"
  | "running"
  | "idle"
  | "diverged";

interface StatusIndicatorProps {
  status: SystemStatusType;
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  pulse = true,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const dotColor = {
    healthy: "bg-emerald-400",
    warning: "bg-amber-400",
    critical: "bg-red-400",
    running: "bg-cyan-400",
    idle: "bg-zinc-400",
    diverged: "bg-rose-500",
  }[status];

  const pingColor = {
    healthy: "bg-emerald-400/40",
    warning: "bg-amber-400/40",
    critical: "bg-red-400/40",
    running: "bg-cyan-400/40",
    idle: "bg-zinc-400/20",
    diverged: "bg-rose-500/40",
  }[status];

  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={cn("absolute animate-ping rounded-full opacity-75", dotSize, pingColor)}
          />
        )}
        <span className={cn("relative rounded-full", dotSize, dotColor)} />
      </span>
      {label && (
        <span className="text-xs font-mono tracking-wide text-zinc-300 capitalize">
          {label}
        </span>
      )}
    </div>
  );
}
