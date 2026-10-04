"use client";

import * as React from "react";
import { DeveloperPreferences } from "@/types";
import {
  Code2,
  Terminal,
  Layers,
  Sparkles,
  Check,
  CheckCircle2,
  Eye,
  Sliders,
  AlignJustify,
} from "lucide-react";

interface DeveloperPreferencesSectionProps {
  preferences: DeveloperPreferences;
  onSave: (updated: DeveloperPreferences) => void;
}

export function DeveloperPreferencesSection({
  preferences,
  onSave,
}: DeveloperPreferencesSectionProps) {
  const [localPrefs, setLocalPrefs] =
    React.useState<DeveloperPreferences>(preferences);
  const [savedFeedback, setSavedFeedback] = React.useState(false);

  const handleToggle = (key: keyof DeveloperPreferences) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(localPrefs);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
              ENGINEERING DEFAULTS
            </span>
            {savedFeedback && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-medium animate-in fade-in duration-150">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Preferences saved</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Developer Preferences
          </h2>
          <p className="mt-0.5 text-xs text-zinc-400 font-sans">
            Tailor telemetry inspector behavior, trace granularity, and debugging defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors self-start sm:self-center"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Save preferences</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* 1. Default Execution View */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Default Execution View
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Choose the primary visualization rendered when inspecting single executions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() =>
                setLocalPrefs((prev) => ({
                  ...prev,
                  defaultExecutionView: "intelligence-map",
                }))
              }
              className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all ${
                localPrefs.defaultExecutionView === "intelligence-map"
                  ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                  : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
              }`}
            >
              <div className="flex w-full items-center justify-between mb-1.5">
                <Layers className="h-4 w-4 text-zinc-300" />
                {localPrefs.defaultExecutionView === "intelligence-map" && (
                  <Check className="h-3.5 w-3.5 text-zinc-200" />
                )}
              </div>
              <div>
                <span className="font-semibold text-xs block text-zinc-100">
                  Intelligence Map
                </span>
                <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                  Synthesized 4-region behavioral pipeline with divergence markers
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setLocalPrefs((prev) => ({
                  ...prev,
                  defaultExecutionView: "trace",
                }))
              }
              className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all ${
                localPrefs.defaultExecutionView === "trace"
                  ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                  : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
              }`}
            >
              <div className="flex w-full items-center justify-between mb-1.5">
                <Terminal className="h-4 w-4 text-zinc-300" />
                {localPrefs.defaultExecutionView === "trace" && (
                  <Check className="h-3.5 w-3.5 text-zinc-200" />
                )}
              </div>
              <div>
                <span className="font-semibold text-xs block text-zinc-100">
                  Trace View
                </span>
                <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                  Sequential chronological spans with step parameters and raw traces
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Default Execution Detail */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Default Execution Detail Level
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Determines whether high-volume steps are grouped into compressed regions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() =>
                setLocalPrefs((prev) => ({
                  ...prev,
                  defaultExecutionDetail: "compressed",
                }))
              }
              className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all ${
                localPrefs.defaultExecutionDetail === "compressed"
                  ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                  : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
              }`}
            >
              <div className="flex w-full items-center justify-between mb-1.5">
                <Sliders className="h-4 w-4 text-zinc-300" />
                {localPrefs.defaultExecutionDetail === "compressed" && (
                  <Check className="h-3.5 w-3.5 text-zinc-200" />
                )}
              </div>
              <div>
                <span className="font-semibold text-xs block text-zinc-100">
                  Compressed (Recommended)
                </span>
                <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                  Collapses 100+ nominal steps into regions, highlighting anomalies
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setLocalPrefs((prev) => ({
                  ...prev,
                  defaultExecutionDetail: "expanded",
                }))
              }
              className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all ${
                localPrefs.defaultExecutionDetail === "expanded"
                  ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                  : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
              }`}
            >
              <div className="flex w-full items-center justify-between mb-1.5">
                <AlignJustify className="h-4 w-4 text-zinc-300" />
                {localPrefs.defaultExecutionDetail === "expanded" && (
                  <Check className="h-3.5 w-3.5 text-zinc-200" />
                )}
              </div>
              <div>
                <span className="font-semibold text-xs block text-zinc-100">
                  Expanded
                </span>
                <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                  Always expands all steps and raw parameters by default
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Granular Boolean Preferences */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] divide-y divide-white/[0.05] overflow-hidden">
          {[
            {
              key: "showRawTrace" as const,
              title: "Show raw trace by default",
              desc: "Displays raw JSON payloads alongside synthesized explanations in trace steps.",
            },
            {
              key: "showDiagnosticConfidence" as const,
              title: "Show diagnostic confidence gauge",
              desc: "Renders the SVG confidence gauge and calibration score on failure diagnoses.",
            },
            {
              key: "autoOpenAnomalyContext" as const,
              title: "Auto-open anomaly context",
              desc: "Automatically expands localized 3-step divergence windows (Steps 72-74) on load.",
            },
            {
              key: "compactExecutionRows" as const,
              title: "Use compact execution rows",
              desc: "Decreases row height in the main /dashboard/executions table.",
            },
          ].map((item) => {
            const isChecked = localPrefs[item.key];

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="pr-4">
                  <h4 className="text-xs font-semibold text-zinc-100 font-sans">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                    {item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  onClick={() => handleToggle(item.key)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isChecked ? "bg-sky-600" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isChecked ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
