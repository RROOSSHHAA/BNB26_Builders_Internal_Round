"use client";

import * as React from "react";
import Link from "next/link";
import {
  MOCK_API_KEYS,
  MOCK_API_KEY_ACTIVITIES,
} from "@/mock";
import {
  ApiKey,
  ApiKeyActivityItem,
  ApiKeyStatus,
  ApiKeyEnvironment,
} from "@/types";
import { ApiKeyInfoCard } from "@/components/apiKey/ApiKeyInfoCard";
import { ApiKeyTable } from "@/components/apiKey/ApiKeyTable";
import { CreateApiKeyModal } from "@/components/apiKey/CreateApiKeyModal";
import { ApiKeyDetailDrawer } from "@/components/apiKey/ApiKeyDetailDrawer";
import { RevokeKeyModal } from "@/components/apiKey/RevokeKeyModal";
import { RotateKeyModal } from "@/components/apiKey/RotateKeyModal";
import { ApiKeySecuritySection } from "@/components/apiKey/ApiKeySecuritySection";
import { ApiKeyActivitySection } from "@/components/apiKey/ApiKeyActivitySection";
import { ApiKeyEmptyState } from "@/components/apiKey/ApiKeyEmptyState";
import {
  KeyRound,
  Plus,
  ShieldCheck,
  Search,
  X,
  RotateCcw,
  EyeOff,
  Filter,
  Check,
  Copy,
} from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { useToast } from "@/context/ToastContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { NoResultsState } from "@/components/ui/no-results-state";

