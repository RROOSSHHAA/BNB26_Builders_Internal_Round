/**
 * BLACK BOX — AI Flight Recorder Data Interfaces
 * Structured for future backend API, trace ingestion, and ML diagnosis integration.
 */

export type ExecutionStatus = "success" | "anomaly" | "failed" | "running";

export type RegionCategory =
  | "retrieval"
  | "reasoning"
  | "tool_call"
  | "anomaly"
  | "finalization"
  | "recovery";

export type RegionHealth = "healthy" | "warning" | "critical" | "affected";

export type StepType =
  | "prompt"
  | "thought"
  | "tool_input"
  | "tool_output"
  | "retrieval_query"
  | "retrieval_chunk"
  | "synthesis"
  | "validation"
  | "error";

export type StepStatus = "ok" | "warn" | "error" | "diverged";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "engineer" | "auditor";
  avatarUrl?: string;
  organization: {
    id: string;
    name: string;
    tier: "Enterprise Pro" | "Developer" | "Trial";
  };
}

export type AgentStatus = "active" | "idle" | "error" | "needs_attention";

export interface AgentHealthRun {
  id: string;
  status: "ok" | "warn" | "fail";
  executionId?: string;
  stepNumber?: number;
}

export interface AgentFailureInsight {
  mostFrequentIssue: string;
  mostSuspiciousRegion: string;
  latestFailureStep: number;
  latestFailureExecutionId: string;
}

export interface AgentFailureDistribution {
  category: string;
  percentage: number;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  framework: "LangChain" | "CrewAI" | "AutoGen" | "LlamaIndex" | "Custom";
  model: string;
  status: AgentStatus;
  totalExecutions: number;
  anomalyRate: number; // e.g. 0.082 (8.2%)
  avgDurationMs: number;
  lastRunAt: string;
  description: string;
  tags: string[];
  successRate?: number;
  failureCount?: number;
  successfulCount?: number;
  mostCommonIssue?: string;
  recentHealth?: AgentHealthRun[];
  failureInsight?: AgentFailureInsight;
  failureDistribution?: AgentFailureDistribution[];
  environment?: string;
}

export interface TraceStep {
  id: string;
  stepNumber: number;
  timestamp: string;
  type: StepType;
  title: string;
  status: StepStatus;
  latencyMs: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  inputPayload?: Record<string, unknown> | string;
  outputPayload?: Record<string, unknown> | string;
  errorDetails?: {
    code: string;
    message: string;
    stack?: string;
  };
  attributes?: Record<string, string | number | boolean | string[]>;
}

export interface ExecutionRegion {
  id: string;
  executionId: string;
  name: string;
  category: RegionCategory;
  startStep: number;
  endStep: number;
  stepCount: number;
  status: RegionHealth;
  confidence: number; // 0 to 1
  isAnomaly: boolean;
  anomalyReason?: string;
  summary: string;
  metrics: {
    latencyMs: number;
    tokenCount: number;
    errorCount: number;
  };
  steps: TraceStep[];
}

export type RootCauseType =
  | "temporal_hallucination"
  | "tool_schema_mismatch"
  | "context_window_overflow"
  | "upstream_timeout"
  | "state_desync"
  | "infinite_reasoning_loop"
  | "parameter_inversion";

export interface DiagnosisEvidenceSignal {
  name: string;
  level: "High" | "Moderate" | "Low";
  percentage: number;
}

export interface Diagnosis {
  id: string;
  executionId: string;
  agentName?: string;
  agentId?: string;
  framework?: string;
  title: string;
  rootCauseType: RootCauseType;
  failureCategory?: string;
  subcategory?: string;
  suspiciousStepNumber?: number;
  suspiciousStepTitle?: string;
  confidenceScore: number; // 0 to 1
  confidenceLabel?: string;
  explanation: string;
  evidence: string[];
  evidenceSignals?: DiagnosisEvidenceSignal[];
  affectedStepRange: [number, number];
  affectedRegionId: string;
  affectedRegionName?: string;
  downstreamImpact?: {
    affectedRegionsCount: number;
    affectedStepsCount: number;
    description: string;
  };
  recommendedFix?: {
    action: string;
    parameterChanges?: Record<string, unknown>;
    promptDiff?: string;
  };
  simulatedRecoveryRate?: number;
  detectedAt: string;
  status?: "failed" | "in_review" | "resolved";
}

