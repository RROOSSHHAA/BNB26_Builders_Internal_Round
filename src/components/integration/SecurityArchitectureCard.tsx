"use client";

import * as React from "react";
import { ShieldCheck, Lock, Users, Server, FileText, Info } from "lucide-react";

export function SecurityArchitectureCard() {
  const pillars = [
    {
      title: "Secret",
      label: "Masked",
      desc: "API keys are client-masked and stripped from analytical logs, traces, and visual playback.",
      icon: <Lock className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: "Access",
      label: "Workspace scoped",
      desc: "Model credentials apply only within your active workspace and are never shared across teams.",
      icon: <Users className="h-4 w-4 text-zinc-300" />,
    },
    {
      title: "Connection",
      label: "Server-side proxy",
      desc: "Production traces route through an isolated backend proxy with zero direct client-to-model exposure.",
      icon: <Server className="h-4 w-4 text-zinc-300" />,
    },
    {
      title: "Audit",
      label: "Connection activity",
      desc: "Credential rotation, model swaps, and disconnects are recorded to the immutable workspace audit trail.",
      icon: <FileText className="h-4 w-4 text-zinc-300" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Production Security Architecture
          </h3>
        </div>

        <span className="rounded bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[10px] text-zinc-400 font-sans">
          Planned Controls & Policy Specs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-white/[0.06] bg-[#090d14] p-3.5 space-y-2 flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  {pillar.title}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
                  {pillar.icon}
                  <span>{pillar.label}</span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400 font-sans">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 pt-1 text-[10px] text-zinc-500 font-sans border-t border-white/[0.04]">
        <Info className="h-3 w-3 shrink-0 mt-0.5 text-zinc-500" />
        <span>
          Note: This design reflects architectural security specifications for upcoming backend production deployments. No real credentials or tokens are currently sent over the wire in this frontend preview.
        </span>
      </div>
    </div>
  );
}
