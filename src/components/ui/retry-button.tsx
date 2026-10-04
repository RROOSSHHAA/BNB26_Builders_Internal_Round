"use client";

import * as React from "react";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface RetryButtonProps extends Omit<ButtonProps, "onClick"> {
  onRetry: () => void | Promise<void>;
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
}

export function RetryButton({
  onRetry,
  idleLabel = "Try Again",
  loadingLabel = "Retrying...",
  successLabel = "Restored",
  errorLabel = "Retry Failed",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: RetryButtonProps) {
  const [retryState, setRetryState] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const handleClick = async () => {
    if (retryState === "loading") return;
    setRetryState("loading");
    try {
      await onRetry();
      setRetryState("success");
      setTimeout(() => setRetryState("idle"), 2000);
    } catch {
      setRetryState("error");
      setTimeout(() => setRetryState("idle"), 2500);
    }
  };

  return (
    <Button
      variant={retryState === "error" ? "destructive" : variant}
      size={size}
      disabled={retryState === "loading"}
      onClick={handleClick}
      className={cn("font-mono text-xs transition-all duration-200", className)}
      {...props}
    >
      {retryState === "loading" && (
        <>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin text-cyan-400" />
          <span>{loadingLabel}</span>
        </>
      )}

      {retryState === "success" && (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
          <span className="text-emerald-300">{successLabel}</span>
        </>
      )}

      {retryState === "error" && (
        <>
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-red-400" />
          <span>{errorLabel}</span>
        </>
      )}

      {retryState === "idle" && (
        <>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
          <span>{idleLabel}</span>
        </>
      )}
    </Button>
  );
}
