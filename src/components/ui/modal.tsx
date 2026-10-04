"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl shadow-black text-zinc-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150",
          maxWidthStyles
        )}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="pr-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-100">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-zinc-400 font-sans">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 max-h-[80vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.06] bg-[#090c13] px-4 sm:px-6 py-3 sm:py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
