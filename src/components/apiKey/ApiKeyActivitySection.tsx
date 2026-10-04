"use client";

import * as React from "react";
import Link from "next/link";
import { ApiKeyActivityItem } from "@/types";
import {
  History,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  KeyRound,
} from "lucide-react";

interface ApiKeyActivitySectionProps {
  activities: ApiKeyActivityItem[];
}

export function ApiKeyActivitySection({
  activities,
}: ApiKeyActivitySectionProps) {
  const getStatusIcon = (status: "success" | "warning" | "info") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case "info":
      default:
        return <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0c1017]/85 p-5 backdrop-blur-xs font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Recent API Key Activity
          </h3>
        </div>

        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View Workspace History</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 hover:bg-white/[0.01] px-1 rounded transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded bg-white/[0.04] text-zinc-400">
                <KeyRound className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-200">{item.action}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{item.keyName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{item.timestampAgo}</span>
              </span>
              {getStatusIcon(item.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
