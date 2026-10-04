"use client";

import * as React from "react";
import { ApiKey, ApiKeyEnvironment, ApiKeyScope } from "@/types";
import {
  X,
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newKey: ApiKey) => void;
}

export function CreateApiKeyModal({
  isOpen,
  onClose,
  onCreated,
}: CreateApiKeyModalProps) {
  const [step, setStep] = React.useState<"form" | "success">("form");
  const [keyName, setKeyName] = React.useState("");
  const [environment, setEnvironment] = React.useState<ApiKeyEnvironment>("production");
  const [selectedScopes, setSelectedScopes] = React.useState<ApiKeyScope[]>([
    "traces:write",
    "executions:read",
  ]);
  const [createdMockKey, setCreatedMockKey] = React.useState("");
  const [createdKeyRecord, setCreatedKeyRecord] = React.useState<ApiKey | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Reset form when modal opens
  const prevIsOpenRef = React.useRef(isOpen);
  if (isOpen && !prevIsOpenRef.current) {
    prevIsOpenRef.current = true;
    setStep("form");
    setKeyName("");
    setEnvironment("production");
    setSelectedScopes(["traces:write", "executions:read"]);
    setCopied(false);
    setCreatedMockKey("");
    setCreatedKeyRecord(null);
  } else if (!isOpen && prevIsOpenRef.current) {
    prevIsOpenRef.current = false;
  }

  if (!isOpen) return null;

  const toggleScope = (scope: ApiKeyScope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate obviously mock key
    const envPrefix =
      environment === "production"
        ? "bbx_live"
        : environment === "development"
        ? "bbx_dev"
        : "bbx_test";

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const fullMockSecret = `${envPrefix}_mock_${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 10)}${randomSuffix}`;
    const maskedPreview = `${envPrefix}_••••••••••••${randomSuffix}`;

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: keyName.trim() || "New Agent Key",
      prefix: maskedPreview,
      keyPreview: maskedPreview,
      environment,
      status: "active",
      createdAt: new Date().toISOString(),
      createdAtText: "Just now",
      lastUsedText: "Never",
      scopes: selectedScopes,
      permissions: selectedScopes,
      fullMockKey: fullMockSecret,
      usagePreview: {
        requests24h: 0,
        errorRate: "0.00%",
        avgLatencyMs: 0,
        lastActiveEndpoint: "Awaiting first trace",
        sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    };

    setCreatedMockKey(fullMockSecret);
    setCreatedKeyRecord(newKey);
    setStep("success");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdMockKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    if (createdKeyRecord) {
      onCreated(createdKeyRecord);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-mono">
      {/* Backdrop */}
      <div
        onClick={step === "form" ? onClose : handleFinish}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0c1017] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#080c13]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block">
                {step === "form" ? "NEW CREDENTIAL" : "KEY GENERATED"}
              </span>
              <h2 className="text-sm font-bold text-zinc-100">
                {step === "form" ? "Create API Key" : "API key created"}
              </h2>
            </div>
          </div>

          <button
            onClick={step === "form" ? onClose : handleFinish}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {step === "form" ? (
          <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
            {/* Key Name Input */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
                Key Name
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Production Agent, CI E2E Replay Runner"
                required
                className="w-full rounded-lg border border-white/[0.1] bg-[#080c13] px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                A descriptive label to identify which service or pipeline authenticates with this key.
              </span>
            </div>

            {/* Environment Picker */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
                Target Environment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "production", label: "Production" },
                  { id: "development", label: "Development" },
                  { id: "testing", label: "Testing" },
                ].map((env) => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => setEnvironment(env.id as ApiKeyEnvironment)}
                    className={`rounded-lg border px-3 py-2 text-xs capitalize font-medium transition-all ${
                      environment === env.id
                        ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                        : "border-white/[0.08] bg-[#080c13] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {env.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions / Scopes Selection */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
                Permissions & Scopes
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "traces:write",
                    name: "traces:write",
                    desc: "Send execution spans, tool inputs/outputs, and intermediate agent thoughts.",
                  },
                  {
                    id: "executions:read",
                    name: "executions:read",
                    desc: "Query execution records, step timelines, and health status.",
                  },
                  {
                    id: "agents:read",
                    name: "agents:read",
                    desc: "Read monitored agent metadata and fleet configuration.",
                  },
                ].map((perm) => {
                  const isChecked = selectedScopes.includes(perm.id as ApiKeyScope);
                  return (
                    <div
                      key={perm.id}
                      onClick={() => toggleScope(perm.id as ApiKeyScope)}
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                        isChecked
                          ? "border-cyan-500/30 bg-cyan-950/[0.1] text-zinc-200"
                          : "border-white/[0.06] bg-[#080c13] text-zinc-400 hover:border-white/15"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-zinc-200 block text-[11px]">
                          {perm.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-sans block mt-0.5">
                          {perm.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtle Security Notice */}
            <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-[#080c13] p-3 text-[10px] text-zinc-400">
              <Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Keys are workspace-scoped and authenticate telemetry ingestion over the Black Box Flight Recorder protocol.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!keyName.trim() || selectedScopes.length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/10"
              >
                <span>Create API Key</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="p-6 space-y-4 text-xs">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 flex items-start gap-2.5 text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="space-y-1">
                <span className="font-bold block text-xs">
                  Copy this key now.
                </span>
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                  For security, the full key will only be shown in this mock creation state. Once you dismiss this window, only the masked preview will remain visible.
                </p>
              </div>
            </div>

            {/* Full Mock Key Container */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Generated Mock Credential
              </label>
              <div className="flex items-center justify-between rounded-lg border border-cyan-500/30 bg-[#080c13] p-3">
                <span className="font-mono text-xs text-cyan-300 break-all select-all font-semibold">
                  {createdMockKey}
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
                      <span>Copy key</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-[10px] text-zinc-500 block italic">
                Note: This is a frontend demo mock key. Do not use for real production authorization.
              </span>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Key Name:</span>
                <span className="text-zinc-200 font-bold">{createdKeyRecord?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Environment:</span>
                <span className="text-cyan-300 uppercase text-[10px] font-semibold">
                  {createdKeyRecord?.environment}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Active Permissions:</span>
                <span className="text-zinc-400 font-mono text-[10px]">
                  {createdKeyRecord?.scopes.join(", ")}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-md shadow-cyan-500/10"
              >
                <span>Done, Return to Keys</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
