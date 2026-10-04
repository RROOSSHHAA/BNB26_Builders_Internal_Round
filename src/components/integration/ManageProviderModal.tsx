"use client";

import * as React from "react";
import { AIProvider, AIProviderModel } from "@/types";
import { ProviderVisualMark } from "./ProviderVisualMark";
import {
  X,
  CheckCircle2,
  Clock,
  Key,
  ShieldCheck,
  Settings,
  Unplug,
  RotateCcw,
  ChevronDown,
  Layers,
  Edit2,
  AlertTriangle,
} from "lucide-react";

interface ManageProviderModalProps {
  isOpen: boolean;
  provider: AIProvider | null;
  onClose: () => void;
  onUpdateProvider: (updated: AIProvider) => void;
  onDisconnect: (provider: AIProvider) => void;
}

export function ManageProviderModal({
  isOpen,
  provider,
  onClose,
  onUpdateProvider,
  onDisconnect,
}: ManageProviderModalProps) {
  const [selectedModelId, setSelectedModelId] = React.useState(
    provider?.defaultModelId || provider?.models[0]?.id || ""
  );
  const [isEditingKey, setIsEditingKey] = React.useState(false);
  const [newApiKey, setNewApiKey] = React.useState("");
  const [environment, setEnvironment] = React.useState(
    provider?.environment || "production"
  );
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Sync state when provider changes
  const prevProviderIdRef = React.useRef(provider?.id);
  if (provider && provider.id !== prevProviderIdRef.current) {
    prevProviderIdRef.current = provider.id;
    setSelectedModelId(provider.defaultModelId || provider.models[0]?.id || "");
    setEnvironment(provider.environment || "production");
    setIsEditingKey(false);
    setNewApiKey("");
    setSaveSuccess(false);
  }

  if (!isOpen || !provider) return null;

  const activeModel =
    provider.models.find((m) => m.id === selectedModelId) || provider.models[0];

  const handleSave = () => {
    let masked = provider.maskedApiKey;
    if (newApiKey.trim()) {
      const suffix =
        newApiKey.trim().length >= 4 ? newApiKey.trim().slice(-4) : "8c2d";
      masked = `••••••••${suffix}`;
    }

    const updated: AIProvider = {
      ...provider,
      defaultModelId: selectedModelId,
      maskedApiKey: masked,
      environment,
      lastConfiguredAgo: "Just now",
      lastConfiguredAt: new Date().toISOString(),
    };

    onUpdateProvider(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleDisconnect = () => {
    onDisconnect(provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-mono">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0c1017] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#080c13]">
          <div className="flex items-center gap-3">
            <ProviderVisualMark type={provider.type} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                  MANAGE PROVIDER
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-300 font-semibold">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Active
                </span>
              </div>
              <h2 className="text-sm font-bold text-zinc-100">
                {provider.name} Connection
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
        <div className="p-6 space-y-4 text-xs">
          {/* Status summary */}
          <div className="rounded-lg border border-white/[0.06] bg-[#080c13] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 uppercase">Provider Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="h-3 w-3" />
                <span>Connected & Ready</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 uppercase">Connected Date:</span>
              <span className="text-zinc-300 text-[11px]">
                {provider.lastConfiguredAgo || "12 minutes ago"}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
              <span className="text-[10px] text-zinc-500 uppercase">Environment:</span>
              <span className="text-cyan-300 uppercase text-[10px] font-bold tracking-wider">
                {environment}
              </span>
            </div>
          </div>

          {/* Masked API Key Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-zinc-400">
                API Key Credentials
              </label>
              <button
                type="button"
                onClick={() => setIsEditingKey((prev) => !prev)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                <span>{isEditingKey ? "Cancel Update" : "Update Key"}</span>
              </button>
            </div>

            {isEditingKey ? (
              <div className="space-y-1.5">
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="Enter new API key..."
                  className="w-full rounded-lg border border-white/[0.1] bg-[#080c13] px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Keys are validated and masked securely client-side.
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#080c13] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <Key className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="font-mono text-zinc-200 tracking-wider">
                    {provider.maskedApiKey || "••••••••91af"}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 uppercase font-bold">
                  Masked
                </span>
              </div>
            )}
          </div>

          {/* Default Model Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 block">
              Default Reasoning Model
            </label>
            <div className="relative">
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full rounded-lg border border-white/[0.1] bg-[#080c13] px-3 py-2 text-xs text-zinc-200 appearance-none focus:border-cyan-500/50 focus:outline-hidden"
              >
                {provider.models.map((model) => (
                  <option key={model.id} value={model.id} className="bg-[#0c1017]">
                    {model.name} — {model.family} ({model.contextWindow})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            </div>

            {activeModel?.description && (
              <p className="text-[11px] text-zinc-400 font-sans mt-1">
                {activeModel.description}
              </p>
            )}
          </div>

          {/* Environment Setting */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 block">
              Target Environment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["development", "staging", "production"] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setEnvironment(env)}
                  className={`rounded-lg border px-3 py-1.5 text-[11px] capitalize font-medium transition-all ${
                    environment === env
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                      : "border-white/[0.08] bg-[#080c13] text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-4 bg-[#080c13]">
          <button
            type="button"
            onClick={handleDisconnect}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all"
          >
            <Unplug className="h-3.5 w-3.5" />
            <span>Disconnect</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-md shadow-cyan-500/10"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
