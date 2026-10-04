"use client";

import * as React from "react";
import { WorkspaceSettings } from "@/types";
import { X, Layers, Users, Shield, Check, Info } from "lucide-react";

interface ManageWorkspaceModalProps {
  isOpen: boolean;
  workspace: WorkspaceSettings;
  onClose: () => void;
  onUpdate: (updated: WorkspaceSettings) => void;
}

export function ManageWorkspaceModal({
  isOpen,
  workspace,
  onClose,
  onUpdate,
}: ManageWorkspaceModalProps) {
  const [name, setName] = React.useState(workspace.name);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(workspace.name);
      setSaved(false);
    }
  }, [isOpen, workspace.name]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...workspace,
      name: name.trim() || workspace.name,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0e121b] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#0e121b]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                WORKSPACE MANAGEMENT
              </span>
              <h2 className="text-sm font-semibold text-zinc-100">
                Workspace Configuration
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="text-[11px] font-medium text-zinc-300 block mb-1.5">
              Workspace Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-hidden"
              required
            />
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#090a0f] p-3.5 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Workspace Identifier:</span>
              <span className="font-mono text-zinc-200">{workspace.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Current Plan:</span>
              <span className="text-emerald-400 font-medium">{workspace.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Active Team Seats:</span>
              <span className="text-zinc-200">{workspace.memberCount} members</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3 text-[11px] text-zinc-400 font-sans leading-relaxed">
            Team invitation links, role access delegation, and domain routing policies will be connected when backend organization endpoints are implemented.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
