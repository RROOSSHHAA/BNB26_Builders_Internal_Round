"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { RetryButton } from "./retry-button";

export interface ErrorStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string | Record<string, unknown>;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  secondaryAction?: ErrorStateAction;
  className?: string;
}

export function ErrorState({
  title = "Telemetry Stream Error",
  message,
  details,
  onRetry,
  retryLabel = "Try Again",
  secondaryAction,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-red-500/25 bg-[#120a0d]/90 p-5 sm:p-6 text-zinc-100 font-mono shadow-lg transition-all duration-200 backdrop-blur-xs",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg p-2.5 bg-red-500/15 text-red-400 border border-red-500/25 shrink-0 mt-0.5">
          <AlertCircle className="h-5 w-5 stroke-[1.75]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold tracking-wide text-red-200">{title}</h4>
          <p className="mt-1 text-xs text-zinc-300 leading-relaxed font-sans sm:font-mono">
            {message}
          </p>

          {/* Diagnostic expandable dump */}
          {details && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="h-3 w-3" /> Hide diagnostic payload
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" /> Inspect diagnostic dump
                  </>
                )}
              </button>

              {showDetails && (
                <pre className="mt-2.5 p-3 rounded-lg bg-[#070a0f] border border-white/[0.08] text-[11px] font-mono text-red-300/90 overflow-x-auto max-h-48 leading-relaxed">
                  {typeof details === "string"
                    ? details
                    : JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Action Row: Retry + Secondary */}
          {(onRetry || secondaryAction) && (
            <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/[0.06]">
              {onRetry && (
                <RetryButton
                  onRetry={onRetry}
                  idleLabel={retryLabel}
                  loadingLabel="Retrying..."
                  className="border-red-500/30 hover:bg-red-500/10 text-red-300"
                />
              )}

              {secondaryAction &&
                (secondaryAction.href ? (
                  <Link href={secondaryAction.href}>
                    <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-zinc-200 gap-1.5">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>{secondaryAction.label}</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={secondaryAction.onClick}
                    className="text-zinc-400 hover:text-zinc-200 gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{secondaryAction.label}</span>
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
