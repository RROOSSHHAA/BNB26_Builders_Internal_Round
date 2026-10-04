import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  confidence: number; // 0 to 1
  label?: string;
  showDemoBadge?: boolean;
  className?: string;
}

export function ConfidenceIndicator({
  confidence,
  label = "Diagnostic Confidence",
  showDemoBadge = true,
  className,
}: ConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100);

  const getColor = () => {
    if (confidence >= 0.9) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (confidence >= 0.7) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-mono",
        getColor(),
        className
      )}
    >
      <Sparkles className="h-3 w-3 shrink-0" />
      <span className="text-zinc-400 text-[11px]">{label}:</span>
      <span className="font-bold">{percentage}%</span>

      {showDemoBadge && (
        <Tooltip content="Diagnostic prediction generated using frontend demonstration heuristic model">
          <span className="ml-1 cursor-help rounded bg-white/[0.08] px-1 py-0.2 text-[9px] uppercase tracking-wider text-zinc-400 flex items-center gap-0.5">
            Demo
            <HelpCircle className="h-2.5 w-2.5" />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
