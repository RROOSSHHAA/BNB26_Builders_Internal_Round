"use client";

import * as React from "react";
import {
  MOCK_USER_SETTINGS,
  MOCK_WORKSPACE_SETTINGS,
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_APPEARANCE_SETTINGS,
  MOCK_DEVELOPER_PREFERENCES,
  MOCK_ACTIVE_SESSIONS,
  MOCK_SECURITY_EVENTS,
} from "@/mock";
import {
  UserSettings,
  WorkspaceSettings,
  NotificationSettings,
  AppearanceSettings,
  DeveloperPreferences,
  ActiveSession,
  SecurityEvent,
} from "@/types";
import { SettingsNav, SettingsTabId } from "@/components/settings/SettingsNav";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { WorkspaceSection } from "@/components/settings/WorkspaceSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { DeveloperPreferencesSection } from "@/components/settings/DeveloperPreferencesSection";
import { ManageWorkspaceModal } from "@/components/settings/ManageWorkspaceModal";
import { ActiveSessionsDrawer } from "@/components/settings/ActiveSessionsDrawer";
import { DeleteWorkspaceModal } from "@/components/settings/DeleteWorkspaceModal";
import {
  Settings,
  CheckCircle2,
  Sparkles,
  Info,
  LogOut,
  X,
} from "lucide-react";

import { useDemoState } from "@/context/DemoStateContext";
import { useToast } from "@/context/ToastContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";

export default function SettingsPage() {
  const { mode, triggerRetry } = useDemoState();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("profile");

  // Local settings state
  const [userSettings, setUserSettings] =
    React.useState<UserSettings>(MOCK_USER_SETTINGS);
  const [workspaceSettings, setWorkspaceSettings] =
    React.useState<WorkspaceSettings>(MOCK_WORKSPACE_SETTINGS);
  const [notificationSettings, setNotificationSettings] =
    React.useState<NotificationSettings>(MOCK_NOTIFICATION_SETTINGS);
  const [appearanceSettings, setAppearanceSettings] =
    React.useState<AppearanceSettings>(MOCK_APPEARANCE_SETTINGS);
  const [developerPrefs, setDeveloperPrefs] =
    React.useState<DeveloperPreferences>(MOCK_DEVELOPER_PREFERENCES);
  const [sessions, setSessions] =
    React.useState<ActiveSession[]>(MOCK_ACTIVE_SESSIONS);

  // Global save indicator
  const [globalStatus, setGlobalStatus] = React.useState<string | null>(null);

  // Modals & Drawers state
  const [isManageWorkspaceOpen, setIsManageWorkspaceOpen] =
    React.useState(false);
  const [isActiveSessionsOpen, setIsActiveSessionsOpen] = React.useState(false);
  const [isDeleteWorkspaceOpen, setIsDeleteWorkspaceOpen] =
    React.useState(false);
  const [signOutNotice, setSignOutNotice] = React.useState(false);

  // 1. Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <PageSkeleton cardCount={0} showTable={false} />
      </div>
    );
  }

  // 2. Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-10 pb-16 font-sans">
        <ErrorState
          title="Settings synchronization failed"
          message="Black Box could not load account configuration and workspace security preferences."
          details={{
            subsystem: "settings-sync-v1",
            errorCode: "ERR_SETTINGS_SCHEMA_MISMATCH",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Sync"
          secondaryAction={{
            label: "Return to Overview",
            href: "/dashboard",
          }}
        />
      </div>
    );
  }

  const showStatus = (msg: string) => {
    setGlobalStatus(msg);
    toast({
      title: "Settings Saved",
      description: "Preferences updated and synchronized with Cham Cham workspace.",
      type: "success",
    });
    setTimeout(() => setGlobalStatus(null), 2500);
  };

  const handleSaveProfile = (updated: UserSettings) => {
    setUserSettings(updated);
    showStatus("Changes saved");
  };

  const handleUpdateWorkspace = (updated: WorkspaceSettings) => {
    setWorkspaceSettings(updated);
    showStatus("Changes saved");
  };

  const handleSaveNotifications = (updated: NotificationSettings) => {
    setNotificationSettings(updated);
    showStatus("Changes saved");
  };

  const handleAppearanceChange = (updated: AppearanceSettings) => {
    setAppearanceSettings(updated);
    showStatus("Changes saved");
  };

  const handleSaveDeveloperPrefs = (updated: DeveloperPreferences) => {
    setDeveloperPrefs(updated);
    showStatus("Changes saved");
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showStatus("Session terminated");
  };

  const handleSignOutAll = () => {
    setSignOutNotice(true);
    setTimeout(() => setSignOutNotice(false), 3000);
  };

  const handleConfirmDeleteWorkspace = () => {
    setIsDeleteWorkspaceOpen(false);
    showStatus("Workspace deletion simulation confirmed (frontend-only)");
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-16 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Settings
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              Workspace & Personal Preferences
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
            <span>Settings</span>
          </h1>

          <p className="mt-1 text-xs text-zinc-400 max-w-2xl leading-relaxed font-sans">
            Manage your account credentials, workspace defaults, telemetry alerts, and debugging visual preferences.
          </p>
        </div>

        {/* Global Save Status Feedback */}
        {globalStatus && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 font-medium animate-in fade-in duration-150 shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{globalStatus}</span>
          </div>
        )}
      </div>

      {/* Simulated Sign Out Notice */}
      {signOutNotice && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300 flex items-center justify-between font-sans animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Simulated: All background sessions terminated. In a production environment, you would be redirected to the sign-in portal.
            </span>
          </div>
          <button
            onClick={() => setSignOutNotice(false)}
            className="text-amber-400 hover:text-amber-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Two-Column Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Settings Navigation */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-20">
            <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {/* Right Column: Active Settings Content */}
        <div className="md:col-span-8 lg:col-span-9">
          {activeTab === "profile" && (
            <ProfileSection
              user={userSettings}
              onSaveUser={handleSaveProfile}
            />
          )}

          {activeTab === "workspace" && (
            <WorkspaceSection
              workspace={workspaceSettings}
              onOpenManage={() => setIsManageWorkspaceOpen(true)}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceSection
              settings={appearanceSettings}
              onChange={handleAppearanceChange}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsSection
              settings={notificationSettings}
              onSave={handleSaveNotifications}
            />
          )}

          {activeTab === "security" && (
            <SecuritySection
              sessions={sessions}
              securityEvents={MOCK_SECURITY_EVENTS}
              onOpenSessions={() => setIsActiveSessionsOpen(true)}
              onOpenDeleteWorkspace={() => setIsDeleteWorkspaceOpen(true)}
              onSignOutAll={handleSignOutAll}
            />
          )}

          {activeTab === "developer" && (
            <DeveloperPreferencesSection
              preferences={developerPrefs}
              onSave={handleSaveDeveloperPrefs}
            />
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      <ManageWorkspaceModal
        isOpen={isManageWorkspaceOpen}
        workspace={workspaceSettings}
        onClose={() => setIsManageWorkspaceOpen(false)}
        onUpdate={handleUpdateWorkspace}
      />

      <ActiveSessionsDrawer
        isOpen={isActiveSessionsOpen}
        sessions={sessions}
        onClose={() => setIsActiveSessionsOpen(false)}
        onRevokeSession={handleRevokeSession}
      />

      <DeleteWorkspaceModal
        isOpen={isDeleteWorkspaceOpen}
        workspaceName={workspaceSettings.name}
        onClose={() => setIsDeleteWorkspaceOpen(false)}
        onConfirmDelete={handleConfirmDeleteWorkspace}
      />
    </div>
  );
}
