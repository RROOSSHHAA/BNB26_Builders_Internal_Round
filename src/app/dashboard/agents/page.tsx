"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_AGENTS } from "@/mock";
import { Agent } from "@/types";
import { AgentCard } from "@/components/agent/AgentCard";
import { AgentFilterBar, AgentFilterState } from "@/components/agent/AgentFilterBar";
import { AddAgentModal } from "@/components/agent/AddAgentModal";
import { ImportAgentModal } from "@/components/agent/ImportAgentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bot, Radio, RotateCcw, FilterX, UploadCloud, Sparkles, Rocket, Play } from "lucide-react";
import { useDemoState } from "@/context/DemoStateContext";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { NoResultsState } from "@/components/ui/no-results-state";

export default function AgentsPage() {
  const { mode, triggerRetry } = useDemoState();
  const [agents, setAgents] = React.useState<Agent[]>(MOCK_AGENTS);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("blackbox_agents") || "[]");
        if (stored.length > 0) {
          setAgents((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = stored.filter((a: Agent) => !existingIds.has(a.id));
            return [...newOnes, ...prev];
          });
        }
      } catch {}
    }
  }, []);

  const [filters, setFilters] = React.useState<AgentFilterState>({
    search: "",
    status: "all",
    model: "all",
    failureRate: "all",
    sortBy: "most-active",
  });

  const handleAddAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      model: "all",
      failureRate: "all",
      sortBy: "most-active",
    });
    setSimulateEmpty(false);
  };

  // Filter and sort agents
  const filteredAgents = React.useMemo(() => {
    if (simulateEmpty) return [];

    let list = [...agents];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (ag) =>
          ag.name.toLowerCase().includes(q) ||
          ag.description.toLowerCase().includes(q) ||
          ag.model.toLowerCase().includes(q) ||
          ag.framework.toLowerCase().includes(q) ||
          ag.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.status !== "all") {
      list = list.filter((ag) => ag.status === filters.status);
    }

    // Model filter
    if (filters.model !== "all") {
      list = list.filter((ag) => ag.model === filters.model);
    }

    // Failure rate filter
    if (filters.failureRate === "low") {
      list = list.filter((ag) => (100 - (ag.successRate || 90)) < 5);
    } else if (filters.failureRate === "moderate") {
      list = list.filter((ag) => {
        const failRate = 100 - (ag.successRate || 90);
        return failRate >= 5 && failRate <= 15;
      });
    } else if (filters.failureRate === "high") {
      list = list.filter((ag) => (100 - (ag.successRate || 90)) > 15);
    }

    // Sort
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case "most-active":
          return b.totalExecutions - a.totalExecutions;
        case "highest-failure":
          return (b.failureCount || 0) - (a.failureCount || 0);
        case "recently-active":
          return new Date(b.lastRunAt).getTime() - new Date(a.lastRunAt).getTime();
        case "recently-created":
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return list;
  }, [agents, filters, simulateEmpty]);

  // Aggregate metrics
  const activeCount = agents.filter(
    (a) => a.status === "active" || a.status === "needs_attention"
  ).length;

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
      <div className="space-y-6 w-full max-w-2xl mx-auto pt-8 pb-16 font-sans">
        <ErrorState
          title="Agent telemetry unavailable"
          message="Black Box could not load agent telemetry profiles from the monitoring cluster."
          details={{
            subsystem: "agent-registry-v1",
            errorCode: "ERR_AGENT_SYNC_FAILURE",
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

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-400 font-semibold">
              AGENT MONITORING
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-[11px] font-sans text-zinc-400">
              Fleet Observability
            </span>
          </div>

          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Your AI agents.
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
            Monitor execution behavior, investigate failures, and understand how your agents
            perform over time.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle empty state view"
          >
            <Radio className="h-3 w-3 text-zinc-400" />
            <span>{simulateEmpty ? "Restore Agents" : "Test Empty State"}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="font-sans font-medium text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="h-3.5 w-3.5 text-cyan-400" />
            <span>Upload Manifest</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="font-sans font-medium text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md border-0 flex items-center gap-1.5"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>Deploy Custom Model</span>
          </Button>
        </div>
      </div>

      {/* Hero Banner: Bring Your Own Agent & Deploy Custom Model */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-950/40 via-[#0e1424] to-indigo-950/30 p-5 sm:p-6 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-3 h-3 text-blue-400" />
                BYOA & Custom Model Runner
              </span>
              <span className="text-xs text-zinc-400">Interactive Testing Environment</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Bring Your Own Agent & Run Live Missions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Connect external AI agents (DeepSeek V3, Llama 3.3, Ollama, Cloud Run or custom endpoints), assign a test task, and inspect blackbox flight telemetry, incident diagnosis, and replay loops in real time.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              className="text-xs border-white/10 hover:bg-white/5 text-zinc-300"
            >
              Upload Manifest
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-white" />
              Deploy Model & Assign Task
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Compact Summary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans select-none">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e121b]">
          <span className="text-xs font-medium text-zinc-400 block">Total Agents</span>
          <span className="text-2xl font-bold text-white mt-1 block">
            {agents.length}
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block">
            Monitored squads
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e121b]">
          <span className="text-xs font-medium text-zinc-400 block">Active Agents</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">
            {activeCount}
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block">
            Handling workloads
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e121b]">
          <span className="text-xs font-medium text-zinc-400 block">Total Executions</span>
          <span className="text-2xl font-bold text-zinc-100 mt-1 block">
            342
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block">
            Telemetry recorded
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e121b]">
          <span className="text-xs font-medium text-zinc-400 block">Failed Executions</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">
            55
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block">
            Divergences flagged
          </span>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <AgentFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalCount={agents.length}
        filteredCount={filteredAgents.length}
      />

      {/* 4. Agents Cards Grid or Empty States */}
      {mode === "empty" || simulateEmpty ? (
        <EmptyState
          icon={Bot}
          title="No agents connected"
          description="Connect your first AI agent to start observing executions."
          primaryAction={{
            label: "Add Agent",
            onClick: () => setIsAddModalOpen(true),
          }}
          secondaryAction={{
            label: "View Integrations",
            href: "/dashboard/integrations",
          }}
        />
      ) : filteredAgents.length === 0 ? (
        <NoResultsState
          title="No matching agents"
          description="Try adjusting your search terms, status selection, or failure rate range."
          onClearFilters={handleResetFilters}
          searchTerm={filters.search}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: Math.min(index * 0.04, 0.3) }}
            >
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </div>
      )}

      {/* 5. Add Agent Modal */}
      <AddAgentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAgent={handleAddAgent}
      />

      {/* 6. Upload / Bring Your Own Agent Modal */}
      <ImportAgentModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAddAgent={handleAddAgent}
      />
    </div>
  );
}
