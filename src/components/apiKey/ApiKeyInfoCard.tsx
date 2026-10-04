"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, KeyRound, ExternalLink, Cpu, Database, Sparkles, Lock } from "lucide-react";

export function ApiKeyInfoCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] tracking-wider uppercase text-zinc-400 font-medium block">
              WORKSPACE CREDENTIALS
            </span>
            <h3 className="text-sm font-semibold text-zinc-100 font-sans">
              Black Box Flight Recorder Ingestion Keys
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>API access: Secure by design</span>
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-3xl">
        Black Box API keys let external applications send execution data, traces, and agent activity to your workspace.
      </p>

      {/* Simple Architecture Flow */}
      <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5">
        <span className="text-[10px] text-zinc-500 uppercase font-medium block mb-2 tracking-wider">
          Telemetry Ingestion Flow
        </span>
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="rounded-md border border-white/[0.08] bg-[#141822] px-3 py-1.5 text-zinc-200 flex items-center gap-2 font-medium">
            <Cpu className="h-3.5 w-3.5 text-zinc-400" />
            <span>Your Application</span>
          </div>

          <ArrowRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />

          <div className="rounded-md border border-white/[0.12] bg-[#141822] px-3 py-1.5 text-zinc-100 font-medium flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-zinc-300" />
            <span>Black Box API</span>
          </div>

          <ArrowRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />

          <div className="rounded-md border border-white/[0.08] bg-[#141822] px-3 py-1.5 text-zinc-200 flex items-center gap-2 font-medium">
            <Database className="h-3.5 w-3.5 text-zinc-400" />
            <span>Trace / Execution Data</span>
          </div>

          <ArrowRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />

          <div className="rounded-md border border-white/[0.12] bg-[#141822] px-3 py-1.5 text-zinc-100 font-medium flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            <span>Black Box Intelligence</span>
          </div>
        </div>
      </div>

      {/* Distinct Notice about Provider Keys */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-[#090d14] px-3.5 py-2 text-[11px] text-zinc-300">
        <span className="text-zinc-400 font-sans">
          <strong className="text-zinc-200 font-semibold">Important:</strong> Provider credentials (OpenAI, Anthropic, Google Gemini) are managed separately under Integrations.
        </span>

        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors shrink-0 font-medium font-sans"
        >
          <span>Go to Integrations</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
