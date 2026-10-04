"use client";

import * as React from "react";
import {
  Radio,
  Eye,
  Sparkles,
  Search,
  Play,
  GitCompare,
  Layers,
  Puzzle,
  KeyRound,
  Ban,
  Sliders,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ActivityRecord, ActivityType } from "@/types";

interface ActivityTimelineNodeProps {
  activity: ActivityRecord;
  isLastInGroup: boolean;
  onSelect: (activity: ActivityRecord) => void;
}

export function ActivityTimelineNode({
  activity,
  isLastInGroup,
  onSelect,
}: ActivityTimelineNodeProps) {
  const getIconInfo = (type: ActivityType) => {
    switch (type) {
      case "EXECUTION_RECORDED":
        return {
          icon: Radio,
          color: "text-emerald-400",
          nodeBg: "bg-emerald-500/10 border-emerald-500/20",
          dotGlow: "bg-emerald-400",
        };
      case "EXECUTION_VIEWED":
        return {
          icon: Eye,
          color: "text-zinc-300",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-400",
        };
      case "DIAGNOSIS_CREATED":
        return {
          icon: Sparkles,
          color: "text-zinc-200",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-300",
        };
      case "DIAGNOSIS_VIEWED":
        return {
          icon: Search,
          color: "text-zinc-300",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-400",
        };
      case "REPLAY_CREATED":
        return {
          icon: Play,
          color: "text-zinc-200",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-300",
        };
      case "COMPARISON_CREATED":
        return {
          icon: GitCompare,
          color: "text-zinc-200",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-300",
        };
      case "AGENT_CREATED":
        return {
          icon: Layers,
          color: "text-zinc-200",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-300",
        };
      case "INTEGRATION_CONNECTED":
        return {
          icon: Puzzle,
          color: "text-emerald-400",
          nodeBg: "bg-emerald-500/10 border-emerald-500/20",
          dotGlow: "bg-emerald-400",
        };
      case "API_KEY_CREATED":
        return {
          icon: KeyRound,
          color: "text-zinc-200",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-300",
        };
      case "API_KEY_REVOKED":
        return {
          icon: Ban,
          color: "text-rose-400",
          nodeBg: "bg-rose-500/10 border-rose-500/20",
          dotGlow: "bg-rose-400",
        };
      case "SETTINGS_UPDATED":
        return {
          icon: Sliders,
          color: "text-zinc-400",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-400",
        };
      default:
        return {
          icon: Radio,
          color: "text-zinc-400",
          nodeBg: "bg-white/[0.04] border-white/[0.08]",
          dotGlow: "bg-zinc-400",
        };
    }
  };

  const { icon: Icon, color, nodeBg, dotGlow } = getIconInfo(activity.type);

  return (
    <div className="relative flex items-start gap-3 md:gap-4 group">
      {/* Left Timeline Column: Timestamp on desktop + Dot & Stem */}
      <div className="flex flex-col items-center shrink-0 w-16 md:w-20 pt-1">
        <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
          {activity.displayTime}
        </span>
        <div className="relative flex items-center justify-center my-1.5">
          <div
            className={`h-2.5 w-2.5 rounded-full ${dotGlow} ring-4 ring-[#080c13] transition-transform duration-200 group-hover:scale-125`}
          />
        </div>
        {/* Vertical connector stem */}
        {!isLastInGroup && (
          <div className="w-[1px] grow bg-white/[0.08] min-h-[44px] my-1" />
        )}
      </div>

      {/* Main Activity Card */}
      <div
        onClick={() => onSelect(activity)}
        className="flex-1 mb-3.5 cursor-pointer rounded-xl border border-white/[0.08] bg-[#0e121b] p-3.5 transition-all duration-200 hover:border-white/20 hover:bg-[#121624] hover:shadow-lg group-hover:translate-x-0.5 font-sans"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Title + Related Object */}
          <div className="flex items-start gap-2.5">
            <div
              className={`p-1.5 rounded-lg border ${nodeBg} shrink-0 mt-0.5`}
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors">
                  {activity.title}
                </span>

                <span className="text-xs text-zinc-400 font-mono">
                  {activity.relatedObject}
                </span>

                {activity.status && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                      activity.statusColor ||
                      "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    }`}
                  >
                    {activity.status}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>

          {/* Right Action: [View] button */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(activity);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-sans font-medium text-zinc-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <span>View</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
