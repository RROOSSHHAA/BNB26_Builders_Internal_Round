"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Code2, Terminal } from "lucide-react";

interface RawDifferenceItem {
  category: string;
  field: string;
  leftValue: string;
  rightValue: string;
}

interface DetailedDiffAccordionProps {
  differences?: RawDifferenceItem[];
}

export function DetailedDiffAccordion({ differences }: DetailedDiffAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!differences || differences.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c1017]/85 backdrop-blur-xs font-mono text-xs overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            View Detailed Differences
          </span>
          <span className="rounded bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] text-zinc-400">
            {differences.length} parameters
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
          <span>{isOpen ? "Collapse" : "Expand"}</span>
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#080c13]/90">
          <p className="text-[11px] text-zinc-400">
            Secondary comparison parameters and state vectors across both execution runs:
          </p>

          <div className="rounded-lg border border-white/[0.07] bg-[#05080f] divide-y divide-white/[0.05] overflow-x-auto">
            <div className="grid grid-cols-12 px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 bg-white/[0.02]">
              <span className="col-span-3">Field / Attribute</span>
              <span className="col-span-4 text-red-400">Left Run</span>
              <span className="col-span-5 text-emerald-400">Right Run</span>
            </div>

            {differences.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 px-3 py-2.5 text-xs font-mono items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-3 text-zinc-300 font-medium truncate pr-2">
                  <span className="text-[10px] text-zinc-400 block uppercase">
                    {item.category}
                  </span>
                  <span>{item.field}</span>
                </div>
                <div className="col-span-4 text-red-300 font-mono text-[11px] truncate pr-2">
                  {item.leftValue}
                </div>
                <div className="col-span-5 text-emerald-300 font-mono text-[11px] truncate">
                  {item.rightValue}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
