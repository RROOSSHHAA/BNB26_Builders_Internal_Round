import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  subtitle,
  badge,
  actions,
  children,
  footer,
  className,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.08] bg-[#0c1017] overflow-hidden flex flex-col",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.04] bg-[#090d14]">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 font-mono">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="p-5 flex-1">{children}</div>

      {footer && (
        <div className="px-5 py-2.5 border-t border-white/[0.04] bg-[#090d14] text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
