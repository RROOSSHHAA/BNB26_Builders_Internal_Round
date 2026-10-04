"use client";

import * as React from "react";
import { AppearanceSettings } from "@/types";
import {
  Palette,
  Moon,
  Sun,
  Laptop,
  Check,
  LayoutGrid,
  AlignJustify,
  Layers,
  Terminal,
} from "lucide-react";

interface AppearanceSectionProps {
  settings: AppearanceSettings;
  onChange: (updated: AppearanceSettings) => void;
}

export function AppearanceSection({
  settings,
  onChange,
}: AppearanceSectionProps) {
  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
          USER EXPERIENCE
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white font-sans">Appearance</h2>
        <p className="mt-0.5 text-xs text-zinc-400 font-sans">
          Customize the interface visual theme and execution visualization style.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Picker */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Interface Theme
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Black Box is crafted as a dark-first developer tool.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              {
                id: "dark" as const,
                name: "Dark",
                subtext: "Obsidian flight recorder",
                icon: Moon,
              },
              {
                id: "system" as const,
                name: "System",
                subtext: "Sync with OS theme",
                icon: Laptop,
              },
              {
                id: "light" as const,
                name: "Light",
                subtext: "High-contrast daylight",
                icon: Sun,
              },
            ].map((themeOpt) => {
              const Icon = themeOpt.icon;
              const isSelected = settings.theme === themeOpt.id;

              return (
                <button
                  key={themeOpt.id}
                  type="button"
                  onClick={() => onChange({ ...settings, theme: themeOpt.id })}
                  className={`flex flex-col items-start justify-between rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                      : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-2">
                    <Icon className={`h-4 w-4 ${isSelected ? "text-zinc-200" : "text-zinc-500"}`} />
                    {isSelected && <Check className="h-3.5 w-3.5 text-zinc-200" />}
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-zinc-100">
                      {themeOpt.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                      {themeOpt.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interface Density */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Interface Density
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Control vertical padding and telemetry data row height.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                id: "comfortable" as const,
                name: "Comfortable",
                subtext: "Standard spacing for comprehensive investigations",
                icon: LayoutGrid,
              },
              {
                id: "compact" as const,
                name: "Compact",
                subtext: "High-density data tables for large agent fleets",
                icon: AlignJustify,
              },
            ].map((densityOpt) => {
              const Icon = densityOpt.icon;
              const isSelected = settings.density === densityOpt.id;

              return (
                <button
                  key={densityOpt.id}
                  type="button"
                  onClick={() => onChange({ ...settings, density: densityOpt.id })}
                  className={`flex flex-col items-start justify-between rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                      : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-2">
                    <Icon className={`h-4 w-4 ${isSelected ? "text-zinc-200" : "text-zinc-500"}`} />
                    {isSelected && <Check className="h-3.5 w-3.5 text-zinc-200" />}
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-zinc-100">
                      {densityOpt.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                      {densityOpt.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Execution Visualization Preference */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Execution Visualization Mode
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Default view mode when opening an AI-agent execution trace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                id: "intelligence-map" as const,
                name: "Intelligence Map (Recommended)",
                subtext: "Synthesized 4-region behavioral flow with causal diagnosis markers",
                icon: Layers,
              },
              {
                id: "detailed-trace" as const,
                name: "Detailed Trace",
                subtext: "Linear step-by-step telemetry spans with raw tool inputs and outputs",
                icon: Terminal,
              },
            ].map((visOpt) => {
              const Icon = visOpt.icon;
              const isSelected = settings.executionVisualization === visOpt.id;

              return (
                <button
                  key={visOpt.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...settings, executionVisualization: visOpt.id })
                  }
                  className={`flex flex-col items-start justify-between rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-white/20 bg-[#141822] text-zinc-100 ring-1 ring-white/10 shadow-xs"
                      : "border-white/[0.06] bg-[#090a0f] text-zinc-400 hover:border-white/15 hover:bg-[#141822]/40"
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-2">
                    <Icon className={`h-4 w-4 ${isSelected ? "text-zinc-200" : "text-zinc-500"}`} />
                    {isSelected && <Check className="h-3.5 w-3.5 text-zinc-200" />}
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-zinc-100">
                      {visOpt.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                      {visOpt.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
