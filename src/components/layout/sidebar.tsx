"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspace, Workspace } from "@/context/WorkspaceContext";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Activity,
  Terminal,
  Layers,
  Sparkles,
  GitCompare,
  Play,
  Puzzle,
  KeyRound,
  Settings,
  ChevronDown,
  ChevronRight,
  Disc,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  ShieldCheck,
  Plus,
  History,
  GitFork,
} from "lucide-react";
import { BlackBoxLogo } from "@/components/ui/BlackBoxLogo";

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ className, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useWorkspace();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = React.useState(false);
  const workspaceDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close workspace dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        workspaceDropdownRef.current &&
        !workspaceDropdownRef.current.contains(e.target as Node)
      ) {
        setIsWorkspaceMenuOpen(false);
      }
    };
    if (isWorkspaceMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isWorkspaceMenuOpen]);

  interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badge?: string | null;
    badgeColor?: string;
  }

  interface NavSection {
    label: string;
    items: NavItem[];
  }

  // Sectioned Navigation Schema strictly adhering to design system hierarchy
  const navigationSections: NavSection[] = [
    {
      label: "OVERVIEW",
      items: [
        {
          title: "Overview",
          href: "/dashboard",
          icon: Activity,
          exact: true,
          badge: null,
        },
      ],
    },
    {
      label: "MONITOR",
      items: [
        {
          title: "Executions",
          href: "/dashboard/executions",
          icon: Terminal,
          badge: "1",
          badgeColor: "bg-white/[0.06] text-zinc-300 border-white/[0.08]",
        },
        {
          title: "Agents",
          href: "/dashboard/agents",
          icon: Layers,
          badge: `${activeWorkspace.agentCount}`,
          badgeColor: "bg-white/[0.06] text-zinc-300 border-white/[0.08]",
        },
      ],
    },
    {
      label: "ANALYSIS",
      items: [
        {
          title: "Diagnoses",
          href: "/dashboard/diagnoses",
          icon: Sparkles,
          badge: "50",
          badgeColor: "bg-white/[0.06] text-zinc-300 border-white/[0.08]",
        },
        {
          title: "Comparisons",
          href: "/dashboard/comparisons",
          icon: GitCompare,
          badge: null,
        },
      ],
    },
    {
      label: "TOOLS",
      items: [
        {
          title: "Replay",
          href: "/dashboard/replays",
          icon: Play,
          badge: null,
        },
        {
          title: "Alternatives",
          href: "/dashboard/alternatives",
          icon: GitFork,
          badge: null,
        },
        {
          title: "Integrations",
          href: "/dashboard/integrations",
          icon: Puzzle,
          badge: "5",
          badgeColor: "bg-white/[0.06] text-zinc-300 border-white/[0.08]",
        },
        {
          title: "API Keys",
          href: "/dashboard/api-keys",
          icon: KeyRound,
          badge: null,
        },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        {
          title: "History",
          href: "/dashboard/history",
          icon: History,
          badge: null,
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  const handleSelectWorkspace = (ws: Workspace) => {
    setActiveWorkspace(ws);
    setIsWorkspaceMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0b0e14] border-r border-white/[0.08] transition-all duration-200 font-sans",
          // Width based on collapsed state on desktop
          isSidebarCollapsed ? "w-18" : "w-64",
          // Mobile visibility
          isMobileOpen ? "translate-x-0 !w-64" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Top Header: Logo + Subtitle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 overflow-hidden group select-none"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-white shadow-xs group-hover:border-white/20 transition-colors p-1">
              <BlackBoxLogo size={20} />
            </div>
            {(!isSidebarCollapsed || isMobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-sans text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  BLACK BOX
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-sans font-medium text-zinc-400 truncate">
                  AI Execution Intelligence
                </span>
              </div>
            )}
          </Link>

          {/* Desktop/Tablet Collapse Trigger */}
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            title="Toggle Sidebar (⌘B)"
            className="hidden md:flex p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Workspace Selector (Near top of sidebar) */}
        {(!isSidebarCollapsed || isMobileOpen) ? (
          <div className="px-3 pt-3 pb-1" ref={workspaceDropdownRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#121620] border border-white/[0.08] hover:border-white/20 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/[0.08] border border-white/10 text-zinc-200 font-sans text-xs font-semibold">
                    {activeWorkspace.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] font-sans text-zinc-400 font-medium uppercase tracking-wider">
                      Workspace
                    </span>
                    <span className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white">
                      {activeWorkspace.name}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-500 transition-transform duration-150 shrink-0",
                    isWorkspaceMenuOpen && "rotate-180 text-white"
                  )}
                />
              </button>

              {/* Workspace Selector Dropdown Menu */}
              {isWorkspaceMenuOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 rounded-lg border border-white/10 bg-[#0e121b] shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100 font-sans">
                  <div className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider text-zinc-400">
                    Switch Workspace
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => handleSelectWorkspace(ws)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors text-left",
                        activeWorkspace.id === ws.id
                          ? "bg-white/[0.08] text-white border border-white/10"
                          : "text-zinc-300 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex flex-col truncate">
                        <span className="font-semibold truncate">{ws.name}</span>
                        <span className="text-[10px] text-zinc-400">
                          {ws.environment} • {ws.agentCount} Agents
                        </span>
                      </div>
                      {activeWorkspace.id === ws.id && (
                        <Check className="h-3.5 w-3.5 text-white shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="pt-1 mt-1 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWorkspaceMenuOpen(false);
                        alert("Workspace creation is ready for next steps.");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-sans text-zinc-300 hover:bg-white/[0.06] transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Create New Workspace</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Compact Workspace Icon */
          <div className="py-3 flex justify-center">
            <Tooltip content={`Workspace: ${activeWorkspace.name} (${activeWorkspace.environment})`}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] border border-white/10 text-white font-sans text-xs font-semibold cursor-pointer">
                {activeWorkspace.name.substring(0, 2).toUpperCase()}
              </div>
            </Tooltip>
          </div>
        )}

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 font-sans">
          {navigationSections.map((section) => (
            <div key={section.label} className="space-y-0.5">
              {(!isSidebarCollapsed || isMobileOpen) ? (
                <div className="px-3 pb-1.5 pt-1 text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">
                  {section.label}
                </div>
              ) : (
                <div className="my-1 border-t border-white/[0.04]" />
              )}

              {section.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                const Icon = item.icon;

                const linkContent = (
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold tracking-tight transition-all duration-150 border font-sans",
                      isActive
                        ? "bg-white/[0.1] text-white border-white/15 shadow-xs"
                        : "text-zinc-300 border-transparent hover:text-white hover:bg-white/[0.05]",
                      isSidebarCollapsed && !isMobileOpen && "justify-center px-0 py-2.5"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-zinc-400 group-hover:text-white"
                        )}
                      />
                      {(!isSidebarCollapsed || isMobileOpen) && (
                        <span className="truncate font-bold tracking-tight text-inherit">
                          {item.title}
                        </span>
                      )}
                    </div>

                    {(!isSidebarCollapsed || isMobileOpen) && item.badge && (
                      <span
                        className={cn(
                          "text-[10px] font-sans font-bold px-1.5 py-0.5 rounded border shrink-0",
                          item.badgeColor || "bg-white/[0.06] text-zinc-300 border-white/[0.08]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );

                if (isSidebarCollapsed && !isMobileOpen) {
                  return (
                    <Tooltip key={item.href} content={item.title} position="right">
                      {linkContent}
                    </Tooltip>
                  );
                }

                return <div key={item.href}>{linkContent}</div>;
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
