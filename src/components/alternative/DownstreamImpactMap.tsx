"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, GitCommit, ArrowDown } from "lucide-react";
import { AlternativeImpactNode } from "@/types";

interface DownstreamImpactMapProps {
  divergenceStep: number;
  impactNodes: AlternativeImpactNode[];
}

export function DownstreamImpactMap({
  divergenceStep,
  impactNodes,
}: DownstreamImpactMapProps) {
  const getStatusIcon = (status: "recovered" | "partial" | "failed") => {
    switch (status) {
      case "recovered":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "partial":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "failed":
        return <XCircle className="h-3.5 w-3.5 text-red-400" />;
    }
  };

  const getStatusBadge = (status: "recovered" | "partial" | "failed") => {
    switch (status) {
      case "recovered":
        return "text-emerald-300 bg-emerald-500/10 border-emerald-500/25";
      case "partial":
        return "text-amber-300 bg-amber-500/10 border-amber-500/25";
      case "failed":
        return "text-red-300 bg-red-500/10 border-red-500/25";
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0c1017]/85 p-4 backdrop-blur-xs font-mono">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Downstream Impact Map
        </span>
        <span className="text-[10px] text-zinc-400">
          Divergence: Step {divergenceStep}
        </span>
      </div>

      <div className="relative pl-3 pt-1">
        {/* Root Node: The Changed Decision */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-5 w-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <GitCommit className="h-3 w-3" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-zinc-100">Step {divergenceStep}</span>
            <span className="text-cyan-300 ml-2 text-[11px] font-medium bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
              Hypothetical Change Injected
            </span>
          </div>
        </div>

        {/* Tree Line Connector */}
        <div className="relative pl-4 ml-2.5 border-l border-white/[0.12] space-y-3 pb-1">
          {impactNodes.map((node, idx) => (
            <div key={idx} className="relative flex items-start gap-2.5 group">
              {/* Branch Elbow */}
              <div className="absolute -left-4 top-2.5 w-3.5 h-[1px] bg-white/[0.12]" />

              <div className="flex items-center gap-1.5 mt-0.5 shrink-0">
                {getStatusIcon(node.status)}
              </div>

              <div className="flex-1 rounded-md border border-white/[0.05] bg-[#080c13] p-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-zinc-200">
                    {node.regionName} Region
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] uppercase font-bold border ${getStatusBadge(
                      node.status
                    )}`}
                  >
                    {node.status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-400 font-mono">
                  {node.statusText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
