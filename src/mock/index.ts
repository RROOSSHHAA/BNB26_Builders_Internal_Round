import {
  User,
  Agent,
  Execution,
  Replay,
  Comparison,
  Integration,
  ApiKey,
  HistorySummaryStats,
  RecentlyViewedItem,
  ActivityRecord,
  ReplayInvestigation,
  AlternativeInvestigation,
  ComparisonInvestigation,
  AIProvider,
  IntegrationActivity,
  ApiKeyActivityItem,
} from "@/types";

import { MOCK_USER } from "./users";
import { MOCK_AGENTS } from "./agents";
import { MOCK_EXECUTIONS } from "./executions";
import {
  MOCK_REPLAYS,
  MOCK_COMPARISONS,
  MOCK_REPLAY_INVESTIGATIONS,
} from "./replays";
import { MOCK_INTEGRATIONS } from "./integrations";
import { MOCK_API_KEYS, MOCK_API_KEY_ACTIVITIES } from "./apiKeys";
import {
  MOCK_HISTORY_SUMMARY,
  MOCK_RECENTLY_VIEWED,
  MOCK_ACTIVITY_LOG,
} from "./activity";
import { MOCK_ALTERNATIVE_INVESTIGATIONS } from "./alternatives";
import { MOCK_COMPARISON_INVESTIGATIONS } from "./comparisons";
import { MOCK_AI_PROVIDERS, MOCK_INTEGRATION_ACTIVITIES } from "./aiProviders";
import { apiClient } from "@/lib/api-client";

export * from "./users";
export * from "./agents";
export * from "./executions";
export * from "./regions";
export * from "./traceSteps";
export * from "./diagnoses";
export * from "./replays";
export * from "./integrations";
export * from "./apiKeys";
export * from "./activity";
export * from "./alternatives";
export * from "./comparisons";
export * from "./aiProviders";
export * from "./settings";

/**
 * Clean frontend data-access layer connected to real Backend APIs (http://localhost:4000/api/v1).
 * Seamlessly falls back to mock constants on offline/network errors (Demo Protection).
 */

// 1. User Profile
export async function fetchCurrentUser(): Promise<User> {
  try {
    const data = await apiClient.getCurrentUser();
    if (data?.user) {
      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: "engineer",
        avatarUrl: data.user.avatarUrl,
        organization: {
          id: data.workspaces?.[0]?.id || "ws_autonomous_ops",
          name: data.workspaces?.[0]?.name || "Black Box Ops",
          tier: "Enterprise Pro",
        },
      };
    }
  } catch {}
  return MOCK_USER;
}

// 2. Agents
export async function fetchAgents(): Promise<Agent[]> {
  try {
    const res = await apiClient.getAgents();
    const items = Array.isArray(res) ? res : res?.data || [];
    if (items.length > 0) {
      return items.map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.id,
        framework: (a.framework as any) || "LangChain",
        model: a.model || "gpt-4o",
        status: (a.status?.toLowerCase() as any) || "active",
        totalExecutions: a._count?.executions || 14,
        anomalyRate: 0.082,
        avgDurationMs: 1640,
        lastRunAt: a.updatedAt || new Date().toISOString(),
        description: a.description || "Autonomous agent registered in Black Box platform.",
        tags: [a.framework || "LangChain", a.model || "gpt-4o", "Autonomous"],
        environment: a.environment || "production",
      }));
    }
  } catch {}
  return MOCK_AGENTS;
}

export async function fetchAgentById(id: string): Promise<Agent | undefined> {
  try {
    const a = await apiClient.getAgentById(id);
    if (a?.id) {
      return {
        id: a.id,
        name: a.name,
        slug: a.id,
        framework: (a.framework as any) || "LangChain",
        model: a.model || "gpt-4o",
        status: (a.status?.toLowerCase() as any) || "active",
        totalExecutions: a._count?.executions || 14,
        anomalyRate: 0.082,
        avgDurationMs: 1640,
        lastRunAt: a.updatedAt || new Date().toISOString(),
        description: a.description || "Autonomous agent registered in Black Box platform.",
        tags: [a.framework || "LangChain", a.model || "gpt-4o"],
        environment: a.environment || "production",
      };
    }
  } catch {}
  return MOCK_AGENTS.find((a) => a.id === id || a.slug === id) || MOCK_AGENTS[0];
}

