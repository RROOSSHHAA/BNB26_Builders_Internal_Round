"use client";

import * as React from "react";
import { ApiKey } from "@/types";
import { X, RotateCcw, AlertTriangle, Check, Copy } from "lucide-react";

interface RotateKeyModalProps {
  isOpen: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
  onConfirmRotate: (key: ApiKey, newMockSecret: string, newMaskedPreview: string) => void;
}

export function RotateKeyModal({
  isOpen,
  apiKey,
  onClose,
  onConfirmRotate,
}: RotateKeyModalProps) {
  const [rotated, setRotated] = React.useState(false);
  const [newMockKey, setNewMockKey] = React.useState("");
  const [newPreview, setNewPreview] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const prevIsOpenRef = React.useRef(isOpen);
  if (isOpen && !prevIsOpenRef.current) {
    prevIsOpenRef.current = true;
    setRotated(false);
    setNewMockKey("");
    setNewPreview("");
    setCopied(false);
  } else if (!isOpen && prevIsOpenRef.current) {
    prevIsOpenRef.current = false;
  }

  if (!isOpen || !apiKey) return null;

  const handleRotate = () => {
    const envPrefix =
      apiKey.environment === "production"
        ? "bbx_live"
        : apiKey.environment === "development"
        ? "bbx_dev"
        : "bbx_test";

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const mockSecret = `${envPrefix}_mock_${Math.random()
      .toString(36)
      .substring(2, 14)}${randomSuffix}`;
    const masked = `${envPrefix}_••••••••••••${randomSuffix}`;

    setNewMockKey(mockSecret);
    setNewPreview(masked);
    setRotated(true);
    onConfirmRotate(apiKey, mockSecret, masked);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newMockKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-mono">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-[#0c1017] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4 text-xs">
          {!rotated ? (
            <>
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shrink-0">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                    CREDENTIAL LIFECYCLE
                  </span>
                  <h3 className="text-sm font-bold text-zinc-100">
                    Rotate API key?
                  </h3>
                </div>
              </div>

              <p className="text-zinc-300 font-sans leading-relaxed text-xs">
                Rotating <span className="text-white font-mono font-bold">{apiKey.name}</span> will generate a fresh credential token while invalidating the current key (<span className="font-mono text-zinc-400">{apiKey.keyPreview}</span>).
              </p>

              <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-[11px] text-amber-300/90 font-sans">
                Applications using the current key will experience authentication failure until updated with the new credential.
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
                  onClick={handleRotate}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 hover:border-amber-500/60 transition-all shadow-md shadow-amber-500/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Rotate Key</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                    ROTATION COMPLETE
                  </span>
                  <h3 className="text-sm font-bold text-zinc-100">
                    New Key Generated
                  </h3>
                </div>
              </div>

              <p className="text-zinc-300 font-sans text-xs">
                Copy your rotated key now. It will only be shown in full once.
              </p>

              <div className="flex items-center justify-between rounded-lg border border-cyan-500/30 bg-[#080c13] p-3">
                <span className="font-mono text-xs text-cyan-300 break-all select-all font-semibold">
                  {newMockKey}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded border border-white/[0.1] bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-zinc-200 hover:bg-white/[0.1] transition-colors shrink-0 ml-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-md shadow-cyan-500/10"
                >
                  <span>Done</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