export default function ApiKeysPage() {
  const { mode, triggerRetry } = useDemoState();
  const { toast } = useToast();
  const [keys, setKeys] = React.useState<ApiKey[]>(MOCK_API_KEYS);
  const [activities, setActivities] = React.useState<ApiKeyActivityItem[]>(
    MOCK_API_KEY_ACTIVITIES
  );

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | ApiKeyStatus>("all");
  const [envFilter, setEnvFilter] = React.useState<"all" | ApiKeyEnvironment>("all");
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  // Modals & Drawers State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [detailKey, setDetailKey] = React.useState<ApiKey | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [revokeKeyTarget, setRevokeKeyTarget] = React.useState<ApiKey | null>(null);
  const [isRevokeOpen, setIsRevokeOpen] = React.useState(false);
  const [rotateKeyTarget, setRotateKeyTarget] = React.useState<ApiKey | null>(null);
  const [isRotateOpen, setIsRotateOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyKey = (key: ApiKey) => {
    navigator.clipboard.writeText(key.keyPreview || key.prefix);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);

    toast({
      title: "API Key Copied",
      description: `Preview for "${key.name}" copied to clipboard.`,
      type: "info",
    });

    // Record activity
    const newAct: ApiKeyActivityItem = {
      id: `act-${Date.now()}`,
      action: "API key copied",
      keyName: key.name,
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "info",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Handler: Key Created
  const handleCreatedKey = (newKey: ApiKey) => {
    setKeys((prev) => [newKey, ...prev]);
    setSimulateEmpty(false);

    toast({
      title: "API Key Created",
      description: `New key "${newKey.name}" generated successfully.`,
      type: "success",
    });

    // Record activity
    const newAct: ApiKeyActivityItem = {
      id: `act-${Date.now()}`,
      action: "API key created",
      keyName: newKey.name,
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "success",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Handler: Revoke Confirm
  const handleConfirmRevoke = (keyToRevoke: ApiKey) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyToRevoke.id ? { ...k, status: "revoked" as ApiKeyStatus } : k
      )
    );

    if (detailKey?.id === keyToRevoke.id) {
      setDetailKey((prev) => (prev ? { ...prev, status: "revoked" } : null));
    }

    toast({
      title: "API Key Revoked",
      description: `Key "${keyToRevoke.name}" has been permanently revoked.`,
      type: "warning",
    });

    const newAct: ApiKeyActivityItem = {
      id: `act-${Date.now()}`,
      action: "API key revoked",
      keyName: keyToRevoke.name,
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "warning",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Handler: Rotate Confirm
  const handleConfirmRotate = (
    keyToRotate: ApiKey,
    newMockSecret: string,
    newMaskedPreview: string
  ) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyToRotate.id
          ? {
              ...k,
              prefix: newMaskedPreview,
              keyPreview: newMaskedPreview,
              fullMockKey: newMockSecret,
              lastUsedText: "Just now",
              createdAtText: "Just now",
            }
          : k
      )
    );

    toast({
      title: "API Key Rotated",
      description: `Key "${keyToRotate.name}" rotated with new active secret.`,
      type: "success",
    });

    if (detailKey?.id === keyToRotate.id) {
      setDetailKey((prev) =>
        prev
          ? {
              ...prev,
              prefix: newMaskedPreview,
              keyPreview: newMaskedPreview,
              fullMockKey: newMockSecret,
              lastUsedText: "Just now",
            }
          : null
      );
    }

    const newAct: ApiKeyActivityItem = {
      id: `act-${Date.now()}`,
      action: "API key rotated",
      keyName: keyToRotate.name,
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "warning",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Filtered keys
  const filteredKeys = React.useMemo(() => {
    if (simulateEmpty) return [];

    return keys.filter((k) => {
      if (statusFilter !== "all" && k.status !== statusFilter) {
        return false;
      }
      if (envFilter !== "all" && k.environment !== envFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = k.name.toLowerCase().includes(q);
        const matchesPreview = (k.keyPreview || k.prefix).toLowerCase().includes(q);
        const matchesScopes = (k.scopes || []).some((s) =>
          s.toLowerCase().includes(q)
        );
        return matchesName || matchesPreview || matchesScopes;
      }
      return true;
    });
  }, [keys, statusFilter, envFilter, searchQuery, simulateEmpty]);

  const activeKeyCount = keys.filter((k) => k.status === "active").length;

  // 1. Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <PageSkeleton cardCount={3} showTable={true} />
      </div>
    );
  }

  // 2. Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-10 pb-16 font-sans">
        <ErrorState
          title="API key service unavailable"
          message="Black Box could not load API keys from the secure credential vault."
          details={{
            subsystem: "credential-vault-hsm",
            errorCode: "ERR_KEY_STORE_LOCKED",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Vault"
          secondaryAction={{
            label: "Return to Overview",
            href: "/dashboard",
          }}
        />
      </div>
    );
  }

  // 3. Empty State
  if (mode === "empty") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-8 pb-16 font-sans">
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Black Box API Keys</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Manage ingest credentials used by external runtimes to send execution traces.
          </p>
        </div>

        <EmptyState
          icon={KeyRound}
          title="No API keys yet"
          description="Create an API key to connect external applications and AI agents to Black Box."
          primaryAction={{
            label: "Create API Key",
            onClick: () => setIsCreateOpen(true),
          }}
          secondaryAction={{
            label: "View Integrations",
            href: "/dashboard/integrations",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16 font-sans">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              API Keys
            </span>
            <span className="text-xs text-zinc-400 font-sans flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{activeKeyCount} active credentials</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
            <span>API Keys</span>
          </h1>

          <p className="mt-1 text-xs text-zinc-400 max-w-2xl leading-relaxed font-sans">
            Connect your applications and AI agents to Black Box.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setSimulateEmpty((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-sans font-medium transition-all ${
              simulateEmpty
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-[#0e121b] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.14]"
            }`}
            title="Toggle empty state view for testing"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {simulateEmpty ? "Exit Demo" : "Simulate Empty"}
            </span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-sans font-medium text-zinc-900 hover:bg-zinc-200 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create API Key</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN INFORMATION CARD & ARCHITECTURE HINT */}
      <ApiKeyInfoCard />

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keys by name, prefix, or scopes..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#0e121b] pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-white/20 focus:outline-hidden font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0c1017] p-1 text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-white/[0.1] text-zinc-100 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All ({keys.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
              statusFilter === "active"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Active ({keys.filter((k) => k.status === "active").length})
          </button>
          <button
            onClick={() => setStatusFilter("revoked")}
            className={`rounded-md px-2.5 py-1 transition-all whitespace-nowrap ${
              statusFilter === "revoked"
                ? "bg-red-500/20 text-red-300 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Revoked ({keys.filter((k) => k.status === "revoked").length})
          </button>
        </div>
      </div>

      {/* 4. API KEY LIST / EMPTY STATE */}
      {filteredKeys.length === 0 ? (
        <ApiKeyEmptyState
          onCreateKey={() => setIsCreateOpen(true)}
          onResetDemo={() => {
            setSimulateEmpty(false);
            setKeys(MOCK_API_KEYS);
            setSearchQuery("");
            setStatusFilter("all");
            setEnvFilter("all");
          }}
        />
      ) : (
        <ApiKeyTable
          keys={filteredKeys}
          onViewDetails={(key) => {
            setDetailKey(key);
            setIsDetailOpen(true);
          }}
          onCopyKey={handleCopyKey}
          onRotateKey={(key) => {
            setRotateKeyTarget(key);
            setIsRotateOpen(true);
          }}
          onRevokeKey={(key) => {
            setRevokeKeyTarget(key);
            setIsRevokeOpen(true);
          }}
          copiedId={copiedId}
        />
      )}

      {/* 5. SECURITY GUIDANCE SECTION */}
      <ApiKeySecuritySection />

      {/* 6. RECENT API KEY ACTIVITY */}
      <ApiKeyActivitySection activities={activities} />

      {/* MODALS & DRAWERS */}
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreatedKey}
      />

      <ApiKeyDetailDrawer
        isOpen={isDetailOpen}
        apiKey={detailKey}
        onClose={() => setIsDetailOpen(false)}
        onRotateKey={(key) => {
          setIsDetailOpen(false);
          setRotateKeyTarget(key);
          setIsRotateOpen(true);
        }}
        onRevokeKey={(key) => {
          setIsDetailOpen(false);
          setRevokeKeyTarget(key);
          setIsRevokeOpen(true);
        }}
      />

      <RevokeKeyModal
        isOpen={isRevokeOpen}
        apiKey={revokeKeyTarget}
        onClose={() => setIsRevokeOpen(false)}
        onConfirmRevoke={handleConfirmRevoke}
      />

      <RotateKeyModal
        isOpen={isRotateOpen}
        apiKey={rotateKeyTarget}
        onClose={() => setIsRotateOpen(false)}
        onConfirmRotate={handleConfirmRotate}
      />
    </div>
  );
}
