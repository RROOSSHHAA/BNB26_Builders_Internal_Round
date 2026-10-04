import {
  UserSettings,
  WorkspaceSettings,
  NotificationSettings,
  AppearanceSettings,
  DeveloperPreferences,
  ActiveSession,
  SecurityEvent,
} from "@/types";

export const MOCK_USER_SETTINGS: UserSettings = {
  name: "Alex Morgan",
  email: "alex@example.com",
  role: "Developer",
};

export const MOCK_WORKSPACE_SETTINGS: WorkspaceSettings = {
  name: "Black Box Labs",
  id: "workspace_demo_01",
  plan: "Developer",
  memberCount: 3,
};

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  failureDetected: true,
  diagnosisCompleted: true,
  replayCompleted: true,
  integrationChanges: false,
  apiKeyActivity: true,
  weeklySummary: true,
};

export const MOCK_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: "dark",
  density: "comfortable",
  executionVisualization: "intelligence-map",
};

export const MOCK_DEVELOPER_PREFERENCES: DeveloperPreferences = {
  defaultExecutionView: "intelligence-map",
  defaultExecutionDetail: "compressed",
  showRawTrace: false,
  showDiagnosticConfidence: true,
  autoOpenAnomalyContext: true,
  compactExecutionRows: false,
};

export const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "sess_curr",
    device: "Current Device",
    browser: "Chrome (Current Session)",
    ipAddress: "192.168.1.104",
    location: "Current browser session",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "sess_dev_box",
    device: "Linux Agent Runtime",
    browser: "Headless Chromium",
    ipAddress: "10.240.0.18",
    location: "Cloud Ingestion Worker",
    lastActive: "18 minutes ago",
    isCurrent: false,
  },
];

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "sec_01",
    action: "Signed in to workspace",
    timestamp: "2026-10-04T00:12:00Z",
    timestampAgo: "2 hours ago",
    ipAddress: "192.168.1.104",
    status: "success",
  },
  {
    id: "sec_02",
    action: "API key created (Production Agent)",
    timestamp: "2026-10-03T18:30:00Z",
    timestampAgo: "Yesterday",
    ipAddress: "192.168.1.104",
    status: "success",
  },
  {
    id: "sec_03",
    action: "Integration settings updated (Google Gemini)",
    timestamp: "2026-10-02T11:45:00Z",
    timestampAgo: "2 days ago",
    ipAddress: "192.168.1.104",
    status: "success",
  },
  {
    id: "sec_04",
    action: "Session token refreshed",
    timestamp: "2026-09-29T14:20:00Z",
    timestampAgo: "5 days ago",
    ipAddress: "192.168.1.104",
    status: "success",
  },
];
