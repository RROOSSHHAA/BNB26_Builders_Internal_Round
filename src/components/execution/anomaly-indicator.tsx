import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertOctagon, Flame } from "lucide-react";

interface AnomalyIndicatorProps {
  score: number; // 0 to 1
  label?: string;
  divergenceStep?: number;
  className?: string;
}

export function AnomalyIndicator({
  score,
  label,
  divergenceStep,
  className,
}: AnomalyIndicatorProps) {
  const percentage = Math.round(score * 100);

  const getSeverity = () => {
    if (score >= 0.8) return { level: "Critical", color: "text-red-400", border: "border-red-500/40", bg: "bg-red-500/10" };
    if (score >= 0.5) return { level: "High", color: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-500/10" };
    if (score >= 0.2) return { level: "Moderate", color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" };
    return { level: "Nominal", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" };
  };

  const severity = getSeverity();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs",
        severity.border,
        severity.bg,
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <AlertOctagon className={cn("h-3.5 w-3.5", severity.color)} />
        <span className="text-zinc-400 uppercase text-[10px] tracking-wider">
          {label || "Anomaly Score"}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className={cn("font-bold", severity.color)}>{percentage}%</span>
        <span className="text-[10px] text-zinc-500">({severity.level})</span>
      </div>

      {divergenceStep && (
        <span className="ml-1 pl-2 border-l border-white/10 text-[10px] text-cyan-400">
          Fork @ Step {divergenceStep}
        </span>
      )}
    </div>
  );
}
