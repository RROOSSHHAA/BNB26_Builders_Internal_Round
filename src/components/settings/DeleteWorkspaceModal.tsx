"use client";

import * as React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  workspaceName: string;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function DeleteWorkspaceModal({
  isOpen,
  workspaceName,
  onClose,
  onConfirmDelete,
}: DeleteWorkspaceModalProps) {
  const [confirmInput, setConfirmInput] = React.useState("");

  const prevIsOpenRef = React.useRef(isOpen);
  if (isOpen && !prevIsOpenRef.current) {
    prevIsOpenRef.current = true;
    setConfirmInput("");
  } else if (!isOpen && prevIsOpenRef.current) {
    prevIsOpenRef.current = false;
  }

  if (!isOpen) return null;

  const isConfirmed = confirmInput.trim() === workspaceName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/25 bg-[#0e121b] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4 text-xs font-sans">
          <div className="flex items-center gap-3 border-b border-rose-500/15 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 shrink-0">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-medium text-rose-400 block tracking-wider">
                DESTRUCTIVE ACTION
              </span>
              <h3 className="text-sm font-semibold text-zinc-100">
                Delete workspace?
              </h3>
            </div>
          </div>

          <p className="text-zinc-300 font-sans leading-relaxed text-xs">
            This action will permanently remove the workspace{" "}
            <span className="text-white font-mono font-medium">
              {workspaceName}
            </span>{" "}
            and its associated data, including all agent flight records, execution timelines, and diagnostic checkpoints.
          </p>

          <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 text-[11px] text-rose-300 font-sans">
            Please type <strong className="font-mono text-white">{workspaceName}</strong> below to confirm.
          </div>

          <div>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={workspaceName}
              className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500/40 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isConfirmed}
              onClick={onConfirmDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/20 px-4 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
