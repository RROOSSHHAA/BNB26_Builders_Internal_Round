import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon, RadioTower, ArrowRight } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = RadioTower,
  title,
  description,
  primaryAction,
  secondaryAction,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-white/10 bg-[#080c14]/70 font-mono transition-all duration-200",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#0f1522] text-zinc-400 mb-4 shadow-inner ring-1 ring-white/[0.04]">
        <Icon className="h-6 w-6 stroke-[1.5] text-cyan-400/80" />
      </div>

      <h3 className="text-sm font-semibold text-zinc-100 tracking-wide">{title}</h3>
      <p className="mt-1.5 max-w-md text-xs text-zinc-400 leading-relaxed font-sans sm:font-mono">
        {description}
      </p>

      {/* Structured Primary and Secondary Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {primaryAction &&
            (primaryAction.href ? (
              <Link href={primaryAction.href}>
                <Button size="sm" variant="cyan" className="gap-1.5">
                  {primaryAction.icon && <primaryAction.icon className="h-3.5 w-3.5" />}
                  <span>{primaryAction.label}</span>
                  <ArrowRight className="h-3 w-3 opacity-70" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="cyan" onClick={primaryAction.onClick} className="gap-1.5">
                {primaryAction.icon && <primaryAction.icon className="h-3.5 w-3.5" />}
                <span>{primaryAction.label}</span>
                <ArrowRight className="h-3 w-3 opacity-70" />
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  {secondaryAction.icon && <secondaryAction.icon className="h-3.5 w-3.5" />}
                  <span>{secondaryAction.label}</span>
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" onClick={secondaryAction.onClick} className="gap-1.5">
                {secondaryAction.icon && <secondaryAction.icon className="h-3.5 w-3.5" />}
                <span>{secondaryAction.label}</span>
              </Button>
            ))}
        </div>
      )}

      {/* Custom legacy action render if provided */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
