import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "cyan";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none rounded-md";

    const variantStyles = {
      primary:
        "bg-white text-zinc-950 hover:bg-zinc-200 border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
      secondary:
        "bg-[#121620] text-zinc-200 hover:bg-[#181e2b] border border-white/10 hover:border-white/15",
      outline:
        "border border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.04] hover:text-white",
      ghost:
        "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]",
      destructive:
        "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/25",
      cyan:
        "bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/30",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-3.5 text-xs font-medium gap-2",
      lg: "h-10 px-5 text-sm font-medium gap-2.5",
      icon: "h-8 w-8 p-0 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
