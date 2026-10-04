"use client";

import * as React from "react";
import { useDemoState } from "@/context/DemoStateContext";
import { DemoStateMode } from "@/types/state";
import { SlidersHorizontal, Check, RefreshCw, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeveloperStateSwitcher() {
  const { mode, setMode, isRetrying } = useDemoState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) {
    return (
      <button
        type="button"
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-3 left-3 z-40 rounded-full border border-white/10 bg-[#0b0f17]/90 p-2 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/30 shadow-lg backdrop-blur-md transition-all font-mono text-[10px]"
        title="Show State Switcher"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
      </button>
    );
  }

  const modes: { id: DemoStateMode; label: string; desc: string; dot: string }[] = [
    {
      id: "populated",
      label: "Populated (Default)",
      desc: "Realistic demo traces & metrics",
      dot: "bg-emerald-400",
    },
    {
      id: "loading",
      label: "Loading (Skeletons)",
      desc: "Structure-aware skeleton views",
      dot: "bg-cyan-400 animate-pulse",
    },
    {
      id: "empty",
      label: "Empty (Zero-State)",
      desc: "First-run onboarding & CTAs",
      dot: "bg-zinc-400",
    },
    {
      id: "error",
      label: "Error & Recovery",
      desc: "Controlled failures with retries",
      dot: "bg-red-400",
    },
    {
      id: "partial",
      label: "Partial Data",
      desc: "Healthy traces + degraded blocks",
      dot: "bg-amber-400",
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40 font-mono text-xs select-none">
      {isOpen ? (
        <div className="w-64 rounded-xl border border-white/15 bg-[#090d15]/95 p-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-semibold text-zinc-200 text-[11px] uppercase tracking-wider">
                Demo State Switcher
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-zinc-500 hover:text-zinc-300"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsDismissed(true);
                }}
                className="rounded p-1 text-zinc-500 hover:text-zinc-300"
                title="Hide bar"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                  mode === m.id
                    ? "bg-white/[0.08] border border-white/15 text-zinc-100"
                    : "hover:bg-white/[0.04] text-zinc-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", m.dot)} />
                  <div>
                    <div className="font-semibold text-[11px]">{m.label}</div>
                    <div className="text-[10px] text-zinc-500">{m.desc}</div>
                  </div>
                </div>
                {mode === m.id && <Check className="h-3.5 w-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 flex items-center justify-between">
            <span>Tests all 16 page states</span>
            <span className="text-cyan-400/80">Step 17</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-[#090d15]/90 px-3 py-1.5 text-zinc-300 hover:text-white hover:border-cyan-500/40 shadow-xl backdrop-blur-md transition-all group"
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              modes.find((m) => m.id === mode)?.dot || "bg-emerald-400"
            )}
          />
          <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white">
            State: <span className="text-cyan-300 capitalize">{mode}</span>
          </span>
          {isRetrying ? (
            <RefreshCw className="h-3 w-3 animate-spin text-cyan-400 ml-0.5" />
          ) : (
            <ChevronUp className="h-3 w-3 text-zinc-500 ml-0.5" />
          )}
        </button>
      )}
    </div>
  );
}
