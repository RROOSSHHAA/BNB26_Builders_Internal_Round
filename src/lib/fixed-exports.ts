/**
 * Fixed Agent & Incident Export Store
 * 
 * Synchronizes agents fixed in the Replay & Alternatives tabs directly
 * into the Download / Export Hub so developers can immediately download
 * the fixed agent model code and structured .txt error reports.
 */

import { ReplayInvestigation } from "@/types";

export interface FixedAgentIncident {
  id: string; // e.g. "EX-2048" or custom execution ID
  replayId?: string;
  agentName: string;
  framework: string;
  model: string;
  failedStep: number;
  modelVersion: string;
  errorDetected: string;
  rootCause: string;
  evidence: string;
  originalDecision: string;
  correctedDecision: string;
  replayResult: string;
  finalResult: string;
  changesMade: string;
  recommendations: string;
  fixedAt: string;
  isCustomReplayFix?: boolean;
}

export const DEFAULT_FIXED_INCIDENTS: FixedAgentIncident[] = [
  {
    id: "EX-2048",
    replayId: "rpl-01",
    agentName: "Research Agent",
    framework: "CrewAI",
    model: "Demo Reasoning Model",
    failedStep: 73,
    modelVersion: "Diagnosis Model v2.0 - Causal Graph Net",
    errorDetected: "ValidationError: date_window [2026-11-01, 2026-12-31] exceeds temporal horizon",
    rootCause: "Agent model generated an unbounded forecast horizon in tool arguments without schema boundary checks.",
    evidence: 'Step 73 payload: {"date_window": ["2026-11-01", "2026-12-31"], "clamp": false} returned HTTP 422 Unprocessable Entity.',
    originalDecision: "Attempted to parse unvalidated future-dated earnings report; failed downstream synthesis for 54 steps.",
    correctedDecision: "Applied strict date clamp [T-30d, T+0] and injected schema validation fallback at checkpoint Step 70.",
    replayResult: "Alternative simulation converged at Step 74 with 0 temporal divergence cascade (100% Deterministic match).",
    finalResult: "FAILED (Original) -> SUCCESS (Replay Verified)",
    changesMade: "Patched system prompt with boundary clamping directives; updated tool schema in agent configuration; enabled 3-attempt exponential backoff retry policy.",
    recommendations: "1. Enforce strict JSON schema validation on all date-related arguments.\n2. Bind pre-invocation clamping guardrails before external tool dispatch.\n3. Integrate BlackBox Flight Recorder SDK to capture trace vectors and halt runaway divergence early.",
    fixedAt: "2026-10-04T09:45:00Z",
  },
  {
    id: "EX-2037",
    replayId: "rpl-02",
    agentName: "Recommendation Agent",
    framework: "LangChain",
    model: "GPT-4o",
    failedStep: 41,
    modelVersion: "Diagnosis Model v1.1 - Bayesian Tracer",
    errorDetected: "TimeoutException: Vector search retrieval exceeded 5000ms SLA",
    rootCause: "High-dimensional vector embeddings search timed out on non-indexed shard during peak volatility.",
    evidence: "Step 41 trace vector: latencyMs=5120ms (Threshold=3000ms), socket_hangup: true.",
    originalDecision: "Blocked entire recommendation pipeline waiting on synchronous vector cluster response.",
    correctedDecision: "Switched to tiered cache retrieval with secondary RAG index fallback and 1.5s timeout threshold.",
    replayResult: "Replayed from Step 38; fallback index responded in 240ms; downstream ranking nominal.",
    finalResult: "FAILED (Original) -> SUCCESS (Replay Verified)",
    changesMade: "Added dual-tier vector search fallback; updated LangChain retrieval chain with circuit-breaker pattern.",
    recommendations: "1. Configure multi-tier RAG caches for low-latency queries.\n2. Wrap external vector search calls in circuit breakers with degraded-mode fallbacks.\n3. Monitor p99 latency in BlackBox Flight Recorder.",
    fixedAt: "2026-10-03T18:20:00Z",
  },
  {
    id: "EX-2044",
    replayId: "rpl-03",
    agentName: "Customer Support Agent",
    framework: "AutoGen",
    model: "Claude 3.5 Sonnet",
    failedStep: 92,
    modelVersion: "Diagnosis Model v2.0 - Causal Graph Net",
    errorDetected: "SchemaFormatMismatch: Missing mandatory customer_id in CRM mutation",
    rootCause: "Prompt extraction missed secondary entity reference in multi-turn customer conversation.",
    evidence: 'Step 92 payload: {"ticket_id": "TCK-8812", "action": "ESCALATE"} missing required key "customer_id".',
    originalDecision: "Attempted CRM patch with incomplete payload; rejected with HTTP 400 Bad Request.",
    correctedDecision: "Injected state recovery step extracting customer_id from conversational history buffer.",
    replayResult: "Replayed from Step 90; customer_id resolved; CRM mutation succeeded with 200 OK.",
    finalResult: "FAILED (Original) -> SUCCESS (Replay Verified)",
    changesMade: "Hardened conversation state buffer; enforced mandatory schema validation before API dispatch.",
    recommendations: "1. Use typed Pydantic models for CRM mutations.\n2. Add entity verification pre-flight hook in BlackBox agent wrapper.",
    fixedAt: "2026-10-03T15:10:00Z",
  },
];

