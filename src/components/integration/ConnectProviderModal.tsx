"use client";

import * as React from "react";
import { AIProvider, AIProviderType, AIProviderModel } from "@/types";
import { ProviderVisualMark } from "./ProviderVisualMark";
import {
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  ChevronDown,
  Server,
  Globe,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

interface ConnectProviderModalProps {
  isOpen: boolean;
  provider: AIProvider | null;
  allProviders: AIProvider[];
  onClose: () => void;
  onSuccess: (updatedProvider: AIProvider) => void;
}

export function ConnectProviderModal({
  isOpen,
  provider,
  allProviders,
  onClose,
  onSuccess,
}: ConnectProviderModalProps) {
  // If no provider selected, default to OpenAI or first available
  const [selectedProviderId, setSelectedProviderId] = React.useState<string>(
    provider?.id || "prov-openai"
  );

  const activeProvider =
    allProviders.find((p) => p.id === selectedProviderId) ||
    provider ||
    allProviders[0];

  // Form Fields
  const [apiKey, setApiKey] = React.useState("");
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [selectedModelId, setSelectedModelId] = React.useState("");
  const [environment, setEnvironment] = React.useState<
    "development" | "staging" | "production"
  >("development");

  // Custom / Local Fields
  const [customName, setCustomName] = React.useState("");
  const [customBaseUrl, setCustomBaseUrl] = React.useState("");
  const [customModelName, setCustomModelName] = React.useState("");
  const [requestFormat, setRequestFormat] = React.useState<
    "openai_compatible" | "anthropic_compatible" | "custom_json"
  >("openai_compatible");

  // State Management
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [simulatedError, setSimulatedError] = React.useState<string | null>(null);

  // Sync state when provider prop changes
  const prevProviderIdRef = React.useRef(provider?.id);
  if (provider && provider.id !== prevProviderIdRef.current) {
    prevProviderIdRef.current = provider.id;
    setSelectedProviderId(provider.id);
    setSelectedModelId(provider.defaultModelId || provider.models[0]?.id || "");
    setCustomBaseUrl(provider.baseUrl || "");
    setCustomName(provider.name || "");
    setCustomModelName(provider.models[0]?.name || "");
  }

  const handleProviderSelect = (newId: string) => {
    setSelectedProviderId(newId);
    const target = allProviders.find((p) => p.id === newId);
    if (target) {
      setSelectedModelId(target.defaultModelId || target.models[0]?.id || "");
      if (target.baseUrl) setCustomBaseUrl(target.baseUrl);
    }
  };

  if (!isOpen) return null;

  const handleConnect = () => {
    setSimulatedError(null);
    setIsSubmitting(true);

    // Simulate verification delay (850ms)
    setTimeout(() => {
      setIsSubmitting(false);

      // Check if user purposely typed error to test error state
      if (apiKey.toLowerCase().includes("error") || customBaseUrl.toLowerCase().includes("error")) {
        setSimulatedError("Connection could not be verified. Please check the API key or endpoint configuration.");
        return;
      }

      // Generate a realistic masked key
      const keySuffix = apiKey.length >= 4 ? apiKey.slice(-4) : "91af";
      const maskedKey = `••••••••${keySuffix}`;

      let updatedModels = [...activeProvider.models];
      if (activeProvider.isCustom && customModelName.trim()) {
        updatedModels = [
          {
            id: `model-${Date.now()}`,
            name: customModelName.trim(),
            family: "Custom",
            contextWindow: "Dynamic",
            isDefault: true,
          },
        ];
      }

      const updated: AIProvider = {
        ...activeProvider,
        name: activeProvider.isCustom && customName.trim() ? customName.trim() : activeProvider.name,
        status: "connected",
        maskedApiKey: maskedKey,
        defaultModelId: selectedModelId || updatedModels[0]?.id,
        environment,
        baseUrl: customBaseUrl.trim() || activeProvider.baseUrl,
        models: updatedModels,
        lastConfiguredAgo: "Just now",
        lastConfiguredAt: new Date().toISOString(),
      };

      onSuccess(updated);
      onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-mono">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container: full-width bottom sheet on mobile, centered modal on desktop */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0c1017] shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#080c13]">
          <div className="flex items-center gap-3">
            <ProviderVisualMark type={activeProvider.type} size="sm" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block">
                CONNECT PROVIDER
              </span>
              <h2 className="text-sm font-bold text-zinc-100">
                {activeProvider.name}
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

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Provider Selector if multiple exist */}
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
              Provider
            </label>
            <div className="relative">
              <select
                value={selectedProviderId}
                onChange={(e) => handleProviderSelect(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-white/[0.1] bg-[#080c13] px-3 py-2 text-xs text-zinc-200 appearance-none focus:border-cyan-500/50 focus:outline-hidden"
              >
                {allProviders.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0c1017]">
                    {p.name} {p.status === "connected" ? "(Connected)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Custom Provider Specific Fields */}
          {activeProvider.isCustom && (
            <div className="space-y-3 p-3.5 rounded-lg border border-cyan-500/20 bg-cyan-950/[0.08]">
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase">
                <Server className="h-3 w-3" />
                <span>Custom Endpoint Configuration</span>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Internal LLM Gateway"
                  className="w-full rounded-md border border-white/[0.1] bg-[#080c13] px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://api.myllm.internal/v1"
                  className="w-full rounded-md border border-white/[0.1] bg-[#080c13] px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="e.g. custom-reasoning-agent"
                  className="w-full rounded-md border border-white/[0.1] bg-[#080c13] px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Request Format
                </label>
                <select
                  value={requestFormat}
                  onChange={(e) =>
                    setRequestFormat(
                      e.target.value as "openai_compatible" | "anthropic_compatible" | "custom_json"
                    )
                  }
                  className="w-full rounded-md border border-white/[0.1] bg-[#080c13] px-3 py-1.5 text-xs text-zinc-200 focus:border-cyan-500/50 focus:outline-hidden"
                >
                  <option value="openai_compatible" className="bg-[#0c1017]">
                    OpenAI-compatible (/v1/chat/completions)
                  </option>
                  <option value="anthropic_compatible" className="bg-[#0c1017]">
                    Anthropic-compatible (/v1/messages)
                  </option>
                  <option value="custom_json" className="bg-[#0c1017]">
                    Custom JSON Schema
                  </option>
                </select>
              </div>

              <p className="text-[10px] text-zinc-400 italic">
                Use Custom Provider to connect compatible AI infrastructure later.
              </p>
            </div>
          )}

          {/* Local Provider Specific Fields */}
          {activeProvider.isLocal && (
            <div className="space-y-3 p-3.5 rounded-lg border border-purple-500/20 bg-purple-950/[0.08]">
              <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-bold uppercase">
                <Server className="h-3 w-3" />
                <span>Local AI Server Details</span>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  value={customBaseUrl || "http://localhost:11434/v1"}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434/v1"
                  className="w-full rounded-md border border-white/[0.1] bg-[#080c13] px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-purple-500/50 focus:outline-hidden"
                />
              </div>

              <p className="text-[10px] text-zinc-400">
                Ollama, vLLM, or LM Studio running locally with zero external network dispatch.
              </p>
            </div>
          )}

          {/* API Key Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400">
                API Key {activeProvider.isLocal && "(Optional for Local)"}
              </label>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setApiKey("")}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-••••••••••••••••••••••••••••••••"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-white/[0.1] bg-[#080c13] pl-3 pr-10 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-hidden"
              />

              <button
                type="button"
                onClick={() => setShowApiKey((prev) => !prev)}
                className="absolute right-2.5 top-2 rounded p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                title={showApiKey ? "Hide Key" : "Show Key"}
              >
                {showApiKey ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Subtle Security Notice */}
            <div className="mt-1.5 flex items-start gap-1.5 text-[10px] text-zinc-400">
              <Lock className="h-3 w-3 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                API keys are securely handled when provider connections are implemented.
              </span>
            </div>
          </div>

          {/* Reusable Model Selector */}
          {!activeProvider.isCustom && (
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
                Default Model
              </label>
              <div className="relative">
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-white/[0.1] bg-[#080c13] px-3 py-2 text-xs text-zinc-200 appearance-none focus:border-cyan-500/50 focus:outline-hidden"
                >
                  {activeProvider.models.map((model) => (
                    <option key={model.id} value={model.id} className="bg-[#0c1017]">
                      {model.name} — {model.family} ({model.contextWindow})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Environment Selector */}
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
              Environment
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

          {/* Simulated Error Message */}
          {simulatedError && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-red-300 flex items-start gap-2 text-xs">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Verification Error</span>
                <span>{simulatedError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-4 bg-[#080c13]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConnect}
            disabled={isSubmitting || (!apiKey && !activeProvider.isLocal && !activeProvider.isCustom)}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/10"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Verifying Connection...</span>
              </>
            ) : (
              <span>Connect</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
