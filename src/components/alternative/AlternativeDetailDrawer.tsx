"use client";

import * as React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import {
  GitFork,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Play,
  Clock,
  Layers,
} from "lucide-react";
import { AlternativeInvestigation } from "@/types";
import { BranchingPathVisualizer } from "./BranchingPathVisualizer";
import { ChangeSummaryCard } from "./ChangeSummaryCard";
import { DownstreamImpactMap } from "./DownstreamImpactMap";

interface AlternativeDetailDrawerProps {
  investigation: AlternativeInvestigation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlternativeDetailDrawer({
  investigation,
  isOpen,
  onClose,
}: AlternativeDetailDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!investigation) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(investigation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${investigation.agentName} — Alternative Investigation`}
      subtitle={`Investigation ID: ${investigation.id} · Original Run: ${investigation.originalExecutionId}`}
      width="2xl"
      badge={
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="rounded px-2 py-0.5 text-[10px] border border-red-500/30 bg-red-500/10 text-red-300">
            {investigation.originalOutcome}
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-500" />
          <span className="rounded px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
            {investigation.alternativeOutcome}
          </span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full font-mono text-xs">
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied ID</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/executions/${investigation.originalExecutionId}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-zinc-300 hover:border-white/20 hover:text-zinc-100 transition-all"
            >
              <span>View Execution</span>
              <Terminal className="h-3 w-3" />
            </Link>

            <Link
              href="/dashboard/replays"
              className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 font-medium text-purple-300 hover:bg-purple-500/25 hover:border-purple-500/60 transition-all"
            >
              <span>Fork Replay</span>
              <Play className="h-3 w-3" />
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm font-mono">
        {/* Branching Path Comparison */}
        <BranchingPathVisualizer
          originalPath={investigation.originalPath}
          alternativePath={investigation.alternativePath}
          divergenceStep={investigation.divergenceStep}
          divergenceRegion={investigation.divergenceRegion}
          originalOutcome={investigation.originalOutcome}
          alternativeOutcome={investigation.alternativeOutcome}
        />

        {/* Change Summary & Downstream Effect */}
        <ChangeSummaryCard
          whatChanged={investigation.whatChanged}
          downstreamEffect={investigation.downstreamEffect}
          finalOutcomeText={investigation.finalOutcomeText}
          alternativeStatus={investigation.alternativeStatus}
          statusExplanation={investigation.statusExplanation}
        />

        {/* Downstream Impact Map */}
        <DownstreamImpactMap
          divergenceStep={investigation.divergenceStep}
          impactNodes={investigation.impactNodes}
        />

        {/* Payload Mutation Diff */}
        {(investigation.originalDecision.payloadSnippet ||
          investigation.alternativeDecision.payloadSnippet) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Decision Payload Mutation (Step {investigation.divergenceStep})
              </span>
              <span className="text-[10px] text-zinc-400">
                Type: {investigation.alternativeDecision.type}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-red-400 text-[10px]">ORIGINAL DECISION</span>
                <pre className="rounded-lg border border-red-500/20 bg-[#05080f] p-3 text-[11px] text-red-200/90 max-h-40 overflow-auto scrollbar-thin">
                  {investigation.originalDecision.payloadSnippet}
                </pre>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-emerald-400 text-[10px]">ALTERNATIVE PROPOSED</span>
                <pre className="rounded-lg border border-emerald-500/20 bg-[#05080f] p-3 text-[11px] text-emerald-200/90 max-h-40 overflow-auto scrollbar-thin">
                  {investigation.alternativeDecision.payloadSnippet}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
