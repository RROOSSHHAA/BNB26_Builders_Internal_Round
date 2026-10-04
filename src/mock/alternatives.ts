import { AlternativeInvestigation } from "@/types";

export const MOCK_ALTERNATIVE_INVESTIGATIONS: AlternativeInvestigation[] = [
  {
    id: "alt-2048-v1",
    agentName: "Research Agent",
    agentId: "agt_research",
    framework: "CrewAI",
    originalExecutionId: "EX-2048",
    totalSteps: 127,
    durationText: "18.4s",
    divergenceStep: 73,
    divergenceStepTitle: "Response Validation",
    divergenceRegion: "Validation",
    originalOutcome: "FAILED",
    alternativeOutcome: "SUCCESS",
    alternativeStatus: "PROMISING",
    affectedRegion: "Finalization",
    statusExplanation:
      "The alternative path produced a successful downstream outcome in this simulated investigation.",
    createdAtAgo: "12 minutes ago",
    createdAt: "2026-10-04T09:15:00Z",
    originalDecision: {
      title: "Validation result: Invalid structure",
      description: "Validator rejected synthesized research report due to missing required schema fields.",
      payloadSnippet: JSON.stringify(
        {
          valid: false,
          error: "ValidationError: date_window out of expected bounds",
          fields_missing: ["confidence_score", "source_citation_matrix"],
        },
        null,
        2
      ),
    },
    alternativeDecision: {
      type: "correct_validation",
      title: "Corrected structure & clamped datetime bounds",
      description: "Injected compliant response structure with schema validation override.",
      payloadSnippet: JSON.stringify(
        {
          valid: true,
          override_rule: "clamp_datetime_bounds",
          normalized_output: {
            status: "VALID",
            confidence_score: 0.98,
            source_citation_matrix: ["bloomberg_q3", "consensus_sec_filing"],
          },
        },
        null,
        2
      ),
    },
    originalPath: [
      { name: "Data Retrieval", status: "ok", range: "1–28" },
      { name: "Reasoning", status: "ok", range: "29–61" },
      { name: "Validation", status: "warn", range: "62–78" },
      { name: "Finalization", status: "fail", range: "79–127" },
    ],
    alternativePath: [
      { name: "Data Retrieval", status: "ok", range: "1–28" },
      { name: "Reasoning", status: "ok", range: "29–61" },
      { name: "Validation", status: "ok", range: "62–78" },
      { name: "Finalization", status: "ok", range: "79–127" },
    ],
    whatChanged: {
      decision: "Step 73 — Response Validation",
      original: "Invalid structure (ValidationError)",
      alternative: "Corrected structure (schema normalized)",
    },
    downstreamEffect: {
      original: "Finalization region entered 16 hallucinated retry loops and failed",
      alternative: "Finalization completed in 840ms with valid synthesized artifact",
    },
    finalOutcomeText: "FAILED → SUCCESS",
    impactNodes: [
      {
        regionName: "Validation",
        status: "recovered",
        statusText: "Recovered (anomalous thought loop halted)",
      },
      {
        regionName: "Finalization",
        status: "recovered",
        statusText: "Recovered (synthesized report published)",
      },
    ],
  },
  {
    id: "alt-2037-v1",
    agentName: "Recommendation Agent",
    agentId: "agt_recommendation",
    framework: "LangChain",
    originalExecutionId: "EX-2037",
    totalSteps: 64,
    durationText: "6.2s",
    divergenceStep: 41,
    divergenceStepTitle: "Vector Retrieval",
    divergenceRegion: "Vector Search",
    originalOutcome: "FAILED",
    alternativeOutcome: "PARTIAL RECOVERY",
    alternativeStatus: "PARTIAL_RECOVERY",
    affectedRegion: "Ranking",
    statusExplanation:
      "The alternative decision restored vector search results but ranking confidence remained below production threshold.",
    createdAtAgo: "1 hour ago",
    createdAt: "2026-10-04T08:20:00Z",
    originalDecision: {
      title: "Query retrieval timeout",
      description: "Pinecone query timed out at 5,000ms threshold under strict top-5 filter.",
      payloadSnippet: JSON.stringify(
        {
          similarity_cutoff: 0.88,
          timeout_ms: 5000,
          status: "UPSTREAM_GATEWAY_TIMEOUT",
        },
        null,
        2
      ),
    },
    alternativeDecision: {
      type: "alternative_tool_result",
      title: "Fallback semantic cache hit with relaxed threshold",
      description: "Substituted warm cached embeddings at 0.75 similarity cutoff.",
      payloadSnippet: JSON.stringify(
        {
          similarity_cutoff: 0.75,
          source: "semantic_redis_cache",
          returned_chunks: 3,
        },
        null,
        2
      ),
    },
    originalPath: [
      { name: "Retrieval", status: "ok", range: "1–22" },
      { name: "Vector Search", status: "fail", range: "23–44" },
      { name: "Ranking", status: "fail", range: "45–64" },
    ],
    alternativePath: [
      { name: "Retrieval", status: "ok", range: "1–22" },
      { name: "Vector Search", status: "ok", range: "23–44" },
      { name: "Ranking", status: "warn", range: "45–64" },
    ],
    whatChanged: {
      decision: "Step 41 — Vector Retrieval",
      original: "Live index query timeout",
      alternative: "Warm cache fallback with 0.75 cutoff",
    },
    downstreamEffect: {
      original: "Execution halted on step 44 with empty recommendation set",
      alternative: "Ranker generated 3 candidates with low confidence advisory",
    },
    finalOutcomeText: "FAILED → PARTIAL RECOVERY",
    impactNodes: [
      {
        regionName: "Vector Search",
        status: "recovered",
        statusText: "Recovered (cache hit returned 3 chunks)",
      },
      {
        regionName: "Ranking",
        status: "partial",
        statusText: "Partial recovery (confidence 0.64 below target)",
      },
    ],
  },
  {
    id: "alt-2029-v1",
    agentName: "Customer Support Agent",
    agentId: "agt_support",
    framework: "AutoGen",
    originalExecutionId: "EX-2029",
    totalSteps: 72,
    durationText: "8.9s",
    divergenceStep: 58,
    divergenceStepTitle: "Tool Fallback",
    divergenceRegion: "Action Dispatch",
    originalOutcome: "FAILED",
    alternativeOutcome: "NO IMPROVEMENT",
    alternativeStatus: "NO_IMPROVEMENT",
    affectedRegion: "Conversation",
    statusExplanation:
      "Alternative parameter mapping did not resolve downstream tool authentication failure.",
    createdAtAgo: "Yesterday",
    createdAt: "2026-10-03T14:40:00Z",
    originalDecision: {
      title: "Auth token reject on CRM tool",
      description: "Tool dispatch returned 401 Unauthorized during CRM contact sync.",
      payloadSnippet: JSON.stringify(
        {
          tool: "hubspot_sync_contact",
          auth_error: "OAuth2 refresh token expired",
        },
        null,
        2
      ),
    },
    alternativeDecision: {
      type: "alternative_instruction",
      title: "Retry with secondary service credentials",
      description: "Instructed agent to use cached service account key.",
      payloadSnippet: JSON.stringify(
        {
          fallback_mode: "service_account",
          auth_error: "Insufficient OAuth scopes: write:crm",
        },
        null,
        2
      ),
    },
    originalPath: [
      { name: "Intent Classification", status: "ok", range: "1–24" },
      { name: "Action Dispatch", status: "fail", range: "25–58" },
      { name: "Conversation", status: "fail", range: "59–72" },
    ],
    alternativePath: [
      { name: "Intent Classification", status: "ok", range: "1–24" },
      { name: "Action Dispatch", status: "fail", range: "25–58" },
      { name: "Conversation", status: "fail", range: "59–72" },
    ],
    whatChanged: {
      decision: "Step 58 — Tool Fallback",
      original: "OAuth token expired (401)",
      alternative: "Service account retry (scope mismatch 403)",
    },
    downstreamEffect: {
      original: "Agent terminated without responding to customer",
      alternative: "Agent terminated on secondary auth error",
    },
    finalOutcomeText: "FAILED → NO IMPROVEMENT",
    impactNodes: [
      {
        regionName: "Action Dispatch",
        status: "failed",
        statusText: "Failed (scope violation 403)",
      },
      {
        regionName: "Conversation",
        status: "failed",
        statusText: "Failed (no reply generated)",
      },
    ],
  },
  {
    id: "alt-2041-v1",
    agentName: "Document Analysis Agent",
    agentId: "agt_doc_analysis",
    framework: "LlamaIndex",
    originalExecutionId: "EX-2041",
    totalSteps: 98,
    durationText: "14.1s",
    divergenceStep: 48,
    divergenceStepTitle: "Chunk Truncation",
    divergenceRegion: "Chunking",
    originalOutcome: "ANOMALY",
    alternativeOutcome: "SUCCESS",
    alternativeStatus: "PROMISING",
    affectedRegion: "Extraction",
    statusExplanation:
      "Adjusting chunk boundary preserved critical paragraph context and avoided context window saturation.",
    createdAtAgo: "2 days ago",
    createdAt: "2026-10-02T11:20:00Z",
    originalDecision: {
      title: "Hard 4096-token boundary split",
      description: "Arbitrary cutoff truncated legal clause in middle of indemnification paragraph.",
      payloadSnippet: JSON.stringify(
        {
          chunk_size: 4096,
          overlap: 0,
          split_on: "character_count",
          loss_detected: true,
        },
        null,
        2
      ),
    },
    alternativeDecision: {
      type: "alternative_instruction",
      title: "Semantic sentence-window splitter (2048 tokens + 200 overlap)",
      description: "Preserved sentence integrity and paragraph structure across chunks.",
      payloadSnippet: JSON.stringify(
        {
          chunk_size: 2048,
          overlap: 200,
          split_on: "markdown_heading_sentence",
          loss_detected: false,
        },
        null,
        2
      ),
    },
    originalPath: [
      { name: "Ingest", status: "ok", range: "1–20" },
      { name: "Chunking", status: "warn", range: "21–50" },
      { name: "Extraction", status: "warn", range: "51–98" },
    ],
    alternativePath: [
      { name: "Ingest", status: "ok", range: "1–20" },
      { name: "Chunking", status: "ok", range: "21–50" },
      { name: "Extraction", status: "ok", range: "51–98" },
    ],
    whatChanged: {
      decision: "Step 48 — Chunk Truncation",
      original: "Hard 4k chunk split (clause severed)",
      alternative: "Semantic 2k window with 200 overlap",
    },
    downstreamEffect: {
      original: "Extractor hallucinated missing indemnity indemnitor terms",
      alternative: "Extractor accurately parsed full indemnity obligations",
    },
    finalOutcomeText: "ANOMALY → SUCCESS",
    impactNodes: [
      {
        regionName: "Chunking",
        status: "recovered",
        statusText: "Recovered (lossless clause split)",
      },
      {
        regionName: "Extraction",
        status: "recovered",
        statusText: "Recovered (100% clause extraction accuracy)",
      },
    ],
  },
];
