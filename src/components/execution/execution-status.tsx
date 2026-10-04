import * as React from "react";
import { ExecutionStatus } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

interface ExecutionStatusBadgeProps {
  status: ExecutionStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function ExecutionStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className,
}: ExecutionStatusBadgeProps) {
  const config = {
    success: {
      label: "Success",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      icon: CheckCircle2,
    },
    anomaly: {
      label: "Anomaly Detected",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      icon: AlertTriangle,
    },
    failed: {
      label: "Execution Failed",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-400",
      icon: XCircle,
    },
    running: {
      label: "Telemetry Live",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      icon: RefreshCw,
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] font-mono gap-1.5"
      : "px-2.5 py-1 text-xs font-mono gap-2";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-medium select-none",
        config.border,
        config.bg,
        config.text,
        sizeClasses,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
            status === "running" && "animate-spin"
          )}
        />
      )}
      <span>{config.label}</span>
    </div>
  );
}
