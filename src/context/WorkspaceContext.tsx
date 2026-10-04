"use client";

import * as React from "react";

export interface Workspace {
  id: string;
  name: string;
  environment: "Production" | "Staging" | "Development";
  agentCount: number;
  activeAnomalies: number;
  region: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "critical" | "warning" | "info" | "success";
  link?: string;
  read: boolean;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (workspace: Workspace) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  notifications: PlatformNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationCount: number;
}

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws_cham_cham",
    name: "Cham Cham",
    environment: "Production",
    agentCount: 12,
    activeAnomalies: 1,
    region: "us-east-1",
  },
  {
    id: "ws_auto_lab",
    name: "Autonomous Intelligence Lab",
    environment: "Staging",
    agentCount: 6,
    activeAnomalies: 0,
    region: "us-west-2",
  },
  {
    id: "ws_fin_synth",
    name: "AlphaQuery Financial Mesh",
    environment: "Production",
    agentCount: 4,
    activeAnomalies: 1,
    region: "eu-central-1",
  },
];

const MOCK_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: "notif_01",
    title: "Critical Anomaly Detected",
    message: "AlphaQuery run #exec_tesla_variance_01 diverged at Step 62 (Schema Mismatch).",
    timestamp: "2 minutes ago",
    type: "critical",
    link: "/dashboard/executions/exec_tesla_variance_01",
    read: false,
  },
  {
    id: "notif_02",
    title: "Replay Simulation Verified",
    message: "Simulation #rpl_tsla_fix_v1 successfully bypassed temporal hallucination (-2.6s latency).",
    timestamp: "14 minutes ago",
    type: "success",
    link: "/dashboard/replays",
    read: false,
  },
  {
    id: "notif_03",
    title: "OpenTelemetry Socket Synchronized",
    message: "18,420 events captured in the last 24h across 5 active framework integrations.",
    timestamp: "1 hour ago",
    type: "info",
    link: "/dashboard/integrations",
    read: true,
  },
];

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces] = React.useState<Workspace[]>(MOCK_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace>(MOCK_WORKSPACES[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState<boolean>(false);
  const [notifications, setNotifications] = React.useState<PlatformNotification[]>(MOCK_NOTIFICATIONS);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search, Cmd+B / Ctrl+B for sidebar toggle)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationCount,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
