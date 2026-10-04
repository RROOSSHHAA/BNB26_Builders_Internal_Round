"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import { ComparisonLocalContextStep } from "@/types";

interface LocalContextComparisonProps {
  steps: ComparisonLocalContextStep[];
  leftLabel: string;
  rightLabel: string;
}

export function LocalContextComparison({
  steps,
  leftLabel,
  rightLabel,
}: LocalContextComparisonProps) {
  const getStatusIcon = (status: "ok" | "warn" | "fail" | "affected") => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "warn":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "fail":
        return <XCircle className="h-3.5 w-3.5 text-red-400" />;
      case "affected":
        return <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />;
    }
  };

  const getStatusBadge = (status: "ok" | "warn" | "fail" | "affected") => {
    switch (status) {
      case "ok":
        return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
      case "warn":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "fail":
        return "border-red-500/30 bg-red-500/10 text-red-300";
      case "affected":
        return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-300" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Localized Step Context Comparison
          </h4>
        </div>
        <span className="text-[10px] text-zinc-400">
          Zoomed span around divergence
        </span>
      </div>

      <div className="space-y-2.5">
        {steps.map((st) => (
          <div
            key={st.step}
            className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3 space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
              <span>Step {st.step}</span>
              <span className="text-zinc-400 font-normal">{st.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left Step state */}
              <div
                className={`flex items-center justify-between rounded-md border p-2 ${getStatusBadge(
                  st.leftStatus
                )}`}
              >
                <div>
                  <div className="font-semibold text-[11px]">{leftLabel}</div>
                  {st.leftDesc && (
                    <div className="text-[10px] opacity-75 mt-0.5">
                      {st.leftDesc}
                    </div>
                  )}
                </div>
                {getStatusIcon(st.leftStatus)}
              </div>

              {/* Right Step state */}
              <div
                className={`flex items-center justify-between rounded-md border p-2 ${getStatusBadge(
                  st.rightStatus
                )}`}
              >
                <div>
                  <div className="font-semibold text-[11px]">{rightLabel}</div>
                  {st.rightDesc && (
                    <div className="text-[10px] opacity-75 mt-0.5">
                      {st.rightDesc}
                    </div>
                  )}
                </div>
                {getStatusIcon(st.rightStatus)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
