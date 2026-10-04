"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MOCK_HISTORY_SUMMARY,
  MOCK_RECENTLY_VIEWED,
  MOCK_ACTIVITY_LOG,
} from "@/mock";
import {
  ActivityRecord,
  ActivityCategory,
  ActivityDateFilter,
} from "@/types";
import { HistorySummaryBar } from "@/components/history/HistorySummaryBar";
import { HistoryFilterBar } from "@/components/history/HistoryFilterBar";
import { ActivityTimeline } from "@/components/history/ActivityTimeline";
import { RecentlyViewed } from "@/components/history/RecentlyViewed";
import { ActivityDetailDrawer } from "@/components/history/ActivityDetailDrawer";
import { HistoryEmptyState } from "@/components/history/HistoryEmptyState";
import { History as HistoryIcon, Radio, Shield, Sparkles } from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function HistoryPage() {
  const { mode, triggerRetry } = useDemoState();
  const [activities, setActivities] = React.useState<ActivityRecord[]>(MOCK_ACTIVITY_LOG);
  const [selectedActivity, setSelectedActivity] =
    React.useState<ActivityRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("blackbox_custom_activities") || "[]");
        if (stored.length > 0) {
          setActivities((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = stored.filter((a: any) => !existingIds.has(a.id));
            return [...newOnes, ...prev];
          });
        }
      } catch {}
    }
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<ActivityCategory>("all");
  const [selectedDate, setSelectedDate] = React.useState<ActivityDateFilter>("all");
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  const handleSelectActivity = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setIsDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDate("all");
    setSimulateEmpty(false);
  };

  // Filtered Activities
  const filteredActivities = React.useMemo(() => {
    if (simulateEmpty) return [];

    let list = [...activities];

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((a) => a.category === selectedCategory);
    }

    // Filter by Date
    if (selectedDate !== "all") {
      if (selectedDate === "today") {
        list = list.filter((a) => a.group === "today");
      } else if (selectedDate === "last_7_days") {
        list = list.filter(
          (a) =>
            a.group === "today" ||
            a.group === "yesterday" ||
            a.group === "previous_7_days"
        );
      } else if (selectedDate === "last_30_days") {
        // all mock records fall within 30 days
        list = list;
      }
    }

    // Search Query (by execution ID, agent name, diagnosis title, activity type, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.relatedObject.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          (a.status && a.status.toLowerCase().includes(q)) ||
          (a.detail.executionId &&
            a.detail.executionId.toLowerCase().includes(q)) ||
          (a.detail.agentName &&
            a.detail.agentName.toLowerCase().includes(q)) ||
          (a.detail.diagnosisTitle &&
            a.detail.diagnosisTitle.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activities, selectedCategory, selectedDate, searchQuery, simulateEmpty]);

  // 1. Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <PageSkeleton showCards={false} cardCount={0} showTable={true} />
      </div>
    );
  }

  // 2. Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-10 pb-16 font-sans">
        <ErrorState
          title="Activity log unavailable"
          message="Black Box could not load the workspace audit and activity log."
          details={{
            subsystem: "workspace-audit-stream",
            errorCode: "ERR_HISTORY_STREAM_DISCONNECTED",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Connection"
          secondaryAction={{
            label: "Return to Overview",
            href: "/dashboard",
          }}
        />
      </div>
    );
  }

  // 3. Empty State
  if (mode === "empty") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-8 pb-16 font-sans">
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Activity History</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Workspace operation log and audit timeline.
          </p>
        </div>

        <EmptyState
          icon={HistoryIcon}
          title="No activity yet"
          description="Your Black Box workspace activity will appear here."
          primaryAction={{
            label: "Go to Overview",
            href: "/dashboard",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Activity
            </span>
            <span className="text-xs text-zinc-400 font-sans flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Workspace Telemetry Active
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Your Black Box history
          </h1>

          <p className="mt-1 text-xs md:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
            Revisit executions, investigations, diagnoses, replays, and other activity across your workspace.
          </p>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulateEmpty((prev) => !prev)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-sans font-medium transition-all ${
              simulateEmpty
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-[#0e121b] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.14]"
            }`}
            title="Toggle empty state view for UI review"
          >
            {simulateEmpty ? "Show Activity" : "Simulate Empty"}
          </button>
        </div>
      </div>

      {/* 1. COMPACT HISTORY SUMMARY */}
      <HistorySummaryBar stats={MOCK_HISTORY_SUMMARY} />

      {/* 2. INTELLIGENT FILTER & SEARCH BAR */}
      <HistoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        totalFilteredCount={filteredActivities.length}
        onReset={handleResetFilters}
      />

      {/* 3. MAIN WORKSPACE LAYOUT: TIMELINE + RECENTLY VIEWED SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Activity Timeline (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <HistoryIcon className="h-4 w-4 text-zinc-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider font-sans text-zinc-200">
                Workspace Activity Timeline
              </h2>
            </div>
            <span className="text-[11px] font-sans text-zinc-400">
              Interactive Nodes · Click to Investigate
            </span>
          </div>

          {filteredActivities.length === 0 ? (
            <HistoryEmptyState
              hasFilters={
                Boolean(searchQuery.trim()) ||
                selectedCategory !== "all" ||
                selectedDate !== "all" ||
                simulateEmpty
              }
              onReset={handleResetFilters}
            />
          ) : (
            <ActivityTimeline
              activities={filteredActivities}
              onSelectActivity={handleSelectActivity}
            />
          )}
        </div>

        {/* Right Column: Secondary Rails (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Recently Viewed Fast Jump */}
          <RecentlyViewed items={MOCK_RECENTLY_VIEWED} />

          {/* Workspace Audit & Integrity Card */}
          <div className="rounded-lg border border-white/[0.07] bg-[#0c1017]/80 p-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-300">
                Flight Recorder Integrity
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono leading-relaxed mb-3">
              All workspace operations, agent registrations, and anomaly diagnoses
              are tamper-logged and ready for replay simulation.
            </p>
            <div className="rounded border border-white/[0.05] bg-[#080c13] p-2.5 space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Ingress Pipeline:</span>
                <span className="text-emerald-400 font-medium">Nominal (0 drop)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Buffer Retention:</span>
                <span className="text-zinc-300 font-medium">90 Days</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Diagnostic Engine:</span>
                <span className="text-cyan-300 font-medium">Active (v2.4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY DETAIL DRAWER */}
      <ActivityDetailDrawer
        activity={selectedActivity}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
