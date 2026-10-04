"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/context/WorkspaceContext";
import { NotificationsPopover } from "./notifications-popover";
import {
  Menu,
  Search,
  Bell,
  Radio,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const {
    activeWorkspace,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setIsCommandPaletteOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    unreadNotificationCount,
  } = useWorkspace();

  // Dynamic breadcrumb generation based on pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: activeWorkspace.name, href: "/dashboard" }];

    if (segments.length <= 1) {
      crumbs.push({ label: "Overview", href: "/dashboard" });
      return crumbs;
    }

    if (segments[1] === "executions") {
      crumbs.push({ label: "Monitor", href: "/dashboard/executions" });
      crumbs.push({ label: "Executions", href: "/dashboard/executions" });
      if (segments[2]) {
        crumbs.push({ label: `#${segments[2]}`, href: pathname });
      }
    } else if (segments[1] === "agents") {
      crumbs.push({ label: "Monitor", href: "/dashboard/agents" });
      crumbs.push({ label: "Agents", href: "/dashboard/agents" });
      if (segments[2]) {
        crumbs.push({ label: decodeURIComponent(segments[2]), href: pathname });
      }
    } else if (segments[1] === "diagnoses") {
      crumbs.push({ label: "Analysis", href: "/dashboard/diagnoses" });
      crumbs.push({ label: "Diagnoses", href: "/dashboard/diagnoses" });
    } else if (segments[1] === "comparisons") {
      crumbs.push({ label: "Analysis", href: "/dashboard/comparisons" });
      crumbs.push({ label: "Comparisons", href: "/dashboard/comparisons" });
    } else if (segments[1] === "replays") {
      crumbs.push({ label: "Tools", href: "/dashboard/replays" });
      crumbs.push({ label: "Replay", href: "/dashboard/replays" });
    } else if (segments[1] === "alternatives") {
      crumbs.push({ label: "Tools", href: "/dashboard/alternatives" });
      crumbs.push({ label: "Alternatives", href: "/dashboard/alternatives" });
    } else if (segments[1] === "integrations") {
      crumbs.push({ label: "Tools", href: "/dashboard/integrations" });
      crumbs.push({ label: "Integrations", href: "/dashboard/integrations" });
    } else if (segments[1] === "api-keys") {
      crumbs.push({ label: "Tools", href: "/dashboard/api-keys" });
      crumbs.push({ label: "API Keys", href: "/dashboard/api-keys" });
    } else if (segments[1] === "history") {
      crumbs.push({ label: "System", href: "/dashboard/history" });
      crumbs.push({ label: "History", href: "/dashboard/history" });
    } else if (segments[1] === "settings") {
      crumbs.push({ label: "System", href: "/dashboard/settings" });
      crumbs.push({ label: "Settings", href: "/dashboard/settings" });
    } else {
      crumbs.push({ label: segments[1], href: pathname });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/[0.08] bg-[#090a0f]/85 px-4 md:px-6 backdrop-blur-md font-sans">
      {/* Left: Mobile menu toggle + breadcrumbs */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 md:hidden"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Sidebar Toggle Button */}
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          title={isSidebarCollapsed ? "Expand Sidebar (⌘B)" : "Collapse Sidebar (⌘B)"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Breadcrumb Hierarchy */}
        {/* Mobile: Active page label only */}
        <div className="flex sm:hidden items-center text-xs font-sans truncate max-w-[130px]">
          <span className="text-zinc-200 font-medium truncate">
            {breadcrumbs[breadcrumbs.length - 1]?.label}
          </span>
        </div>

        {/* Tablet & Desktop: Full hierarchical breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs font-sans truncate">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={`${crumb.label}-${idx}`}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-zinc-600 shrink-0" />}
              <span
                className={cn(
                  "truncate",
                  idx === breadcrumbs.length - 1
                    ? "text-zinc-200 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search, Notifications, Ingestion Status, User */}
      <div className="flex items-center gap-2 sm:gap-3 relative">
        {/* Global Search Shortcut Button */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-[#11141c] p-1.5 sm:px-2.5 sm:py-1 text-xs text-zinc-400 hover:border-white/20 hover:text-zinc-200 transition-colors"
          title="Search traces and commands (⌘K)"
        >
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden sm:inline-block text-xs font-sans">
            Search traces...
          </span>
          <kbd className="hidden sm:inline-block rounded bg-white/[0.08] px-1.5 py-0.2 text-[10px] font-sans text-zinc-400">
            ⌘K
          </kbd>
        </button>

        {/* Live Ingestion Indicator Pill */}
        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="default" size="sm" className="gap-1.5 text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Recorder
          </Badge>
          <span className="text-[11px] font-mono text-zinc-400 border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 rounded">
            0.4ms lat
          </span>
        </div>

        {/* Notifications Bell Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative rounded-md p-1.5 text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 transition-colors"
            title="Telemetry Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#090a0f]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <NotificationsPopover />
        </div>
      </div>
    </header>
  );
}
