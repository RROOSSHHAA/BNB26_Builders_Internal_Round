import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "nested" | "elevated" | "accent" }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-[#0b0e14] border-white/[0.08] hover:border-white/[0.14]",
    nested: "bg-[#0f141d] border-white/[0.06]",
    elevated: "bg-[#141a26] border-white/[0.12] shadow-xl shadow-black/40",
    accent: "bg-[#0b0e14] border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.04)]",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border transition-colors duration-200 text-zinc-100",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 pb-3 border-b border-white/[0.04]", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-semibold tracking-wide text-zinc-100 flex items-center gap-2", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-zinc-400 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0 text-xs text-zinc-400 border-t border-white/[0.04] mt-2", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
