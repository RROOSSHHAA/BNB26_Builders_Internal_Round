"use client";

import * as React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import {
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Play,
  Layers,
  Puzzle,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Code2,
} from "lucide-react";
import { ActivityRecord } from "@/types";

interface ActivityDetailDrawerProps {
  activity: ActivityRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDetailDrawer({
  activity,
  isOpen,
  onClose,
}: ActivityDetailDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!activity) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(activity.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPrimaryAction = () => {
    if (activity.detail.executionId) {
      return {
        label: "Open Execution",
        href: `/dashboard/executions/${activity.detail.executionId}`,
        icon: Terminal,
      };
    }
    if (activity.detail.agentId) {
      return {
        label: "View Agent",
        href: `/dashboard/agents/${activity.detail.agentId}`,
        icon: Layers,
      };
    }
    if (activity.category === "integrations") {
      return {
        label: "View Integrations",
        href: "/dashboard/integrations",
        icon: Puzzle,
      };
    }
    if (activity.category === "api_keys") {
      return {
        label: "Manage API Keys",
        href: "/dashboard/api-keys",
        icon: KeyRound,
      };
    }
    if (activity.category === "comparisons") {
      return {
        label: "View Comparison",
        href: "/dashboard/comparisons",
        icon: Terminal,
      };
    }
    return {
      label: "View Workspace",
      href: activity.targetUrl || "/dashboard",
      icon: ExternalLink,
    };
  };

  const primaryAction = getPrimaryAction();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={activity.title}
      subtitle={`Activity ID: ${activity.id} · Logged at ${activity.displayTime}`}
      width="xl"
      badge={
        activity.status ? (
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium border ${
              activity.statusColor ||
              "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            }`}
          >
            {activity.status}
          </span>
        ) : null
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied ID</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {activity.secondaryTargetUrl && (
              <Link
                href={activity.secondaryTargetUrl}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-white/20 hover:text-zinc-100 transition-all"
              >
                <span>{activity.secondaryActionLabel || "Inspect Secondary"}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}

            <Link
              href={primaryAction.href}
              className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all"
            >
              <span>{primaryAction.label}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5 text-sm">
        {/* Overview Box */}
        <div className="rounded-lg border border-white/[0.08] bg-[#080c13] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Related Entity
            </span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.timestamp}
            </span>
          </div>
          <div className="text-sm font-semibold text-zinc-100 font-mono">
            {activity.relatedObject}
          </div>
          <p className="mt-1.5 text-xs text-zinc-300 font-mono leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Structured Context Metadata */}
        {activity.detail.metaItems && activity.detail.metaItems.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-400 mb-2.5">
              Investigation Context
            </h4>
            <div className="rounded-lg border border-white/[0.07] bg-[#0c1017] divide-y divide-white/[0.05]">
              {activity.detail.metaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs font-mono"
                >
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="text-zinc-200 font-medium text-right ml-4 truncate">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suspicious Step / Diagnosis Callout if applicable */}
        {activity.detail.suspiciousStep && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.04] p-3.5">
            <div className="flex items-center gap-2 mb-1.5 text-amber-300 text-xs font-mono font-medium">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Divergence Point: Step {activity.detail.suspiciousStep}</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Black Box detected an anomalous execution divergence at Step{" "}
              {activity.detail.suspiciousStep}. Cross-referencing token distributions and
              latency spikes against the nominal execution baseline.
            </p>
          </div>
        )}

        {/* Technical Event Payload Snippet */}
        {activity.detail.rawPayloadSnippet && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                Raw Event Payload
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                JSON Telemetry Hook
              </span>
            </div>
            <pre className="rounded-lg border border-white/[0.06] bg-[#05080f] p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-48 scrollbar-thin">
              {activity.detail.rawPayloadSnippet}
            </pre>
          </div>
        )}
      </div>
    </Drawer>
  );
}
