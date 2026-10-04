"use client";

import * as React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceIndicator } from "@/components/execution/confidence-indicator";
import { ExecutionRegion, TraceStep } from "@/types";
import { formatDuration } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Sliders,
  ShieldAlert,
} from "lucide-react";

interface InvestigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  region: ExecutionRegion | null;
  targetStepNumber?: number;
}

export function InvestigationDrawer({
  isOpen,
  onClose,
  region,
  targetStepNumber = 73,
}: InvestigationDrawerProps) {
  if (!region) return null;

  const isStep73 = targetStepNumber === 73 || region.isAnomaly;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isStep73 ? "Investigation: Step 73 (Validation)" : `Region: ${region.name}`}
      subtitle={`Execution #EX-2048 • Steps ${region.startStep}–${region.endStep} (${region.stepCount} steps)`}
      badge={
        region.isAnomaly ? (
          <Badge variant="amber" size="sm">
            SUSPICIOUS REGION
          </Badge>
        ) : (
          <Badge variant="emerald" size="sm">
            {region.status.toUpperCase()}
          </Badge>
        )
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-mono text-zinc-500">
            Region Latency: {formatDuration(region.metrics.latencyMs)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-mono"
            >
              Close
            </Button>
            <Link href="/dashboard/executions/EX-2048">
              <Button
                variant="cyan"
                size="sm"
                className="text-xs font-mono gap-1.5"
              >
                <span>Full Trace Detail</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Step 73 Anomaly Card */}
        {isStep73 ? (
          <div className="rounded-xl border border-amber-500/30 bg-[#12100d] p-5 space-y-4 shadow-[0_0_25px_rgba(245,158,11,0.06)]">
            <div className="flex items-start justify-between gap-3 border-b border-amber-500/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono">
                    Step 73 — Validation Failure
                  </span>
                  <Badge variant="amber" size="sm">
                    ANOMALY FOCUS
                  </Badge>
                </div>
                <span className="text-xs font-mono text-zinc-400 mt-0.5 block">
                  Category: Tool Validation & Consistency Check
                </span>
              </div>

              <div className="text-right">
                <span className="text-base font-bold font-mono text-amber-300 block">
                  91%
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Failure Likelihood
                </span>
              </div>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold block">
                Evidence Identified:
              </span>
              <div className="space-y-2 text-xs font-mono text-zinc-300">
                <div className="p-2.5 rounded bg-black/60 border border-white/[0.04] flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">#1</span>
                  <span>Unusual output pattern: Output deviates by +1.8% from expected baseline distribution.</span>
                </div>
                <div className="p-2.5 rounded bg-black/60 border border-white/[0.04] flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">#2</span>
                  <span>Deviation from successful executions: Consensus margin 18.2% was pulled from 2023 pre-cutoff weights instead of 16.4% live feed.</span>
                </div>
                <div className="p-2.5 rounded bg-black/60 border border-white/[0.04] flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">#3</span>
                  <span>Downstream failure correlation: Synthesis in Finalization (Steps 79–127) directly inherited corrupt consensus data.</span>
                </div>
              </div>
            </div>

            {/* Demonstration Notice */}
            <div className="rounded border border-white/[0.06] bg-[#07090e] p-3 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Model: Heuristic Divergence Classifier</span>
              <span className="text-cyan-400/90 font-semibold">Demo ML Data</span>
            </div>

            {/* Action Trigger Button */}
            <Link href="/dashboard/executions/EX-2048">
              <Button
                variant="cyan"
                size="sm"
                className="w-full text-xs font-mono tracking-wider gap-2 py-2.5"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>INVESTIGATE STEP IN TRACE DRILL-DOWN</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 space-y-3">
            <h4 className="text-sm font-semibold text-zinc-100">
              Region Summary
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {region.summary}
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-400 flex items-center gap-3">
              <span>Status: {region.status}</span>
              <span>•</span>
              <span>Confidence: {Math.round(region.confidence * 100)}%</span>
            </div>
          </div>
        )}

        {/* Region Steps Snippet */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Region Trace Steps Sample ({region.steps?.length || 0} loaded)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Steps {region.startStep}–{region.endStep}
            </span>
          </div>

          <div className="space-y-2.5">
            {region.steps && region.steps.length > 0 ? (
              region.steps.map((st) => (
                <div
                  key={st.id}
                  className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 ${
                    st.stepNumber === 73 || st.status === "error"
                      ? "border-amber-500/40 bg-amber-950/20 text-amber-200"
                      : "border-white/[0.04] bg-[#090d14] text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">
                      Step #{st.stepNumber} — {st.title}
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      {st.latencyMs}ms
                    </span>
                  </div>
                  {st.errorDetails && (
                    <div className="text-[11px] text-red-300/90 font-sans">
                      {st.errorDetails.message}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 rounded border border-dashed border-white/10 text-center text-xs font-mono text-zinc-500">
                Detailed trace step records for this region are compressed into the flight recorder index.
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
