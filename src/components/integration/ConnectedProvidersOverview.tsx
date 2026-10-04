"use client";

import * as React from "react";
import { AIProvider } from "@/types";
import { ProviderVisualMark } from "./ProviderVisualMark";
import {
  CheckCircle2,
  Clock,
  Settings,
  Plus,
  Unplug,
  Server,
} from "lucide-react";

interface ConnectedProvidersOverviewProps {
  providers: AIProvider[];
  onConnectProvider: () => void;
  onManageProvider: (provider: AIProvider) => void;
  onDisconnectProvider: (provider: AIProvider) => void;
}

export function ConnectedProvidersOverview({
  providers,
  onConnectProvider,
  onManageProvider,
  onDisconnectProvider,
}: ConnectedProvidersOverviewProps) {
  const connectedProviders = providers.filter((p) => p.status === "connected");

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-white font-semibold">
            Connected Providers
          </span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
            {connectedProviders.length} active
          </span>
        </div>

        {connectedProviders.length > 0 && (
          <button
            onClick={onConnectProvider}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Connect Another</span>
          </button>
        )}
      </div>

      {connectedProviders.length === 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-dashed border-white/[0.1] bg-[#0e121b] p-5 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-500 shrink-0">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-200">
                No providers connected.
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                Connect an AI provider to enable agent execution tracing and replay simulations.
              </p>
            </div>
          </div>

          <button
            onClick={onConnectProvider}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 transition-all shrink-0 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Connect Provider</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
          {connectedProviders.map((provider) => {
            const defaultModel =
              provider.models.find((m) => m.id === provider.defaultModelId) ||
              provider.models[0];

            return (
              <div
                key={provider.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0e121b] p-3.5 hover:border-white/20 transition-all h-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ProviderVisualMark type={provider.type} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">
                        {provider.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>Connected</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      <span className="text-zinc-200 font-medium">
                        {defaultModel ? defaultModel.name : "Default"}
                      </span>
                      {provider.maskedApiKey && (
                        <span className="text-zinc-500 ml-1.5 font-mono text-[10px]">
                          ({provider.maskedApiKey})
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>Configured {provider.lastConfiguredAgo || "recently"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onManageProvider(provider)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Manage settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDisconnectProvider(provider)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Disconnect"
                  >
                    <Unplug className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
