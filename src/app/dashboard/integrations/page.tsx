"use client";

import * as React from "react";
import Link from "next/link";
import {
  MOCK_AI_PROVIDERS,
  MOCK_INTEGRATION_ACTIVITIES,
  MOCK_INTEGRATIONS,
} from "@/mock";
import {
  AIProvider,
  AIProviderStatus,
  IntegrationActivity,
} from "@/types";
import { ProviderCard } from "@/components/integration/ProviderCard";
import { ConnectedProvidersOverview } from "@/components/integration/ConnectedProvidersOverview";
import {
  ProviderFilterBar,
  ProviderFilterOption,
} from "@/components/integration/ProviderFilterBar";
import { ConnectProviderModal } from "@/components/integration/ConnectProviderModal";
import { ManageProviderModal } from "@/components/integration/ManageProviderModal";
import { ModelAgnosticArchitecture } from "@/components/integration/ModelAgnosticArchitecture";
import { SecurityArchitectureCard } from "@/components/integration/SecurityArchitectureCard";
import { RecentIntegrationActivity } from "@/components/integration/RecentIntegrationActivity";
import {
  Plug,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Code2,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Search,
} from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { useToast } from "@/context/ToastContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function IntegrationsPage() {
  const { mode, triggerRetry } = useDemoState();
  const { toast } = useToast();
  const [providers, setProviders] = React.useState<AIProvider[]>(
    MOCK_AI_PROVIDERS
  );
  const [activities, setActivities] = React.useState<IntegrationActivity[]>(
    MOCK_INTEGRATION_ACTIVITIES
  );

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterOption, setFilterOption] =
    React.useState<ProviderFilterOption>("all");

  // Modals State
  const [connectModalOpen, setConnectModalOpen] = React.useState(false);
  const [targetConnectProvider, setTargetConnectProvider] =
    React.useState<AIProvider | null>(null);

  const [manageModalOpen, setManageModalOpen] = React.useState(false);
  const [targetManageProvider, setTargetManageProvider] =
    React.useState<AIProvider | null>(null);

  // Secondary Collapsible for Framework Telemetry Hooks
  const [showFrameworks, setShowFrameworks] = React.useState(false);
  const [copiedFrameworkId, setCopiedFrameworkId] = React.useState<string | null>(null);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFrameworkId(id);
    setTimeout(() => setCopiedFrameworkId(null), 2000);
  };

  // Filter and search logic
  const filteredProviders = React.useMemo(() => {
    return providers.filter((p) => {
      // Filter status match
      if (filterOption === "connected" && p.status !== "connected") {
        return false;
      }
      if (filterOption === "not_connected" && p.status === "connected") {
        return false;
      }
      if (filterOption === "custom" && !p.isCustom && !p.isLocal) {
        return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesModels = p.models.some((m) =>
          m.name.toLowerCase().includes(q) || m.family.toLowerCase().includes(q)
        );
        const matchesEndpoint = p.baseUrl?.toLowerCase().includes(q) || false;
        return matchesName || matchesDesc || matchesModels || matchesEndpoint;
      }

      return true;
    });
  }, [providers, filterOption, searchQuery]);

  const counts = React.useMemo(() => {
    return {
      all: providers.length,
      connected: providers.filter((p) => p.status === "connected").length,
      not_connected: providers.filter((p) => p.status !== "connected").length,
      custom: providers.filter((p) => p.isCustom || p.isLocal).length,
    };
  }, [providers]);

  // Handler: Open connect modal
  const handleOpenConnect = (provider?: AIProvider) => {
    setTargetConnectProvider(provider || providers[1] || null); // Defaults to OpenAI if unspecified
    setConnectModalOpen(true);
  };

  // Handler: Open manage modal
  const handleOpenManage = (provider: AIProvider) => {
    setTargetManageProvider(provider);
    setManageModalOpen(true);
  };

  // Handler: Provider connected successfully
  const handleConnectSuccess = (updatedProvider: AIProvider) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === updatedProvider.id ? updatedProvider : p))
    );

    toast({
      title: "Provider Connected",
      description: `${updatedProvider.name} verified and linked with workspace.`,
      type: "success",
    });

    // Record activity in state
    const newActivity: IntegrationActivity = {
      id: `act-${Date.now()}`,
      action: "Provider connected",
      providerName: updatedProvider.name,
      providerType: updatedProvider.type,
      details: `Key masked and verified with default model ${
        updatedProvider.models.find((m) => m.id === updatedProvider.defaultModelId)?.name || "selected"
      }`,
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "success",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Handler: Provider updated from manage modal
  const handleUpdateProvider = (updatedProvider: AIProvider) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === updatedProvider.id ? updatedProvider : p))
    );

    toast({
      title: "Integration Updated",
      description: `Default routing model updated for ${updatedProvider.name}.`,
      type: "info",
    });

    const modelName =
      updatedProvider.models.find((m) => m.id === updatedProvider.defaultModelId)?.name ||
      "updated model";

    const newActivity: IntegrationActivity = {
      id: `act-${Date.now()}`,
      action: "Default model changed",
      providerName: updatedProvider.name,
      providerType: updatedProvider.type,
      details: `Active model changed to ${modelName}`,
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "info",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Handler: Provider disconnected
  const handleDisconnectProvider = (providerToDisconnect: AIProvider) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerToDisconnect.id
          ? {
              ...p,
              status: "not_connected" as AIProviderStatus,
              maskedApiKey: undefined,
              lastConfiguredAgo: "Just now",
            }
          : p
      )
    );

    const newActivity: IntegrationActivity = {
      id: `act-${Date.now()}`,
      action: "Provider disconnected",
      providerName: providerToDisconnect.name,
      providerType: providerToDisconnect.type,
      details: "Provider credentials disconnected from active workspace",
      timestampAgo: "Just now",
      timestamp: new Date().toISOString(),
      status: "warning",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // 1. Loading State
  if (mode === "loading") {
    return (
      <div className="space-y-6 w-full pb-16 font-sans">
        <PageSkeleton cardCount={4} showTable={false} />
      </div>
    );
  }

  // 2. Error State
  if (mode === "error") {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto pt-10 pb-16 font-sans">
        <ErrorState
          title="Integrations mesh unavailable"
          message="Black Box could not synchronize provider credentials and health states with workspace Cham Cham."
          details={{
            subsystem: "provider-orchestrator-v1",
            errorCode: "ERR_INTEGRATIONS_MESH_OFFLINE",
            timestamp: new Date().toISOString(),
          }}
          onRetry={triggerRetry}
          retryLabel="Retry Connection"
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
          <h1 className="text-xl font-bold text-zinc-100 font-sans">Integrations</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Connect AI foundation models and observability telemetry bridges.
          </p>
        </div>

        <EmptyState
          icon={Plug}
          title="No integrations connected"
          description="Connect a model provider or configure a custom provider to prepare your workspace."
          primaryAction={{
            label: "Connect Provider",
            onClick: () => {
              setTargetConnectProvider(providers[0]);
              setConnectModalOpen(true);
            },
          }}
          secondaryAction={{
            label: "View API Keys",
            href: "/dashboard/api-keys",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full pb-16 font-sans">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Integrations
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              {counts.connected} of {counts.all} providers active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
            <span>Connect your AI stack</span>
          </h1>

          <p className="mt-1 text-xs text-zinc-400 max-w-2xl leading-relaxed font-sans">
            Connect model providers and configure the AI systems you want to observe through Black Box.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleOpenConnect()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-sans font-medium text-zinc-900 hover:bg-zinc-200 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Provider</span>
          </button>
        </div>
      </div>

      {/* 2. CONNECTED PROVIDERS SECTION */}
      <ConnectedProvidersOverview
        providers={providers}
        onConnectProvider={() => handleOpenConnect()}
        onManageProvider={handleOpenManage}
        onDisconnectProvider={handleDisconnectProvider}
      />

      {/* 3. PROVIDER SEARCH & FILTER BAR */}
      <ProviderFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={filterOption}
        onFilterChange={setFilterOption}
        counts={counts}
      />

      {/* 4. PROVIDER GRID */}
      {filteredProviders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-[#0c1017]/50 p-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-500 mb-3">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            No matching providers found
          </h3>
          <p className="mt-1 text-xs text-zinc-400 font-sans max-w-sm">
            Try adjusting your search query or reset the filter to view all available providers.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterOption("all");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.08] transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onConnect={handleOpenConnect}
              onManage={handleOpenManage}
              onDisconnect={handleDisconnectProvider}
            />
          ))}
        </div>
      )}

      {/* 5. MODEL-AGNOSTIC ARCHITECTURE SECTION */}
      <ModelAgnosticArchitecture />

      {/* 6. PRODUCTION SECURITY ARCHITECTURE */}
      <SecurityArchitectureCard />

      {/* 7. RECENT INTEGRATION ACTIVITY */}
      <RecentIntegrationActivity activities={activities} />

      {/* 8. FRAMEWORK TELEMETRY HOOKS (Preserved Ecosystem Connectors) */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] overflow-hidden">
        <button
          onClick={() => setShowFrameworks((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Code2 className="h-4 w-4 text-zinc-300" />
            <div>
              <span className="text-xs font-semibold text-zinc-200 block uppercase tracking-wider">
                Framework Telemetry Hooks & Runtimes
              </span>
              <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                LangChain, CrewAI, AutoGen, LlamaIndex, and Python SDK flight recorder hooks
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <span>{showFrameworks ? "Collapse" : "Expand Runtimes"}</span>
            {showFrameworks ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </div>
        </button>

        {showFrameworks && (
          <div className="p-4 border-t border-white/[0.06] space-y-4 bg-[#090d14]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MOCK_INTEGRATIONS.map((intg) => (
                <div
                  key={intg.id}
                  className="rounded-lg border border-white/[0.06] bg-[#0e121b] p-3.5 flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">{intg.name}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {intg.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">
                      {intg.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                    <span className="text-[10px] text-zinc-500">
                      {intg.eventsCaptured24h.toLocaleString()} events/24h
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCode(
                          intg.id,
                          `from blackbox import BlackBoxTracer\ntracer = BlackBoxTracer(framework="${intg.type}")`
                        )
                      }
                      className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200"
                    >
                      {copiedFrameworkId === intg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Hook</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONNECT PROVIDER MODAL */}
      <ConnectProviderModal
        isOpen={connectModalOpen}
        provider={targetConnectProvider}
        allProviders={providers}
        onClose={() => setConnectModalOpen(false)}
        onSuccess={handleConnectSuccess}
      />

      {/* MANAGE PROVIDER MODAL */}
      <ManageProviderModal
        isOpen={manageModalOpen}
        provider={targetManageProvider}
        onClose={() => setManageModalOpen(false)}
        onUpdateProvider={handleUpdateProvider}
        onDisconnect={handleDisconnectProvider}
      />
    </div>
  );
}
