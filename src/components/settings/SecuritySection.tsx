"use client";

import * as React from "react";
import Link from "next/link";
import { ActiveSession, SecurityEvent } from "@/types";
import {
  Laptop,
  History,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Trash2,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface SecuritySectionProps {
  sessions: ActiveSession[];
  securityEvents: SecurityEvent[];
  onOpenSessions: () => void;
  onOpenDeleteWorkspace: () => void;
  onSignOutAll: () => void;
}

export function SecuritySection({
  sessions,
  securityEvents,
  onOpenSessions,
  onOpenDeleteWorkspace,
  onSignOutAll,
}: SecuritySectionProps) {
  const [authManagedNotice, setAuthManagedNotice] = React.useState(false);

  const handleManageAuth = () => {
    setAuthManagedNotice(true);
    setTimeout(() => setAuthManagedNotice(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block mb-1 font-sans">
          ACCESS & GOVERNANCE
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white font-sans">Security</h2>
        <p className="mt-0.5 text-xs text-zinc-400 font-sans">
          Manage account and workspace security preferences.
        </p>
      </div>

      <div className="space-y-4 font-sans">
        {/* CARD 1: Authentication */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider font-sans">
                  Authentication
                </h3>
                <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                  Single sign-on and credential provider status
                </span>
              </div>
            </div>

            <button
              onClick={handleManageAuth}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:border-white/20 transition-colors self-start sm:self-center font-sans"
            >
              <span>Manage Authentication</span>
            </button>
          </div>

          {authManagedNotice && (
            <div className="rounded-lg border border-white/[0.1] bg-[#141822] p-2.5 text-[11px] text-zinc-300 font-sans animate-in fade-in duration-150">
              Mock notice: External SSO and multi-factor authorization providers are configured in backend deployments.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-white/[0.04]">
            <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3">
              <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                Authentication Provider
              </span>
              <span className="text-zinc-200 font-medium font-sans">Demo account</span>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3">
              <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                Security Posture
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium font-sans">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Configured</span>
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Active Sessions */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider font-sans">
                  Active Sessions
                </h3>
                <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                  {sessions.length} active session{sessions.length === 1 ? "" : "s"} currently authenticated
                </span>
              </div>
            </div>

            <button
              onClick={onOpenSessions}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:border-white/20 transition-colors self-start sm:self-center font-sans"
            >
              <span>View Sessions</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-white/[0.04]">
            <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3">
              <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                Current Device
              </span>
              <span className="text-zinc-200 font-medium font-sans">Current browser</span>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3">
              <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                Location
              </span>
              <span className="text-zinc-200 font-medium font-sans">Current session</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Security Activity */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider font-sans">
                  Security Activity
                </h3>
                <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                  Recent sign-in, key operations, and privilege changes
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/history"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:border-white/20 transition-colors self-start sm:self-center font-sans"
            >
              <span>View Security Activity</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2 pt-1 border-t border-white/[0.04] text-xs font-sans">
            {securityEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-[#090a0f] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <span className="text-zinc-200 font-sans">{event.action}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-sans">{event.timestampAgo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Danger Zone */}
        <div className="rounded-xl border border-rose-500/25 bg-rose-950/[0.04] p-5 space-y-4 font-sans">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-semibold text-rose-300 uppercase tracking-wider font-sans">
              Danger Zone
            </h3>
          </div>

          <div className="divide-y divide-rose-500/10 text-xs font-sans">
            {/* Sign out all */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
              <div>
                <span className="font-semibold text-zinc-200 block font-sans">
                  Sign out of all sessions
                </span>
                <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                  Terminates all active browser tabs and tokens across all devices.
                </span>
              </div>

              <button
                type="button"
                onClick={onSignOutAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors shrink-0 self-start sm:self-center font-sans"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out All</span>
              </button>
            </div>

            {/* Delete workspace */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
              <div>
                <span className="font-semibold text-zinc-200 block font-sans">
                  Delete workspace
                </span>
                <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                  Permanently remove the workspace, active agents, and recorded traces.
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenDeleteWorkspace}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/20 px-3.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/30 transition-colors shrink-0 self-start sm:self-center font-sans"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Workspace</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