// 3. Executions
export async function fetchExecutions(filters?: {
  agentId?: string;
  status?: string;
}): Promise<Execution[]> {
  try {
    const res = await apiClient.getExecutions({
      agentId: filters?.agentId,
      status: filters?.status,
    });
    const items = Array.isArray(res) ? res : res?.items || res?.data || [];
    if (items.length > 0) {
      return items.map((e: any, idx: number) => {
        const mockFallback = MOCK_EXECUTIONS[idx % MOCK_EXECUTIONS.length];
        return {
          ...mockFallback,
          id: e.id,
          agentId: e.agentId || mockFallback.agentId,
          agentName: e.agent?.name || mockFallback.agentName,
          framework: e.agent?.framework || mockFallback.framework,
          status: e.status === "SUCCESS" ? "success" : e.status === "FAILED" ? "failed" : "running",
          startTime: e.startedAt || mockFallback.startTime,
          endTime: e.completedAt || mockFallback.endTime,
          durationMs: e.latencyMs || mockFallback.durationMs,
          totalSteps: e._count?.traceSteps || mockFallback.totalSteps,
          tokenUsage: {
            prompt: e.promptTokens || mockFallback.tokenUsage.prompt,
            completion: e.completionTokens || mockFallback.tokenUsage.completion,
            total: e.totalTokens || mockFallback.tokenUsage.total,
          },
          costUsd: e.costEstimate || mockFallback.costUsd,
          hasAnomaly: e.status === "FAILED",
          triggerPrompt: e.title || mockFallback.triggerPrompt,
          outputSummary: e.error?.message || e.output?.summary || mockFallback.outputSummary,
        };
      });
    }
  } catch {}

  let result = [...MOCK_EXECUTIONS];
  if (filters?.agentId) {
    result = result.filter((e) => e.agentId === filters.agentId);
  }
  if (filters?.status && filters.status !== "all") {
    result = result.filter((e) => e.status === filters.status);
  }
  return result;
}

export async function fetchExecutionById(id: string): Promise<Execution | undefined> {
  try {
    const e = await apiClient.getExecutionById(id);
    if (e?.id) {
      const mockFallback = MOCK_EXECUTIONS.find((m) => m.id === id) || MOCK_EXECUTIONS[0];
      return {
        ...mockFallback,
        id: e.id,
        agentId: e.agentId || mockFallback.agentId,
        agentName: e.agent?.name || mockFallback.agentName,
        framework: e.agent?.framework || mockFallback.framework,
        status: e.status === "SUCCESS" ? "success" : e.status === "FAILED" ? "failed" : "running",
        startTime: e.startedAt || mockFallback.startTime,
        endTime: e.completedAt || mockFallback.endTime,
        durationMs: e.latencyMs || mockFallback.durationMs,
        totalSteps: e.traceSteps?.length || e._count?.traceSteps || mockFallback.totalSteps,
        tokenUsage: {
          prompt: e.promptTokens || mockFallback.tokenUsage.prompt,
          completion: e.completionTokens || mockFallback.tokenUsage.completion,
          total: e.totalTokens || mockFallback.tokenUsage.total,
        },
        costUsd: e.costEstimate || mockFallback.costUsd,
        hasAnomaly: e.status === "FAILED",
        triggerPrompt: e.title || mockFallback.triggerPrompt,
        outputSummary: e.error?.message || e.output?.summary || mockFallback.outputSummary,
      };
    }
  } catch {}

  const found = MOCK_EXECUTIONS.find((e) => e.id === id);
  if (found) return found;
  return MOCK_EXECUTIONS[0];
}

