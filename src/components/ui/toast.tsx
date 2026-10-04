"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    info: <Info className="h-4 w-4 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-[#08120d]/95 text-emerald-100",
    error: "border-red-500/30 bg-[#14080a]/95 text-red-100",
    warning: "border-amber-500/30 bg-[#140e08]/95 text-amber-100",
    info: "border-cyan-500/30 bg-[#081119]/95 text-cyan-100",
  };

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md font-mono text-xs transition-all duration-200 animate-in fade-in slide-in-from-bottom-2",
        borders[toast.type]
      )}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-zinc-100 tracking-wide">{toast.title}</div>
        {toast.description && (
          <div className="mt-0.5 text-[11px] text-zinc-400 leading-relaxed break-words">
            {toast.description}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        className="rounded p-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
