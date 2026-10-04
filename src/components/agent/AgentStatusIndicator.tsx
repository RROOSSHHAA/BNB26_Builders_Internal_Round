"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/types";
import { AlertTriangle } from "lucide-react";

interface AgentStatusIndicatorProps {
  status: AgentStatus;
  className?: string;
}

export function AgentStatusIndicator({
  status,
  className,
}: AgentStatusIndicatorProps) {
  if (status === "needs_attention" || status === "error") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-sans text-amber-400 select-none",
          className
        )}
      >
        <span className="flex h-2 w-2 items-center justify-center">
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
        </span>
        <span className="font-medium text-[11px]">
          Needs Attention
        </span>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-sans text-zinc-500 select-none",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
        <span className="font-medium text-[11px]">
          Idle
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-sans text-emerald-400 select-none",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span className="font-medium text-[11px]">
        Active
      </span>
    </div>
  );
}
