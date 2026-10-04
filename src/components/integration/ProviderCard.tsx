"use client";

import * as React from "react";
import { AIProvider, AIProviderStatus } from "@/types";
import { ProviderVisualMark } from "./ProviderVisualMark";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Settings,
  Plug,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Unplug,
} from "lucide-react";

interface ProviderCardProps {
  provider: AIProvider;
  onConnect: (provider: AIProvider) => void;
  onManage: (provider: AIProvider) => void;
  onDisconnect?: (provider: AIProvider) => void;
}

export function ProviderCard({
  provider,
  onConnect,
  onManage,
  onDisconnect,
}: ProviderCardProps) {
  const getStatusBadge = (status: AIProviderStatus) => {
    switch (status) {
      case "connected":
        return {
          label: "Connected",
          badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
          icon: <CheckCircle2 className="h-3 w-3 text-emerald-400" />,
          dotClass: "bg-emerald-400 animate-pulse",
        };
      case "connecting":
        return {
          label: "Connecting...",
          badgeClass: "border-white/20 bg-white/[0.06] text-white",
          icon: <Loader2 className="h-3 w-3 text-zinc-200 animate-spin" />,
          dotClass: "bg-zinc-300",
        };
      case "error":
        return {
          label: "Connection Error",
          badgeClass: "border-rose-500/20 bg-rose-500/10 text-rose-300",
          icon: <AlertTriangle className="h-3 w-3 text-rose-400" />,
          dotClass: "bg-rose-400",
        };
      case "not_configured":
        return {
          label: "Not configured",
          badgeClass: "border-white/[0.08] bg-white/[0.03] text-zinc-400",
          icon: null,
          dotClass: "bg-zinc-600",
        };
      case "not_connected":
      default:
        return {
          label: "Not connected",
          badgeClass: "border-white/[0.08] bg-white/[0.03] text-zinc-400",
          icon: null,
          dotClass: "bg-zinc-600",
        };
    }
  };

  const statusConfig = getStatusBadge(provider.status);

  const defaultModel =
    provider.models.find((m) => m.id === provider.defaultModelId) ||
    provider.models[0];

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans transition-all duration-200 hover:border-white/20 hover:bg-[#121624] hover:shadow-lg hover:shadow-black/40 h-full">
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProviderVisualMark type={provider.type} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors">
                  {provider.name}
                </h3>
                {provider.isLocal && (
                  <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] font-medium text-zinc-300">
                    Local
                  </span>
                )}
                {provider.isCustom && (
                  <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] font-medium text-zinc-300">
                    Custom
                  </span>
                )}
              </div>
              <span className="text-[11px] text-zinc-400 block mt-0.5 font-sans">
                {provider.models.length}{" "}
                {provider.models.length === 1 ? "model" : "models"} configured
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusConfig.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}`} />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-300/90 leading-relaxed font-sans min-h-[38px]">
          {provider.description}
        </p>

        {/* Metadata Details */}
        <div className="rounded-lg border border-white/[0.05] bg-[#080c13] p-3 space-y-2 text-[11px]">
          {/* Active Model */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 uppercase text-[10px]">Default Model:</span>
            <span className="text-zinc-200 font-medium truncate max-w-[180px]">
              {defaultModel ? defaultModel.name : "None selected"}
            </span>
          </div>

          {/* Masked Key or Endpoint */}
          {provider.status === "connected" && provider.maskedApiKey && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase text-[10px]">API Key:</span>
              <span className="text-emerald-400 font-mono tracking-wider text-[10px]">
                {provider.maskedApiKey}
              </span>
            </div>
          )}

          {provider.baseUrl && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase text-[10px]">Endpoint:</span>
              <span className="text-zinc-300 truncate max-w-[170px]" title={provider.baseUrl}>
                {provider.baseUrl}
              </span>
            </div>
          )}

          {/* Last Configured */}
          <div className="flex items-center justify-between border-t border-white/[0.04] pt-1.5">
            <span className="text-zinc-500 uppercase text-[10px]">Last Configured:</span>
            <span className="text-zinc-400 text-[10px] flex items-center gap-1">
              <Clock className="h-3 w-3 text-zinc-500" />
              <span>{provider.lastConfiguredAgo || "Never"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        {provider.status === "connected" ? (
          <>
            <button
              onClick={() => onManage(provider)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:border-white/20 transition-all font-sans"
            >
              <Settings className="h-3.5 w-3.5 text-zinc-400" />
              <span>Manage</span>
            </button>

            {onDisconnect && (
              <button
                onClick={() => onDisconnect(provider)}
                className="inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/15 hover:border-red-500/30 transition-all"
                title="Disconnect provider"
              >
                <Unplug className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        ) : provider.status === "error" ? (
          <button
            onClick={() => onConnect(provider)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-all font-sans"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        ) : (
          <button
            onClick={() => onConnect(provider)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 transition-all font-sans shadow-xs"
          >
            <Plug className="h-3.5 w-3.5" />
            <span>{provider.isCustom ? "Configure Custom" : "Connect"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