/**
 * Retrieve all fixed incidents (built-in defaults + any dynamically saved from Replays)
 */
export function getFixedIncidents(): FixedAgentIncident[] {
  if (typeof window === "undefined") return DEFAULT_FIXED_INCIDENTS;

  try {
    const stored = localStorage.getItem("blackbox_fixed_incidents");
    if (stored) {
      const parsed: FixedAgentIncident[] = JSON.parse(stored);
      // Merge unique by ID (dynamic ones first)
      const existingIds = new Set(parsed.map((item) => item.id.toLowerCase()));
      const defaultsRemaining = DEFAULT_FIXED_INCIDENTS.filter(
        (def) => !existingIds.has(def.id.toLowerCase())
      );
      return [...parsed, ...defaultsRemaining];
    }
  } catch (e) {
    console.error("Failed to read blackbox_fixed_incidents", e);
  }

  return DEFAULT_FIXED_INCIDENTS;
}

/**
 * Persist a newly fixed agent from Replay / Alternatives directly into Export Hub
 */
export function recordFixedIncidentFromReplay(replay: ReplayInvestigation): FixedAgentIncident {
  const incident: FixedAgentIncident = {
    id: replay.originalExecutionId || `EX-${Date.now().toString().slice(-4)}`,
    replayId: replay.id,
    agentName: replay.agentName || "Autonomous Agent",
    framework: replay.framework || "LangChain",
    model: "Production Target Model",
    failedStep: replay.modifiedStep || 73,
    modelVersion: "Diagnosis Model v2.0 - Causal Graph Net",
    errorDetected:
      replay.outcomeSummary ||
      `Step ${replay.modifiedStep} divergence: ${replay.modifiedStepTitle}`,
    rootCause:
      replay.whatChanged ||
      `Intermediate validation drift at Step ${replay.modifiedStep}.`,
    evidence: `Replay investigation ${replay.id}: Divergence detected at Step ${replay.modifiedStep} (${replay.modifiedStepTitle}). Original payload had unvalidated parameters.`,
    originalDecision: `Failed execution path with unhandled intermediate decision: ${replay.modifiedStepTitle}`,
    correctedDecision: `Applied replay modification (${replay.modificationType}): ${replay.whatChanged}`,
    replayResult: `Alternative path successfully verified: ${replay.stepsReplayed} downstream steps replayed, ${replay.stepsReused} checkpoint steps reused.`,
    finalResult: "FAILED (Original) -> SUCCESS (Replay Verified)",
    changesMade: `Injected counterfactual fix at Step ${replay.modifiedStep}. ${replay.whatChanged}`,
    recommendations:
      "1. Deploy Black Box hardened system prompt.\n2. Enforce pre-execution schema clamping.\n3. Integrate Black Box SDK for automated anomaly capture.",
    fixedAt: new Date().toISOString(),
    isCustomReplayFix: true,
  };

  if (typeof window !== "undefined") {
    try {
      const current = getFixedIncidents();
      // Remove any prior entry for the same execution ID
      const filtered = current.filter((item) => item.id.toLowerCase() !== incident.id.toLowerCase());
      const updated = [incident, ...filtered];
      localStorage.setItem("blackbox_fixed_incidents", JSON.stringify(updated));
      localStorage.setItem("blackbox_last_fixed_incident_id", incident.id);
    } catch (e) {
      console.error("Failed to store fixed incident", e);
    }
  }

  return incident;
}