export interface Execution {
  id: string;
  agentId: string;
  agentName: string;
  framework: string;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  durationMs: number;
  totalSteps: number;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
  costUsd: number;
  anomalyScore: number; // 0 to 1 (e.g. 0.88 is severe)
  hasAnomaly: boolean;
  triggerPrompt: string;
  outputSummary?: string;
  tags: string[];
  regions: ExecutionRegion[];
  diagnosis?: Diagnosis;
  failureCategory?: string;
  suspiciousStep?: number;
  suspiciousRegionName?: string;
  anomalyConfidence?: number;
  needsInvestigation?: boolean;
}

export interface Replay {
  id: string;
  executionId: string;
  originalExecutionId: string;
  status: "idle" | "simulating" | "completed" | "failed";
  forkedAtStep: number;
  modifiedParameters: Record<string, unknown>;
  simulatedLatencyMs: number;
  simulatedCostUsd: number;
  outcomeDelta: "resolved" | "unresolved" | "diverged_further";
  comparisonDiffId?: string;
  createdAt: string;
}

export type ReplayModificationType =
  | "input"
  | "instruction"
  | "validation_rule"
  | "output"
  | "simulated_result";

export interface ReplayRegionComparison {
  name: string;
  range: string;
  status: "ok" | "warn" | "fail";
}

export interface ReplayInvestigation {
  id: string;
  agentName: string;
  agentId?: string;
  framework?: string;
  originalExecutionId: string;
  totalSteps: number;
  checkpointStep: number;
  modifiedStep: number;
  modifiedStepTitle: string;
  modificationType: ReplayModificationType;
  originalResult: "FAILED" | "ANOMALY";
  replayResult: "SUCCESS" | "FAILED";
  status: "completed" | "simulating" | "ready";
  createdAtAgo: string;
  createdAt: string;
  stepsReused: number; // e.g. 70
  stepsReplayed: number; // e.g. 57
  downstreamAffectedSteps: number; // e.g. 54
  outcomeSummary: string;
  originalPayloadSnippet?: string;
  modifiedPayloadSnippet?: string;
  originalRegions: ReplayRegionComparison[];
  replayRegions: ReplayRegionComparison[];
  whatChanged: string;
  downstreamEffect: string;
  finalResultText: string;
}

export type AlternativeOutcomeStatus = "PROMISING" | "PARTIAL_RECOVERY" | "NO_IMPROVEMENT";

export interface AlternativeImpactNode {
  regionName: string;
  status: "recovered" | "partial" | "failed";
  statusText: string;
}

export interface AlternativeInvestigation {
  id: string;
  agentName: string;
  agentId?: string;
  framework?: string;
  originalExecutionId: string;
  totalSteps: number;
  durationText?: string;
  divergenceStep: number;
  divergenceStepTitle: string;
  divergenceRegion: string;
  originalOutcome: "FAILED" | "ANOMALY";
  alternativeOutcome: "SUCCESS" | "PARTIAL RECOVERY" | "NO IMPROVEMENT";
  alternativeStatus: AlternativeOutcomeStatus;
  affectedRegion: string;
  statusExplanation: string;
  createdAtAgo: string;
  createdAt: string;
  originalDecision: {
    title: string;
    description: string;
    payloadSnippet?: string;
  };
  alternativeDecision: {
    type: "correct_validation" | "alternative_instruction" | "alternative_tool_result" | "alternative_model_response" | "custom";
    title: string;
    description: string;
    payloadSnippet?: string;
  };
  originalPath: Array<{
    name: string;
    status: "ok" | "warn" | "fail";
    range?: string;
  }>;
  alternativePath: Array<{
    name: string;
    status: "ok" | "warn" | "fail";
    range?: string;
  }>;
  whatChanged: {
    decision: string;
    original: string;
    alternative: string;
  };
  downstreamEffect: {
    original: string;
    alternative: string;
  };
  finalOutcomeText: string;
  impactNodes: AlternativeImpactNode[];
}

export type ComparisonScenarioType =
  | "successful_vs_failed"
  | "original_vs_replay"
  | "original_vs_alternative";

