"use client";

import * as React from "react";
import { TraceStep } from "@/types";
import { ChevronDown, ChevronRight, Terminal, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RawTraceViewerProps {
  steps?: TraceStep[];
  suspiciousStepNumber?: number;
}

export function RawTraceViewer({
  steps,
  suspiciousStepNumber = 73,
}: RawTraceViewerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [expandedStepId, setExpandedStepId] = React.useState<string | null>(null);

  // Default mock subset around suspicious region if steps not supplied
  const fallbackSteps: TraceStep[] = [
    {
      id: "stp_062",
      stepNumber: 62,
      timestamp: "2026-10-03T18:42:15.860Z",
      type: "tool_input",
      title: "Call External Consensus API",
      status: "warn",
      latencyMs: 820,
      tokens: { prompt: 5400, completion: 180, total: 5580 },
    },
    {
      id: "stp_068",
      stepNumber: 68,
      timestamp: "2026-10-03T18:42:16.920Z",
      type: "tool_output",
      title: "API Schema Validation Rejection & HTTP 422",
      status: "error",
      latencyMs: 140,
    },
    {
      id: "stp_071",
      stepNumber: 71,
      timestamp: "2026-10-03T18:42:17.150Z",
      type: "thought",
      title: "Hallucinatory Recovery Loop Initiated",
      status: "diverged",
      latencyMs: 820,
    },
    {
      id: "stp_072",
      stepNumber: 72,
      timestamp: "2026-10-03T18:42:17.480Z",
      type: "thought",
      title: "Reasoning Step: Margin Reconcile",
      status: "ok",
      latencyMs: 240,
    },
    {
      id: "stp_073",
      stepNumber: 73,
      timestamp: "2026-10-03T18:42:17.840Z",
      type: "validation",
      title: "Response Validation (91% Failure Likelihood)",
      status: "error",
      latencyMs: 420,
    },
    {
      id: "stp_074",
      stepNumber: 74,
      timestamp: "2026-10-03T18:42:18.260Z",
      type: "synthesis",
      title: "Finalization Preparation (Downstream Affected)",
      status: "warn",
      latencyMs: 310,
    },
    {
      id: "stp_078",
      stepNumber: 78,
      timestamp: "2026-10-03T18:42:18.520Z",
      type: "error",
      title: "Consensus Numbers Ingested to Output Buffer",
      status: "error",
      latencyMs: 90,
    },
  ];

  const traceSubset = steps && steps.length > 0 ? steps.slice(0, 10) : fallbackSteps;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#090d14] overflow-hidden">
      {/* Header bar with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/[0.04]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
              RAW EXECUTION TRACE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-500">
              Diagnostic Subset
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Secondary localized trace steps around suspicious region (collapsed by default).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-mono text-xs border-white/10 text-zinc-300 hover:bg-white/[0.05] self-start sm:self-auto shrink-0"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
              <span>Collapse Trace</span>
            </>
          ) : (
            <>
              <ChevronRight className="h-3.5 w-3.5 mr-1.5" />
              <span>Expand Raw Trace ({traceSubset.length} steps)</span>
            </>
          )}
        </Button>
      </div>

      {/* Expanded Table of Trace Steps */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <div className="min-w-[540px] divide-y divide-white/[0.04] bg-[#070a0f]">
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-white/[0.02]">
              <div className="col-span-2">Step</div>
              <div className="col-span-6">Operation / Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Latency</div>
            </div>

          {traceSubset.map((step) => {
            const isSuspicious = step.stepNumber === suspiciousStepNumber;
            const isRowExpanded = expandedStepId === step.id;

            return (
              <div
                key={step.id}
                className={`transition-colors ${
                  isSuspicious
                    ? "bg-red-500/[0.07] hover:bg-red-500/[0.12]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div
                  onClick={() =>
                    setExpandedStepId(isRowExpanded ? null : step.id)
                  }
                  className="grid grid-cols-12 px-4 py-2.5 text-xs font-mono items-center cursor-pointer select-none"
                >
                  <div className="col-span-2 flex items-center gap-1.5">
                    <span
                      className={`font-bold ${
                        isSuspicious ? "text-red-400" : "text-zinc-400"
                      }`}
                    >
                      #{step.stepNumber}
                    </span>
                    {isSuspicious && (
                      <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                    )}
                  </div>

                  <div className="col-span-6 flex items-center gap-2 truncate pr-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded border border-white/[0.06] bg-white/[0.02] text-zinc-400 shrink-0">
                      {step.type}
                    </span>
                    <span
                      className={`truncate ${
                        isSuspicious ? "text-red-200 font-semibold" : "text-zinc-200"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        step.status === "error" || step.status === "diverged"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : step.status === "warn"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <div className="col-span-2 text-right text-zinc-400 text-xs">
                    {step.latencyMs}ms
                  </div>
                </div>

                {isRowExpanded && (
                  <div className="px-4 py-3 bg-black/40 border-t border-white/[0.04] text-xs font-mono text-zinc-400 space-y-1">
                    <div>
                      <span className="text-zinc-400 uppercase text-[10px]">Timestamp: </span>
                      <span className="text-zinc-200">{step.timestamp}</span>
                    </div>
                    {step.errorDetails && (
                      <div className="text-red-400">
                        <span className="text-zinc-400 uppercase text-[10px]">Error: </span>
                        <span>
                          [{step.errorDetails.code}] {step.errorDetails.message}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
