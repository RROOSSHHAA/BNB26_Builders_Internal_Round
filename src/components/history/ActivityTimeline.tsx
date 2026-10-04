"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CalendarDays } from "lucide-react";
import { ActivityGroupTime, ActivityRecord } from "@/types";
import { ActivityTimelineNode } from "./ActivityTimelineNode";

interface ActivityTimelineProps {
  activities: ActivityRecord[];
  onSelectActivity: (activity: ActivityRecord) => void;
}

export function ActivityTimeline({
  activities,
  onSelectActivity,
}: ActivityTimelineProps) {
  // Pagination / Load more state
  const [visibleLimit, setVisibleLimit] = React.useState<number>(15);

  const groups: Array<{ key: ActivityGroupTime; label: string }> = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "previous_7_days", label: "Previous 7 Days" },
    { key: "older", label: "Older Activity" },
  ];

  const slicedActivities = activities.slice(0, visibleLimit);
  const hasMore = visibleLimit < activities.length;

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => {
        const groupActivities = slicedActivities.filter(
          (a) => a.group === group.key
        );

        if (groupActivities.length === 0) return null;

        return (
          <div key={group.key} className="flex flex-col">
            {/* Group Header */}
            <div className="flex items-center gap-2 mb-3.5 pl-1">
              <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
              <h4 className="text-xs font-semibold tracking-wider uppercase font-mono text-zinc-300">
                {group.label}
              </h4>
              <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] font-mono text-zinc-400">
                {groupActivities.length}
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06] ml-2" />
            </div>

            {/* Activities in this group */}
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {groupActivities.map((act, index) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                  >
                    <ActivityTimelineNode
                      activity={act}
                      isLastInGroup={index === groupActivities.length - 1}
                      onSelect={onSelectActivity}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={() => setVisibleLimit((prev) => prev + 10)}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-[#0c1017] px-4 py-2 text-xs font-mono text-zinc-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all shadow-xs"
          >
            <span>Load More Activity</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
