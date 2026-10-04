"use client";

import * as React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import {
  Play,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Terminal,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";
import { ReplayInvestigation } from "@/types";
import { CheckpointFlowIndicator } from "./CheckpointFlowIndicator";
import { OriginalVsReplayMap } from "./OriginalVsReplayMap";
import { DirectModelFixAndDownloadBox } from "./DirectModelFixAndDownloadBox";
import { SafetyNotice } from "./SafetyNotice";

interface ReplayDetailDrawerProps {
  replay: ReplayInvestigation | null;
  isOpen: boolean;
  onClose: () => void;
  onForkReplay?: (replay: ReplayInvestigation) => void;
}

export function ReplayDetailDrawer({
  replay,
  isOpen,
  onClose,
  onForkReplay,
}: ReplayDetailDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!replay) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(replay.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = replay.replayResult === "SUCCESS";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${replay.agentName} — Replay Investigation`}
      subtitle={`Replay ID: ${replay.id} · Original Execution: ${replay.originalExecutionId}`}
      width="2xl"
      badge={
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="rounded px-2 py-0.5 text-[10px] border border-red-500/30 bg-red-500/10 text-red-300">
            {replay.originalResult}
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-500" />
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
              isSuccess
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {replay.replayResult}
          </span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied ID</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Replay ID</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/executions/${replay.originalExecutionId}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-white/20 hover:text-zinc-100 transition-all"
            >
              <span>View Original Run</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <Link
              href={`/dashboard/diagnoses?execution=${replay.originalExecutionId}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all"
            >
              <span>Open Diagnosis</span>
              <Sparkles className="h-3 w-3" />
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {/* Checkpoint Flow Visualizer */}
        <CheckpointFlowIndicator
          checkpointStep={replay.checkpointStep}
          modifiedStep={replay.modifiedStep}
          totalSteps={replay.totalSteps}
          stepsReused={replay.stepsReused}
          stepsReplayed={replay.stepsReplayed}
        />

        {/* Safety Banner */}
        <SafetyNotice />

        {/* Dual Region Map */}
        <OriginalVsReplayMap
          originalRegions={replay.originalRegions}
          replayRegions={replay.replayRegions}
          whatChanged={replay.whatChanged}
          downstreamEffect={replay.downstreamEffect}
          finalResultText={replay.finalResultText}
          originalResult={replay.originalResult}
          replayResult={replay.replayResult}
        />

        {/* Direct Model Hotpatch & Verified Artifact Download Center */}
        <DirectModelFixAndDownloadBox replay={replay} />

        {/* Code / Payload Diff Comparison */}
        {(replay.originalPayloadSnippet || replay.modifiedPayloadSnippet) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-400">
                Payload Mutation at Step {replay.modifiedStep}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Type: {replay.modificationType}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-red-400 text-[10px]">ORIGINAL FAILURE</span>
                <pre className="rounded-lg border border-red-500/20 bg-[#05080f] p-3 text-[11px] font-mono text-red-200/90 max-h-40 overflow-auto scrollbar-thin">
                  {replay.originalPayloadSnippet}
                </pre>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-emerald-400 text-[10px]">REPLAY ALTERNATIVE</span>
                <pre className="rounded-lg border border-emerald-500/20 bg-[#05080f] p-3 text-[11px] font-mono text-emerald-200/90 max-h-40 overflow-auto scrollbar-thin">
                  {replay.modifiedPayloadSnippet}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
