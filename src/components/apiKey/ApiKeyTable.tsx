"use client";

import * as React from "react";
import { ApiKey, ApiKeyStatus } from "@/types";
import {
  KeyRound,
  Copy,
  Check,
  RotateCcw,
  Ban,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Layers,
} from "lucide-react";

interface ApiKeyTableProps {
  keys: ApiKey[];
  onViewDetails: (key: ApiKey) => void;
  onCopyKey: (key: ApiKey) => void;
  onRotateKey: (key: ApiKey) => void;
  onRevokeKey: (key: ApiKey) => void;
  copiedId: string | null;
}

export function ApiKeyTable({
  keys,
  onViewDetails,
  onCopyKey,
  onRotateKey,
  onRevokeKey,
  copiedId,
}: ApiKeyTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const getEnvBadge = (env: string) => {
    switch (env.toLowerCase()) {
      case "production":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      case "staging":
      case "testing":
        return "border-blue-500/20 bg-blue-500/10 text-blue-300";
      case "development":
      default:
        return "border-white/[0.08] bg-white/[0.04] text-zinc-300";
    }
  };

  const getStatusBadge = (status: ApiKeyStatus) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-sans font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Active</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-sans font-medium text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <span>Revoked</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3 font-sans">
      {/* Desktop Table View (Hidden on Small Screens) */}
      <div className="hidden lg:block rounded-xl border border-white/[0.08] bg-[#0e121b] overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase font-medium text-zinc-400 border-b border-white/[0.06] bg-[#090d14] font-sans">
          <span className="col-span-3">Key Name</span>
          <span className="col-span-2">Preview</span>
          <span className="col-span-1 text-center">Status</span>
          <span className="col-span-1 text-center">Env</span>
          <span className="col-span-2">Permissions</span>
          <span className="col-span-2">Last Used</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {keys.map((apiKey) => {
            const isCopied = copiedId === apiKey.id;
            const isMenuOpen = activeMenuId === apiKey.id;

            return (
              <div
                key={apiKey.id}
                className="grid grid-cols-12 px-4 py-3.5 items-center text-xs hover:bg-[#121624] transition-colors group font-sans"
              >
                {/* Key Name */}
                <div
                  onClick={() => onViewDetails(apiKey)}
                  className="col-span-3 flex items-center gap-2.5 cursor-pointer pr-2"
                >
                  <KeyRound className="h-4 w-4 text-zinc-300 shrink-0 group-hover:text-white transition-colors" />
                  <div className="min-w-0">
                    <span className="font-medium text-white group-hover:text-zinc-200 transition-colors block truncate font-sans">
                      {apiKey.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-sans">
                      Created {apiKey.createdAtText || "recently"}
                    </span>
                  </div>
                </div>

                {/* Key Preview with Quick Copy */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-zinc-300 tracking-wider truncate">
                    {apiKey.keyPreview || apiKey.prefix}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyKey(apiKey);
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors shrink-0"
                    title="Copy masked preview"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-center">
                  {getStatusBadge(apiKey.status)}
                </div>

                {/* Environment */}
                <div className="col-span-1 flex justify-center">
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-semibold border ${getEnvBadge(
                      apiKey.environment
                    )}`}
                  >
                    {apiKey.environment}
                  </span>
                </div>

                {/* Permissions / Scopes */}
                <div className="col-span-2 flex flex-wrap gap-1 pr-2">
                  {(apiKey.scopes || apiKey.permissions || []).map((scope, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.2 text-[9px] text-zinc-400"
                    >
                      {scope}
                    </span>
                  ))}
                </div>

                {/* Last Used */}
                <div className="col-span-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span>{apiKey.lastUsedText || "Never"}</span>
                </div>

                {/* Actions Menu */}
                <div className="col-span-1 relative flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(isMenuOpen ? null : apiKey.id);
                    }}
                    className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-7 z-30 w-44 rounded-lg border border-white/[0.1] bg-[#0c1017] p-1 shadow-xl shadow-black/70 animate-in fade-in zoom-in-95 duration-100 text-xs"
                    >
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onViewDetails(apiKey);
                        }}
                        className="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-cyan-400" />
                        <span>View details</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onCopyKey(apiKey);
                        }}
                        className="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Copy key</span>
                      </button>

                      {apiKey.status === "active" && (
                        <>
                          <div className="my-1 border-t border-white/[0.06]" />

                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onRotateKey(apiKey);
                            }}
                            className="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-amber-300 hover:bg-amber-500/10 transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                            <span>Rotate key</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onRevokeKey(apiKey);
                            }}
                            className="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            <span>Revoke key</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Card View (Visible on Smaller Screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3">
        {keys.map((apiKey) => {
          const isCopied = copiedId === apiKey.id;
          const isMenuOpen = activeMenuId === apiKey.id;

          return (
            <div
              key={apiKey.id}
              className="rounded-xl border border-white/[0.08] bg-[#0c1017]/90 p-4 space-y-3 backdrop-blur-xs relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div
                  onClick={() => onViewDetails(apiKey)}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <KeyRound className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 hover:text-cyan-300 transition-colors">
                      {apiKey.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500">
                      Created {apiKey.createdAtText || "recently"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {getStatusBadge(apiKey.status)}
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] uppercase font-semibold border ${getEnvBadge(
                      apiKey.environment
                    )}`}
                  >
                    {apiKey.environment}
                  </span>
                </div>
              </div>

              {/* Preview with quick copy */}
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#080c13] px-3 py-2 text-xs">
                <span className="font-mono text-[11px] text-zinc-300 tracking-wider">
                  {apiKey.keyPreview || apiKey.prefix}
                </span>
                <button
                  onClick={() => onCopyKey(apiKey)}
                  className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Scopes */}
              <div className="flex flex-wrap gap-1">
                {(apiKey.scopes || apiKey.permissions || []).map((scope, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.2 text-[9px] text-zinc-400"
                  >
                    {scope}
                  </span>
                ))}
              </div>

              {/* Footer with actions */}
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Used {apiKey.lastUsedText || "Never"}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewDetails(apiKey)}
                    className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300 hover:bg-white/[0.06] transition-colors"
                  >
                    Details
                  </button>

                  {apiKey.status === "active" && (
                    <>
                      <button
                        onClick={() => onRotateKey(apiKey)}
                        className="rounded border border-amber-500/20 bg-amber-500/5 px-2 py-1 text-[11px] text-amber-300 hover:bg-amber-500/15 transition-colors"
                      >
                        Rotate
                      </button>
                      <button
                        onClick={() => onRevokeKey(apiKey)}
                        className="rounded border border-red-500/20 bg-red-500/5 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/15 transition-colors"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
