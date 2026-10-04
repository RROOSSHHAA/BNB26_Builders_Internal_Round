"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg" | "xl" | "2xl";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = "xl",
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[width];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "relative w-full max-w-full h-full bg-[#0c1017] border-l border-white/[0.08] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200",
          widthStyles
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.06] bg-[#090d14]">
          <div className="flex flex-col gap-1 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-zinc-100">{title}</h3>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-zinc-400 font-mono truncate">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-white/[0.06] bg-[#080b11]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
