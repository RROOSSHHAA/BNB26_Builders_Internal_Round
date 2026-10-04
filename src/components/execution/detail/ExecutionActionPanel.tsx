"use client";

import * as React from "react";
import { Execution } from "@/types";
import { SearchAlert, Play, GitFork, Sparkles, Terminal, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface ExecutionActionPanelProps {
  execution: Execution;
  onOpenStepDetail?: () => void;
}

export function ExecutionActionPanel({
  execution,
  onOpenStepDetail,
}: ExecutionActionPanelProps) {
  const [activeModal, setActiveModal] = React.useState<
    "investigate" | "replay" | "compare" | null
  >(null);

  return (
    <>
      <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
              INVESTIGATION ACTIONS
            </span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500">Flight Controls</span>
        </div>

        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          Launch automated root-cause audits, simulate sandbox replays, or diff against historical golden runs.
        </p>

        {/* Buttons Grid */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("investigate")}
            className="flex-1 font-mono text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10 justify-center"
          >
            <SearchAlert className="h-3.5 w-3.5 mr-1.5" />
            <span>Investigate Step</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("replay")}
            className="flex-1 font-mono text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 justify-center"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            <span>Replay from Step 73</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("compare")}
            className="flex-1 font-mono text-xs border-white/10 text-zinc-200 hover:bg-white/[0.06] justify-center"
          >
            <GitFork className="h-3.5 w-3.5 mr-1.5" />
            <span>Compare with Run</span>
          </Button>
        </div>
      </div>

      {/* Investigate Modal */}
      <Modal
        isOpen={activeModal === "investigate"}
        onClose={() => setActiveModal(null)}
        title="Automated Step Investigation"
        description="Inspect Step 73 statistical divergence and prompt diff analysis"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-zinc-500">
              Analysis Engine Ready
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setActiveModal(null);
                if (onOpenStepDetail) onOpenStepDetail();
              }}
            >
              Focus Step 73 Inspector
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs font-mono text-zinc-300">
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Black Box detected a 91% failure likelihood at Step 73 (Response Validation).</span>
          </div>
          <p className="font-sans text-zinc-400">
            Output deviated from nominal executions due to unexpected numerical tolerance drift.
            You can inspect the local 3-step transition window or trigger a sandbox replay with parameter corrections.
          </p>
        </div>
      </Modal>

      {/* Replay Modal */}
      <Modal
        isOpen={activeModal === "replay"}
        onClose={() => setActiveModal(null)}
        title="Replay from Step 73"
        description="Fork and simulate execution state starting at the divergence point"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-zinc-500">
              Frontend Simulation Mode
            </span>
            <Button variant="primary" size="sm" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs font-mono text-zinc-300">
          <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-200">
            Deterministic step snapshot captured for Step 73.
          </div>
          <p className="font-sans text-zinc-400">
            Replay sandbox execution will fork agent memory state at Step 73, apply suggested prompt modifications, and simulate downstream finalization.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/[0.05] text-[11px] text-zinc-500">
            ℹ Replay engine execution will be available in the upcoming Replay phase.
          </div>
        </div>
      </Modal>

      {/* Compare Modal */}
      <Modal
        isOpen={activeModal === "compare"}
        onClose={() => setActiveModal(null)}
        title="Compare with Golden Run"
        description="Side-by-side diff against nominal execution EX-2047"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-zinc-500">
              Comparison Engine
            </span>
            <Button variant="primary" size="sm" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs font-mono text-zinc-300">
          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03]">
            Comparing <strong>{execution.id}</strong> (Failed at Step 73) vs <strong>EX-2047</strong> (Nominal 84 steps).
          </div>
          <p className="font-sans text-zinc-400">
            Step diff shows 100% vector similarity until Step 62, where token entropy escalated by +42% before failing schema checks.
          </p>
        </div>
      </Modal>
    </>
  );
}
