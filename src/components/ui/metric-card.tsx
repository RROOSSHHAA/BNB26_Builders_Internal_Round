import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean; // true = good, false = bad/anomaly
  };
  accentColor?: "cyan" | "amber" | "emerald" | "crimson" | "default";
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  accentColor = "default",
  className,
}: MetricCardProps) {
  const accentBorder = {
    default: "border-white/[0.08] hover:border-white/[0.14]",
    cyan: "border-white/[0.08] hover:border-white/[0.14]",
    amber: "border-amber-500/20 hover:border-amber-500/35",
    emerald: "border-white/[0.08] hover:border-white/[0.14]",
    crimson: "border-rose-500/25 hover:border-rose-500/40",
  }[accentColor];

  const iconColor = {
    default: "text-zinc-400 bg-white/[0.04]",
    cyan: "text-zinc-300 bg-white/[0.05]",
    amber: "text-amber-400 bg-amber-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    crimson: "text-rose-400 bg-rose-500/10",
  }[accentColor];

  return (
    <div
      className={cn(
        "rounded-xl border bg-[#0e121b] p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between h-full",
        accentBorder,
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium font-sans text-zinc-400">
            {title}
          </span>
          {Icon && (
            <div className={cn("p-1.5 rounded-md", iconColor)}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-sans tracking-tight text-white">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "text-xs font-sans font-medium",
                trend.positive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <p className="mt-3 text-xs text-zinc-400 font-sans border-t border-white/[0.05] pt-2.5 leading-snug">
          {subtext}
        </p>
      )}
    </div>
  );
}
