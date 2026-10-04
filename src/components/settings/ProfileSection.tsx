"use client";

import * as React from "react";
import { UserSettings } from "@/types";
import {
  Mail,
  Edit2,
  Check,
  CheckCircle2,
} from "lucide-react";

interface ProfileSectionProps {
  user: UserSettings;
  onSaveUser: (updatedUser: UserSettings) => void;
}

export function ProfileSection({ user, onSaveUser }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [role, setRole] = React.useState(user.role);
  const [saveFeedback, setSaveFeedback] = React.useState(false);

  // Derive initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      role: role.trim() || user.role,
    });
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
              ACCOUNT SETTINGS
            </span>
            {saveFeedback && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-medium animate-in fade-in duration-150">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Profile updated</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">Profile</h2>
          <p className="mt-0.5 text-xs text-zinc-400 font-sans">
            Manage your personal Black Box account details.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:border-white/20 transition-colors self-start sm:self-center font-sans"
          >
            <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-6 font-sans">
        {!isEditing ? (
          <div className="space-y-6">
            {/* Avatar & Identity Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Initials Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#141822] text-xl font-bold text-white shadow-xs font-sans">
                {initials}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-sans">{user.name}</h3>
                  <span className="rounded-md bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-zinc-300 font-sans">
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-sans">
                  <Mail className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Readonly Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/[0.05] text-xs">
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5">
                <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                  Full Name
                </span>
                <span className="text-zinc-100 font-medium font-sans">{user.name}</span>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5">
                <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                  Email Address
                </span>
                <span className="text-zinc-100 font-medium font-sans">{user.email}</span>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5">
                <span className="text-[10px] text-zinc-400 uppercase font-medium block mb-1 font-sans">
                  Workspace Role
                </span>
                <span className="text-zinc-100 font-medium font-sans">{user.role}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Editable Form */
          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div className="flex items-center gap-4 pb-2 border-b border-white/[0.05]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#141822] text-lg font-bold text-white font-sans">
                {initials}
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-100 block font-sans">
                  Editing Profile Information
                </span>
                <span className="text-[11px] text-zinc-400 font-sans">
                  Update your display name, notification email, and primary role.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1 font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-hidden font-sans"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-hidden font-sans"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1 font-sans">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-hidden font-sans"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.05]">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] transition-colors font-sans"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors font-sans"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Role Privileges & Workspace Permissions Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4 font-sans flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold font-sans">
                ROLE PRIVILEGES & ACCESS
              </span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Active Tier
              </span>
            </div>
            <div className="space-y-2.5">
              {[
                { title: "Trace Ingest & Telemetry Recording", desc: "Live SDK streaming & vector snapshots" },
                { title: "Automated Failure Diagnosis", desc: "Root-cause divergence analysis & step attribution" },
                { title: "Counterfactual Execution Replay", desc: "Branching run execution & comparison matrix" },
                { title: "Zero-Trust API Key Management", desc: "Generate & rotate ingest tokens" },
              ].map((perm, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#090a0f] border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-100 block font-sans">
                      {perm.title}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-sans block">
                      {perm.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
            <span>Access level governed by Workspace Administrator</span>
            <span className="text-zinc-300 font-mono">CHAM-CHAM</span>
          </div>
        </div>

        {/* Telemetry & Activity Summary Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4 font-sans flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold font-sans">
                ACCOUNT ACTIVITY TELEMETRY
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Last 30 Days</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-lg border border-white/[0.05] bg-[#090a0f]">
                <span className="text-[10px] text-zinc-400 uppercase font-medium block">
                  Traces Captured
                </span>
                <span className="text-lg font-bold text-white font-sans mt-0.5 block">
                  342 runs
                </span>
                <span className="text-[10px] text-emerald-400">83.9% Nominal</span>
              </div>

              <div className="p-3 rounded-lg border border-white/[0.05] bg-[#090a0f]">
                <span className="text-[10px] text-zinc-400 uppercase font-medium block">
                  Diagnoses Isolated
                </span>
                <span className="text-lg font-bold text-white font-sans mt-0.5 block">
                  50 events
                </span>
                <span className="text-[10px] text-zinc-400">Heuristic Engine</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.04]">
                <span className="text-zinc-400">Primary Auth Method</span>
                <span className="text-zinc-200 font-medium">SSO (GitHub Enterprise)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.04]">
                <span className="text-zinc-400">Two-Factor Authentication</span>
                <span className="text-emerald-400 font-medium">Enabled (FIDO2)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.04]">
                <span className="text-zinc-400">Session Idle Timeout</span>
                <span className="text-zinc-200 font-medium">12 Hours</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
            <span>Identity synced with Flight Recorder IAM</span>
            <span className="text-emerald-400 font-medium">Active & Valid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
