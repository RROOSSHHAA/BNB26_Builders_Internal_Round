"use client";

import * as React from "react";
import { ApiKey } from "@/types";
import {
  X,
  KeyRound,
  Copy,
  Check,
  RotateCcw,
  Ban,
  Clock,
  Shield,
  Activity,
  BarChart3,
  Server,
  Info,
} from "lucide-react";

interface ApiKeyDetailDrawerProps {
  isOpen: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
  onRotateKey: (key: ApiKey) => void;
  onRevokeKey: (key: ApiKey) => void;
}

export function ApiKeyDetailDrawer({
  isOpen,
  apiKey,
  onClose,
  onRotateKey,
  onRevokeKey,
}: ApiKeyDetailDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !apiKey) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.keyPreview || apiKey.prefix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEnvBadge = (env: string) => {
    switch (env.toLowerCase()) {
      case "production":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
      case "staging":
      case "testing":
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
      case "development":
      default:
        return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md rounded-l-2xl border-l border-white/[0.1] bg-[#0c1017] shadow-2xl shadow-black/80 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#080c13]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block">
                  KEY INSPECTOR
                </span>
                <h3 className="text-sm font-bold text-zinc-100 truncate max-w-[240px]">
                  {apiKey.name}
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

          {/* Drawer Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            {/* Status & Environment Pill Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                    apiKey.status === "active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      apiKey.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  <span className="capitalize">{apiKey.status}</span>
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold border ${getEnvBadge(
                    apiKey.environment
                  )}`}
                >
                  {apiKey.environment}
                </span>
              </div>

              <span className="text-[10px] text-zinc-500">ID: {apiKey.id}</span>
            </div>

            {/* Masked Key Preview Box */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Key Preview
              </label>
              <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#080c13] p-3">
                <span className="font-mono text-xs text-zinc-200 tracking-wider">
                  {apiKey.keyPreview || apiKey.prefix}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
                  title="Copy preview"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3.5 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Created Date:</span>
                <span className="text-zinc-300 font-medium">
                  {apiKey.createdAtText || "Oct 01, 2026"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Last Telemetry Active:</span>
                <span className="text-zinc-300 font-medium">
                  {apiKey.lastUsedText || "Never"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                <span className="text-zinc-500">Credential Type:</span>
                <span className="text-cyan-400 font-semibold text-[10px]">
                  Workspace Ingestion Token
                </span>
              </div>
            </div>

            {/* Permissions & Scopes */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Authorized Permissions
              </label>
              <div className="space-y-1.5">
                {(apiKey.scopes || apiKey.permissions || []).map((scope, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-[#080c13] px-3 py-2 text-zinc-300"
                  >
                    <Shield className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold text-[11px] text-zinc-200">{scope}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Section (Explicitly Mock / Preview Data) */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <label className="text-[10px] uppercase font-bold text-zinc-300">
                    Telemetry Usage
                  </label>
                </div>
                <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 uppercase">
                  Preview data
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 font-sans">
                Usage data will appear here once API activity is connected.
              </p>

              {apiKey.usagePreview && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-2.5 text-center">
                    <span className="text-[9px] text-zinc-500 uppercase block">24h Volume</span>
                    <span className="text-xs font-bold text-zinc-200 block mt-0.5">
                      {apiKey.usagePreview.requests24h.toLocaleString()}
                    </span>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-2.5 text-center">
                    <span className="text-[9px] text-zinc-500 uppercase block">Error Rate</span>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                      {apiKey.usagePreview.errorRate}
                    </span>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-2.5 text-center">
                    <span className="text-[9px] text-zinc-500 uppercase block">Avg Latency</span>
                    <span className="text-xs font-bold text-cyan-400 block mt-0.5">
                      {apiKey.usagePreview.avgLatencyMs}ms
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-4 bg-[#080c13]">
            {apiKey.status === "active" ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRotateKey(apiKey);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Rotate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRevokeKey(apiKey);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-all"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Revoke</span>
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-zinc-500">
                Key is revoked and cannot be modified.
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