export interface ComparisonRegionDetail {
  name: string;
  leftRange: string;
  leftStatus: "ok" | "warn" | "fail";
  leftDescription: string;
  rightRange: string;
  rightStatus: "ok" | "warn" | "fail";
  rightDescription: string;
  whatChanged: {
    outputStructure: string;
    latency: string;
    downstreamStatus: string;
  };
}

export interface ComparisonLocalContextStep {
  step: number;
  title: string;
  leftStatus: "ok" | "warn" | "fail" | "affected";
  rightStatus: "ok" | "warn" | "fail" | "affected";
  leftDesc?: string;
  rightDesc?: string;
}

export interface ComparisonInvestigation {
  id: string;
  title: string;
  scenarioType: ComparisonScenarioType;
  agentName: string;
  agentId?: string;
  framework?: string;
  leftExecution: {
    id: string;
    label: string;
    status: "FAILED" | "SUCCESS" | "ANOMALY";
    totalSteps: number;
    durationText: string;
  };
  rightExecution: {
    id: string;
    label: string;
    status: "SUCCESS" | "FAILED" | "ANOMALY";
    totalSteps: number;
    durationText: string;
  };
  divergenceRegion: string;
  approximateDivergenceStep: number;
  resultSummary: string;
  createdAtAgo: string;
  createdAt: string;
  regions: ComparisonRegionDetail[];
  divergencePoint: {
    step: number;
    stepTitle: string;
    leftBehavior: string;
    rightBehavior: string;
    downstreamEffect: string;
  };
  localContext: ComparisonLocalContextStep[];
  keyDifferences: string[];
  downstreamImpactFlow: {
    divergenceStep: number;
    regionName: string;
    nextRegionName: string;
    leftOutcome: string;
    rightOutcome: string;
  };
  rawDifferences?: Array<{
    field: string;
    leftValue: string;
    rightValue: string;
    category: string;
  }>;
}

export interface Comparison {
  id: string;
  baselineExecutionId: string;
  candidateExecutionId: string;
  divergenceStepNumber: number;
  metricsDelta: {
    stepsDelta: number;
    tokensDelta: number;
    latencyDeltaMs: number;
    costDeltaUsd: number;
  };
  resolvedAnomalies: string[];
  notes: string;
}

export interface Integration {
  id: string;
  name: string;
  type: "langchain" | "crewai" | "autogen" | "llamaindex" | "custom_rest" | "python_sdk";
  category: "Framework" | "Orchestrator" | "Model Provider" | "Telemetry Sink";
  status: "connected" | "disconnected" | "syncing" | "degraded";
  lastTelemetryAt?: string;
  eventsCaptured24h: number;
  version: string;
  description: string;
  documentationUrl: string;
}

export type ApiKeyEnvironment = "production" | "development" | "testing" | "staging";
export type ApiKeyStatus = "active" | "revoked";
export type ApiKeyScope = "traces:write" | "executions:read" | "agents:read" | "replays:execute" | "admin";

export interface ApiKeyUsagePreview {
  requests24h: number;
  errorRate: string;
  avgLatencyMs: number;
  lastActiveEndpoint: string;
  sparklineData?: number[];
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string; // e.g. bbx_live_••••••••••••7F4A
  keyPreview: string; // e.g. bbx_live_••••••••••••7F4A
  environment: ApiKeyEnvironment;
  status: ApiKeyStatus;
  createdAt: string;
  createdAtText?: string; // e.g. "Oct 01, 2026"
  lastUsedAt?: string;
  lastUsedText?: string; // e.g. "2 mins ago"
  scopes: ApiKeyScope[];
  permissions?: ApiKeyScope[];
  usagePreview?: ApiKeyUsagePreview;
  fullMockKey?: string;
}

export interface ApiKeyActivityItem {
  id: string;
  action: string;
  keyName: string;
  timestampAgo: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}


export type ActivityType =
  | "EXECUTION_RECORDED"
  | "EXECUTION_VIEWED"
  | "DIAGNOSIS_CREATED"
  | "DIAGNOSIS_VIEWED"
  | "REPLAY_CREATED"
  | "COMPARISON_CREATED"
  | "AGENT_CREATED"
  | "INTEGRATION_CONNECTED"
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "SETTINGS_UPDATED";

