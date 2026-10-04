"use client";

import * as React from "react";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Check,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsPopover() {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useWorkspace();

  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  if (!isNotificationsOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-14 w-80 sm:w-96 rounded-xl border border-white/10 bg-[#0c1017] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#090d14]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            Flight Alerts & Events
          </h4>
          {unreadNotificationCount > 0 && (
            <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 text-[10px] font-mono">
              {unreadNotificationCount} new
            </span>
          )}
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] font-mono text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
        {notifications.map((n) => {
          const iconConfig = {
            critical: {
              icon: AlertTriangle,
              color: "text-red-400 bg-red-500/10 border-red-500/30",
            },
            warning: {
              icon: AlertTriangle,
              color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
            },
            success: {
              icon: CheckCircle2,
              color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
            },
            info: {
              icon: Info,
              color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
            },
          }[n.type];

          const Icon = iconConfig.icon;

          return (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3.5 flex items-start gap-3 transition-colors ${
                n.read ? "bg-transparent opacity-70" : "bg-white/[0.02]"
              } hover:bg-white/[0.04]`}
            >
              <div className={`p-1.5 rounded border shrink-0 mt-0.5 ${iconConfig.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200">{n.title}</span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {n.message}
                </p>
                {n.link && (
                  <Link
                    href={n.link}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 mt-1"
                  >
                    <span>Inspect event</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2 border-t border-white/[0.06] bg-[#090d14] text-center">
        <Link
          href="/dashboard/executions"
          onClick={() => setIsNotificationsOpen(false)}
          className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200"
        >
          View all captured flight events →
        </Link>
      </div>
    </div>
  );
}
