import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "neutral"
    | "cyan"
    | "amber"
    | "crimson"
    | "emerald"
    | "violet";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white/[0.06] text-zinc-300 border-white/[0.08]",
    secondary: "bg-[#141822] text-zinc-300 border-white/[0.08]",
    neutral: "bg-[#141822] text-zinc-300 border-white/[0.08]",
    outline: "bg-transparent text-zinc-400 border-white/10",
    cyan: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    crimson: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    violet: "bg-white/[0.06] text-zinc-300 border-white/10",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-sans font-medium tracking-normal",
    md: "px-2.5 py-0.5 text-xs font-sans font-medium tracking-normal",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-medium transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