export type ActivityCategory =
  | "all"
  | "executions"
  | "diagnoses"
  | "replays"
  | "comparisons"
  | "agents"
  | "integrations"
  | "api_keys"
  | "settings";

export type ActivityGroupTime = "today" | "yesterday" | "previous_7_days" | "older";

export type ActivityDateFilter = "all" | "today" | "last_7_days" | "last_30_days";

export interface ActivityDetailContext {
  executionId?: string;
  agentId?: string;
  agentName?: string;
  diagnosisId?: string;
  diagnosisTitle?: string;
  suspiciousStep?: number;
  suspiciousStepTitle?: string;
  checkpointStep?: number;
  comparisonId?: string;
  comparisonBaselineId?: string;
  comparisonCandidateId?: string;
  integrationName?: string;
  integrationType?: string;
  apiKeyPrefix?: string;
  apiKeyName?: string;
  environment?: string;
  statusText?: string;
  severity?: "failed" | "anomaly" | "success" | "info" | "warning";
  metaItems?: Array<{ label: string; value: string }>;
  rawPayloadSnippet?: string;
}

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  category: ActivityCategory;
  title: string;
  relatedObject: string;
  description: string;
  timestamp: string;
  displayTime: string;
  group: ActivityGroupTime;
  status?: "FAILED" | "SUCCESS" | "ANOMALY" | "ACTIVE" | "REVOKED" | "WARNING" | "CONFIGURED";
  statusColor?: string;
  targetUrl?: string;
  secondaryTargetUrl?: string;
  secondaryActionLabel?: string;
  detail: ActivityDetailContext;
}

export interface RecentlyViewedItem {
  id: string;
  title: string;
  subtitle: string;
  timestampAgo: string;
  targetUrl: string;
  type: "execution" | "diagnosis" | "replay" | "agent" | "integration";
  status?: "FAILED" | "SUCCESS" | "ANOMALY" | "ACTIVE";
}

export interface HistorySummaryStats {
  totalExecutions: number;
  investigations: number;
  diagnoses: number;
  replays: number;
}

export type AIProviderStatus =
  | "connected"
  | "not_connected"
  | "connecting"
  | "error"
  | "not_configured";

export type AIProviderType =
  | "openai"
  | "anthropic"
  | "google"
  | "local"
  | "custom";

export interface AIProviderModel {
  id: string;
  name: string;
  family: string;
  contextWindow: string;
  description?: string;
  isDefault?: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  slug: string;
  type: AIProviderType;
  description: string;
  status: AIProviderStatus;
  models: AIProviderModel[];
  defaultModelId?: string;
  maskedApiKey?: string;
  environment?: "development" | "staging" | "production";
  lastConfiguredAt?: string;
  lastConfiguredAgo?: string;
  baseUrl?: string;
  requestFormat?: "openai_compatible" | "anthropic_compatible" | "google_genai" | "custom_json";
  isCustom?: boolean;
  isLocal?: boolean;
  errorMessage?: string;
}

export interface IntegrationActivity {
  id: string;
  action: string;
  providerName: string;
  providerType: AIProviderType;
  details: string;
  timestampAgo: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

export interface UserSettings {
  name: string;
  email: string;
  role: string;
}

export interface WorkspaceSettings {
  name: string;
  id: string;
  plan: string;
  memberCount: number;
}

export interface NotificationSettings {
  failureDetected: boolean;
  diagnosisCompleted: boolean;
  replayCompleted: boolean;
  integrationChanges: boolean;
  apiKeyActivity: boolean;
  weeklySummary: boolean;
}

export interface AppearanceSettings {
  theme: "dark" | "system" | "light";
  density: "comfortable" | "compact";
  executionVisualization: "intelligence-map" | "detailed-trace";
}

export interface DeveloperPreferences {
  defaultExecutionView: "intelligence-map" | "trace";
  defaultExecutionDetail: "compressed" | "expanded";
  showRawTrace: boolean;
  showDiagnosticConfidence: boolean;
  autoOpenAnomalyContext: boolean;
  compactExecutionRows: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: string;
  action: string;
  timestamp: string;
  timestampAgo: string;
  ipAddress: string;
  status: "success" | "warning";
}

