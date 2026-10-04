"use client";

import * as React from "react";
import { ApiKey } from "@/types";
import { X, Ban, AlertTriangle } from "lucide-react";

interface RevokeKeyModalProps {
  isOpen: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
  onConfirmRevoke: (key: ApiKey) => void;
}

export function RevokeKeyModal({
  isOpen,
  apiKey,
  onClose,
  onConfirmRevoke,
}: RevokeKeyModalProps) {
  if (!isOpen || !apiKey) return null;

  const handleRevoke = () => {
    onConfirmRevoke(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-mono">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0c1017] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center gap-3 border-b border-red-500/20 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 shrink-0">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-red-400 block tracking-wider">
                DECOMMISSION CREDENTIAL
              </span>
              <h3 className="text-sm font-bold text-zinc-100">
                Revoke API key?
              </h3>
            </div>
          </div>

          <p className="text-zinc-300 font-sans leading-relaxed text-xs">
            Applications using this key (<span className="text-white font-mono font-bold">{apiKey.name}</span>, <span className="font-mono text-zinc-400">{apiKey.keyPreview}</span>) will no longer be able to authenticate with Black Box.
          </p>

          <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-[11px] text-red-300/90 font-sans">
            This action immediately invalidates all ingestion tokens and trace streams associated with this credential.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRevoke}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30 hover:border-red-500/60 transition-all shadow-md shadow-red-500/10"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Revoke Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
