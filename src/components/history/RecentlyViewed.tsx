"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Terminal, Sparkles, Play, Layers, ArrowUpRight } from "lucide-react";
import { RecentlyViewedItem } from "@/types";

interface RecentlyViewedProps {
  items: RecentlyViewedItem[];
}

export function RecentlyViewed({ items }: RecentlyViewedProps) {
  const getItemIcon = (type: RecentlyViewedItem["type"]) => {
    switch (type) {
      case "execution":
        return Terminal;
      case "diagnosis":
        return Sparkles;
      case "replay":
        return Play;
      case "agent":
        return Layers;
      default:
        return Terminal;
    }
  };

  const getStatusBadge = (status?: RecentlyViewedItem["status"]) => {
    switch (status) {
      case "FAILED":
        return "bg-rose-500/10 text-rose-300 border-rose-500/20";
      case "ANOMALY":
        return "bg-white/[0.06] text-zinc-300 border-white/10";
      case "SUCCESS":
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      default:
        return "bg-white/[0.04] text-zinc-400 border-white/[0.08]";
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider font-sans text-zinc-200">
            Recently Viewed
          </h3>
        </div>
        <span className="text-[10px] font-sans text-zinc-400">
          Fast Jump
        </span>
      </div>

      <p className="text-xs text-zinc-400 font-sans">
        Jump directly back into your latest investigated runs and diagnoses:
      </p>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = getItemIcon(item.type);
          const badgeClass = getStatusBadge(item.status);

          return (
            <Link
              key={item.id}
              href={item.targetUrl}
              className="group relative flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#080c13] p-2.5 transition-all duration-200 hover:border-white/20 hover:bg-[#121624] hover:shadow-xs font-sans"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="rounded p-1.5 bg-white/[0.03] border border-white/[0.06] text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-colors shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-sans font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                      {item.title}
                    </span>
                    {item.status && (
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-sans font-medium border ${badgeClass}`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-zinc-400 truncate">
                    <span>{item.subtitle}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{item.timestampAgo}</span>
                  </div>
                </div>
              </div>

              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