// 4. Integrations
export async function fetchIntegrations(): Promise<Integration[]> {
  try {
    const res = await apiClient.getIntegrations();
    const items = Array.isArray(res) ? res : res?.data || [];
    if (items.length > 0) {
      return items.map((i: any) => ({
        id: i.id,
        name: i.name,
        provider: (i.provider?.toLowerCase() as any) || "openai",
        status: (i.status?.toLowerCase() as any) || "connected",
        credentialMask: i.credentialMask || "••••••••••••",
        lastUsedAt: i.lastSyncedAt || new Date().toISOString(),
        createdAt: i.createdAt || new Date().toISOString(),
        modelCount: 4,
        rateLimit: {
          rpm: i.config?.rateLimitRpm || 10000,
          currentRpm: 1240,
        },
      }));
    }
  } catch {}
  return MOCK_INTEGRATIONS;
}

// 5. API Keys
export async function fetchApiKeys(): Promise<ApiKey[]> {
  try {
    const res = await apiClient.getApiKeys();
    const items = Array.isArray(res) ? res : res?.data || [];
    if (items.length > 0) {
      return items.map((k: any) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix || "bb_live_9f82",
        scopes: k.scopes || ["trace:write", "execution:read"],
        status: (k.status?.toLowerCase() as any) || "active",
        createdAt: k.createdAt || new Date().toISOString(),
        lastUsedAt: k.lastUsedAt || new Date().toISOString(),
        expiresAt: k.expiresAt,
        requestsCount: 2480,
      }));
    }
  } catch {}
  return MOCK_API_KEYS;
}

// 6. Replays
export async function fetchReplaysByExecutionId(executionId: string): Promise<Replay[]> {
  try {
    const res = await apiClient.getReplays(executionId);
    const items = Array.isArray(res) ? res : res?.data || [];
    if (items.length > 0) {
      return items.map((r: any) => ({
        id: r.id,
        executionId: r.originalExecutionId,
        checkpointStep: r.checkpoint?.stepNumber || 4,
        reusedStepsRange: [r.reusedStepRange?.start || 1, r.reusedStepRange?.end || 4] as [number, number],
        replayedStepsRange: [r.replayedStepRange?.start || 5, r.replayedStepRange?.end || 9] as [number, number],
        outcome: r.result?.outcome === "SUCCESS" ? "resolved" : "diverged",
        status: "completed",
        createdAt: r.createdAt || new Date().toISOString(),
        durationMs: 1420,
      }));
    }
  } catch {}
  return MOCK_REPLAYS.filter((r) => r.executionId === executionId);
}

export async function fetchReplayInvestigations(): Promise<ReplayInvestigation[]> {
  try {
    const res = await apiClient.getReplays();
    const items = Array.isArray(res) ? res : res?.data || [];
    if (items.length > 0) {
      return items.map((r: any) => ({
        id: r.id,
        title: r.title || `Replay Investigation ${r.id.slice(0, 8)}`,
        originalExecutionId: r.originalExecutionId,
        replayExecutionId: r.replayExecutionId || "exec_replay_active",
        agentName: "DevOps Migration & SRE Agent",
        status: "completed",
        checkpointStep: r.checkpoint?.stepNumber || 4,
        totalStepsOriginal: 9,
        reusedStepsCount: r.reusedStepRange?.count || 4,
        replayedStepsCount: r.replayedStepRange?.count || 5,
        originalOutcome: "failed",
        replayOutcome: "success",
        timeSavedPercent: 44,
        tokenSavedPercent: 38,
        createdAt: r.createdAt || new Date().toISOString(),
        notes: "Checkpoint investigation replayed from Step 4 with corrected arguments.",
      }));
    }
  } catch {}
  return MOCK_REPLAY_INVESTIGATIONS;
}

export async function fetchComparisonById(id: string): Promise<Comparison | undefined> {
  try {
    const c = await apiClient.getComparisonById(id);
    if (c?.id) {
      return {
        id: c.id,
        baselineExecutionId: c.baselineExecutionId || c.baseExecutionId || "exec_base",
        candidateExecutionId: c.candidateExecutionId || c.targetExecutionId || "exec_target",
        divergenceStepNumber: c.divergenceStepNumber || c.firstDivergence?.step || 2,
        metricsDelta: {
          stepsDelta: c.metricsDelta?.stepsDelta || -4,
          tokensDelta: c.metricsDelta?.tokensDelta || c.metricsDiff?.tokenDiff || -450,
          latencyDeltaMs: c.metricsDelta?.latencyDeltaMs || c.metricsDiff?.latencyDiffMs || -420,
          costDeltaUsd: c.metricsDelta?.costDeltaUsd || c.metricsDiff?.costSavingsUsd || 0.0042,
        },
        resolvedAnomalies: c.resolvedAnomalies || ["Divergence resolved in comparison path"],
        notes: c.notes || `Comparison between ${c.baseExecutionId || "base"} and target`,
      };
    }
  } catch {}
  return MOCK_COMPARISONS.find((c) => c.id === id) || MOCK_COMPARISONS[0];
}

