"use client";

import * as React from "react";
import {
  User,
  Layers,
  Palette,
  Bell,
  Shield,
  Code2,
} from "lucide-react";

export type SettingsTabId =
  | "profile"
  | "workspace"
  | "appearance"
  | "notifications"
  | "security"
  | "developer";

interface SettingsNavProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  const tabs = [
    { id: "profile" as SettingsTabId, label: "Profile", icon: User },
    { id: "workspace" as SettingsTabId, label: "Workspace", icon: Layers },
    { id: "appearance" as SettingsTabId, label: "Appearance", icon: Palette },
    { id: "notifications" as SettingsTabId, label: "Notifications", icon: Bell },
    { id: "security" as SettingsTabId, label: "Security", icon: Shield },
    { id: "developer" as SettingsTabId, label: "Developer Preferences", icon: Code2 },
  ];

  return (
    <div>
      {/* Desktop Vertical Menu */}
      <nav className="hidden md:flex flex-col gap-1.5 font-sans">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-bold tracking-tight transition-all ${
                isActive
                  ? "border border-white/[0.12] bg-[#141822] text-white shadow-xs"
                  : "border border-transparent text-zinc-300 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-white" : "text-zinc-400"
                }`}
              />
              <span className="truncate font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile / Tablet Horizontal Scrollable Tabs */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 font-sans border-b border-white/[0.06]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 whitespace-nowrap text-xs font-bold tracking-tight transition-all ${
                isActive
                  ? "border border-white/[0.14] bg-[#141822] text-white"
                  : "border border-white/[0.06] bg-[#0e121b] text-zinc-300 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
