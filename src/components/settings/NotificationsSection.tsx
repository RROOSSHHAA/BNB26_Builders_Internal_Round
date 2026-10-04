"use client";

import * as React from "react";
import { NotificationSettings } from "@/types";
import {
  AlertTriangle,
  Sparkles,
  Play,
  Puzzle,
  KeyRound,
  Mail,
  Check,
  CheckCircle2,
} from "lucide-react";

interface NotificationsSectionProps {
  settings: NotificationSettings;
  onSave: (updated: NotificationSettings) => void;
}

export function NotificationsSection({
  settings,
  onSave,
}: NotificationsSectionProps) {
  const [localSettings, setLocalSettings] =
    React.useState<NotificationSettings>(settings);
  const [savedFeedback, setSavedFeedback] = React.useState(false);

  const toggleOption = (key: keyof NotificationSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const rows = [
    {
      key: "failureDetected" as keyof NotificationSettings,
      title: "Failure detected",
      description: "Notify when an execution is diagnosed as failed.",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      key: "diagnosisCompleted" as keyof NotificationSettings,
      title: "Diagnosis completed",
      description: "Notify when Black Box generates a failure diagnosis.",
      icon: Sparkles,
      color: "text-cyan-400",
    },
    {
      key: "replayCompleted" as keyof NotificationSettings,
      title: "Replay completed",
      description: "Notify when a replay investigation finishes.",
      icon: Play,
      color: "text-purple-400",
    },
    {
      key: "integrationChanges" as keyof NotificationSettings,
      title: "Integration changes",
      description: "Notify when an integration connection changes.",
      icon: Puzzle,
      color: "text-amber-400",
    },
    {
      key: "apiKeyActivity" as keyof NotificationSettings,
      title: "API key activity",
      description: "Notify when an API key is created, rotated, or revoked.",
      icon: KeyRound,
      color: "text-emerald-400",
    },
    {
      key: "weeklySummary" as keyof NotificationSettings,
      title: "Weekly summary",
      description: "Receive a summary of workspace activity.",
      icon: Mail,
      color: "text-zinc-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
              EVENT ALERTS
            </span>
            {savedFeedback && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-medium animate-in fade-in duration-150">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Preferences saved</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">Notifications</h2>
          <p className="mt-0.5 text-xs text-zinc-400 font-sans">
            Choose which Black Box events should require your attention.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors self-start sm:self-center font-sans"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Save preferences</span>
        </button>
      </div>

      {/* Preference Rows */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] divide-y divide-white/[0.05] overflow-hidden font-sans">
        {rows.map((row) => {
          const Icon = row.icon;
          const isChecked = localSettings[row.key];

          return (
            <div
              key={row.key}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3.5 pr-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141822] shrink-0 text-zinc-300">
                  <Icon className="h-4 w-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-100 font-sans">{row.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                    {row.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                onClick={() => toggleOption(row.key)}
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
  );
}
