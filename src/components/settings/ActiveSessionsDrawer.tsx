"use client";

import * as React from "react";
import { ActiveSession } from "@/types";
import { X, Laptop, ShieldCheck, Clock, CheckCircle2, LogOut } from "lucide-react";

interface ActiveSessionsDrawerProps {
  isOpen: boolean;
  sessions: ActiveSession[];
  onClose: () => void;
  onRevokeSession: (sessionId: string) => void;
}

export function ActiveSessionsDrawer({
  isOpen,
  sessions,
  onClose,
  onRevokeSession,
}: ActiveSessionsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md rounded-l-2xl border-l border-white/[0.1] bg-[#0e121b] shadow-2xl shadow-black/80 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#0e121b]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
                <Laptop className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                  SECURITY SESSIONS
                </span>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Active Sessions ({sessions.length})
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Sessions List */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              These devices and browsers currently hold active authentication tokens for your Black Box workspace.
            </p>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="rounded-xl border border-white/[0.08] bg-[#090a0f] p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <Laptop className="h-4 w-4 text-zinc-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-200">
                            {sess.device}
                          </span>
                          {sess.isCurrent && (
                            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.2 text-[9px] font-medium text-emerald-300">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 block font-sans">
                          {sess.browser}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-[#141822] p-2.5 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>IP Address:</span>
                      <span className="font-mono text-zinc-300">{sess.ipAddress}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Location:</span>
                      <span className="text-zinc-300">{sess.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" />
                        <span>{sess.lastActive}</span>
                      </span>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onRevokeSession(sess.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors font-medium"
                      >
                        <LogOut className="h-3 w-3" />
                        <span>Revoke Session</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-white/[0.08] px-6 py-4 bg-[#0e121b]">
            <button
              onClick={onClose}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