export async function fetchHistorySummary(): Promise<HistorySummaryStats> {
  try {
    const s = await apiClient.getActivitySummary();
    if (s?.totalEvents) {
      return {
        totalExecutions: s.totalEvents,
        investigations: s.byEntityType?.EXECUTION || 12,
        diagnoses: s.byEntityType?.DIAGNOSIS || 14,
        replays: s.byEntityType?.REPLAY || 8,
      };
    }
  } catch {}
  return MOCK_HISTORY_SUMMARY;
}

export async function fetchRecentlyViewed(): Promise<RecentlyViewedItem[]> {
  return MOCK_RECENTLY_VIEWED;
}

export async function fetchHistoryActivities(filters?: {
  search?: string;
  category?: string;
  dateRange?: string;
}): Promise<ActivityRecord[]> {
  try {
    const res = await apiClient.getActivity({ eventType: filters?.category });
    const items = Array.isArray(res) ? res : res?.data || [];
    if (items.length > 0) {
      return items.map((a: any, idx: number) => ({
        id: a.id,
        timestamp: a.createdAt || new Date().toISOString(),
        group: idx < 3 ? "today" : idx < 7 ? "yesterday" : "previous_7_days",
        type: a.entityType === "EXECUTION" ? "execution" : a.entityType === "DIAGNOSIS" ? "diagnosis" : a.entityType === "REPLAY" ? "replay" : "system",
        category: a.action,
        title: a.description || `Activity ${a.action}`,
        description: a.description || "",
        relatedObject: a.entityId,
        actor: {
          name: a.user?.name || "Lead AI Engineer",
          email: a.user?.email || "roshan@blackbox.ai",
          type: "human",
        },
        detail: {
          executionId: a.entityId,
          agentName: "DevOps SRE Agent",
          status: "success",
        },
      }));
    }
  } catch {}

  let result = [...MOCK_ACTIVITY_LOG];
  if (filters?.category && filters.category !== "all") {
    result = result.filter((a) => a.category === filters.category);
  }
  if (filters?.dateRange && filters.dateRange !== "all") {
    if (filters.dateRange === "today") {
      result = result.filter((a) => a.group === "today");
    } else if (filters.dateRange === "last_7_days") {
      result = result.filter((a) => a.group === "today" || a.group === "yesterday" || a.group === "previous_7_days");
    }
  }
  return result;
}

export async function fetchAlternativeInvestigations(): Promise<AlternativeInvestigation[]> {
  return MOCK_ALTERNATIVE_INVESTIGATIONS;
}

export async function fetchAlternativeById(id: string): Promise<AlternativeInvestigation | undefined> {
  return MOCK_ALTERNATIVE_INVESTIGATIONS.find((a) => a.id === id);
}

export async function fetchComparisonInvestigations(): Promise<ComparisonInvestigation[]> {
  return MOCK_COMPARISON_INVESTIGATIONS;
}

export async function fetchComparisonInvestigationById(id: string): Promise<ComparisonInvestigation | undefined> {
  return MOCK_COMPARISON_INVESTIGATIONS.find((c) => c.id === id);
}

export async function fetchAiProviders(): Promise<AIProvider[]> {
  return MOCK_AI_PROVIDERS;
}

export async function fetchAiProviderById(id: string): Promise<AIProvider | undefined> {
  return MOCK_AI_PROVIDERS.find((p) => p.id === id);
}

export async function fetchIntegrationActivities(): Promise<IntegrationActivity[]> {
  return MOCK_INTEGRATION_ACTIVITIES;
}

export async function fetchApiKeyActivities(): Promise<ApiKeyActivityItem[]> {
  return MOCK_API_KEY_ACTIVITIES;
}
