"use client";

import * as React from "react";
import { WorkspaceSettings } from "@/types";
import {
  Layers,
  Copy,
  Check,
  Users,
  Shield,
  Settings,
  Info,
} from "lucide-react";

interface WorkspaceSectionProps {
  workspace: WorkspaceSettings;
  onOpenManage: () => void;
}

export function WorkspaceSection({
  workspace,
  onOpenManage,
}: WorkspaceSectionProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(workspace.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
            WORKSPACE SCOPE
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">Workspace</h2>
          <p className="mt-0.5 text-xs text-zinc-400 font-sans">
            Manage the workspace used by your AI agents and executions.
          </p>
        </div>

        <button
          onClick={onOpenManage}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:border-white/20 transition-colors self-start sm:self-center font-sans"
        >
          <Settings className="h-3.5 w-3.5 text-zinc-400" />
          <span>Manage Workspace</span>
        </button>
      </div>

      {/* Workspace Card */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-6 space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-sans">{workspace.name}</h3>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 font-sans">
                  {workspace.plan} Plan
                </span>
              </div>
              <span className="text-xs text-zinc-400 font-sans block mt-0.5">
                Primary active workspace for agent flight recording
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Identifier Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-300 block font-sans">
            Workspace Identifier
          </label>
          <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#090a0f] p-3 text-xs">
            <span className="font-mono text-zinc-200 select-all tracking-wider text-xs">
              {workspace.id}
            </span>
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-white/[0.08] transition-colors font-sans"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-medium">Copy ID</span>
                </>
              )}
            </button>
          </div>
          <span className="text-[11px] text-zinc-400 block font-sans">
            Use this identifier when initializing the Black Box Flight Recorder SDK tracer.
          </span>
        </div>

        {/* Member Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                Assigned Seats
              </span>
              <span className="text-white font-bold text-sm font-sans">
                {workspace.memberCount} members
              </span>
            </div>
            <Users className="h-5 w-5 text-zinc-500" />
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                Data Retention
              </span>
              <span className="text-zinc-100 font-bold text-sm font-sans">
                90 Days Active
              </span>
            </div>
            <Shield className="h-5 w-5 text-zinc-400" />
          </div>
        </div>

        {/* Future Note */}
        <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-[#090a0f] p-3 text-[11px] text-zinc-400 font-sans leading-relaxed">
          <Info className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
          <span>
            Workspace settings are connected to your organization tier. Team member invitations, SSO policies, and domain verification can be configured via Enterprise Admin.
          </span>
        </div>
      </div>

      {/* Workspace Ingestion Telemetry & Collector Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold font-sans">
              INGESTION COLLECTORS & REGIONS
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Nominal (Online)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.04]">
              <div>
                <span className="text-zinc-200 font-semibold block">US-East Primary Collector</span>
                <span className="text-[10px] text-zinc-400 font-mono">grpc://us-east.telemetry.blackbox.ai:443</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">1.8ms</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.04]">
              <div>
                <span className="text-zinc-200 font-semibold block">EU-Central Secondary Collector</span>
                <span className="text-[10px] text-zinc-400 font-mono">grpc://eu-central.telemetry.blackbox.ai:443</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">2.4ms</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold font-sans">
              SDK QUICK CONFIGURATION
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">v1.2.0</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.04] font-mono text-xs text-zinc-300 space-y-1">
            <p className="text-zinc-500 text-[10px]"># Python Agent Flight Recorder Hook</p>
            <p className="text-emerald-400">import <span className="text-white">blackbox</span></p>
            <p className="text-zinc-300">blackbox.<span className="text-zinc-100">init</span>(workspace_id=<span className="text-amber-300">&quot;{workspace.id}&quot;</span>)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
