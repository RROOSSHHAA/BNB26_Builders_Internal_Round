"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  Search,
  Terminal,
  Layers,
  Sparkles,
  GitCompare,
  Play,
  Puzzle,
  KeyRound,
  Settings,
  Activity,
  ArrowRight,
  Disc,
  X,
} from "lucide-react";
import { BlackBoxLogo } from "@/components/ui/BlackBoxLogo";

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
  } = useWorkspace();

  const [query, setQuery] = React.useState("");

  const prevIsOpenRef = React.useRef(isCommandPaletteOpen);
  if (isCommandPaletteOpen && !prevIsOpenRef.current) {
    prevIsOpenRef.current = true;
    setQuery("");
  } else if (!isCommandPaletteOpen && prevIsOpenRef.current) {
    prevIsOpenRef.current = false;
  }

  if (!isCommandPaletteOpen) return null;

  const navigationCommands = [
    {
      group: "Navigation",
      title: "Overview",
      description: "Flight deck summary & telemetry statistics",
      href: "/dashboard",
      icon: Activity,
    },
    {
      group: "Navigation",
      title: "Executions Monitor",
      description: "All captured agent traces & compressed region previews",
      href: "/dashboard/executions",
      icon: Terminal,
    },
    {
      group: "Navigation",
      title: "Inspect Flagship Anomaly (Tesla 127-Step Run)",
      description: "Root cause diagnosis: Schema mismatch to temporal hallucination",
      href: "/dashboard/executions/exec_tesla_variance_01",
      icon: Sparkles,
      badge: "Critical Anomaly",
    },
    {
      group: "Navigation",
      title: "Agent Registry",
      description: "Autonomous squads, models, and anomaly rates",
      href: "/dashboard/agents",
      icon: Layers,
    },
    {
      group: "Navigation",
      title: "Diagnoses",
      description: "AI-powered automated failure diagnosis classification",
      href: "/dashboard/diagnoses",
      icon: Sparkles,
    },
    {
      group: "Navigation",
      title: "Comparisons",
      description: "Trace diff engine & baseline vs candidate fixes",
      href: "/dashboard/comparisons",
      icon: GitCompare,
    },
    {
      group: "Navigation",
      title: "Replays & Simulator",
      description: "Fork execution traces and test parameter adjustments",
      href: "/dashboard/replays",
      icon: Play,
    },
    {
      group: "Navigation",
      title: "Framework Integrations",
      description: "LangChain, CrewAI, AutoGen, LlamaIndex tracers",
      href: "/dashboard/integrations",
      icon: Puzzle,
    },
    {
      group: "Navigation",
      title: "Ingestion API Keys",
      description: "Credentials, bearer tokens, and telemetry scopes",
      href: "/dashboard/api-keys",
      icon: KeyRound,
    },
    {
      group: "Navigation",
      title: "Platform Settings",
      description: "Retention policies, compression thresholds",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const filteredCommands = navigationCommands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsCommandPaletteOpen(false);
    router.push(href);
  };

  const handleSwitchWorkspace = (workspace: (typeof workspaces)[0]) => {
    setActiveWorkspace(workspace);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-150"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-[#0c1017] shadow-2xl shadow-black overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#090d14]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, page, trace ID, or workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded bg-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Workspaces Matching */}
          {filteredWorkspaces.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Workspaces
              </div>
              {filteredWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleSwitchWorkspace(ws)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                    activeWorkspace.id === ws.id
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-zinc-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                      <BlackBoxLogo size={14} />
                    </div>
                    <div>
                      <span className="font-semibold text-white">{ws.name}</span>
                      <span className="text-[10px] text-zinc-400 ml-2 font-mono">
                        ({ws.environment} • {ws.agentCount} Agents)
                      </span>
                    </div>
                  </div>
                  {activeWorkspace.id === ws.id && (
                    <span className="text-[10px] font-sans font-medium text-emerald-400">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Navigation Commands */}
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Navigation & Traces
              </div>
              {filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.title}
                    onClick={() => handleSelect(cmd.href)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs group hover:bg-[#141b27] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-white/[0.05] text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            {cmd.title}
                          </span>
                          {cmd.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                              {cmd.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          {cmd.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No matching commands or telemetry traces found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-[#07090e] text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>Navigation: [↑↓] to browse</span>
            <span>[Enter] to select</span>
          </div>
          <span>Black Box Quick Switcher</span>
        </div>
      </div>
    </div>
  );
}
