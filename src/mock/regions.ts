import { ExecutionRegion } from "@/types";
import {
  MOCK_STEPS_RETRIEVAL,
  MOCK_STEPS_REASONING,
  MOCK_STEPS_ANOMALOUS,
  MOCK_STEPS_FINALIZATION,
} from "./traceSteps";

export const MOCK_REGIONS_EX2048: ExecutionRegion[] = [
  {
    id: "reg_ex2048_01_retrieval",
    executionId: "EX-2048",
    name: "Data Retrieval",
    category: "retrieval",
    startStep: 1,
    endStep: 28,
    stepCount: 28,
    status: "healthy",
    confidence: 0.98,
    isAnomaly: false,
    summary: "Ingested user financial research prompt, executed 4 SEC EDGAR queries, and retrieved 28 validated report chunks without errors.",
    metrics: {
      latencyMs: 3800,
      tokenCount: 4120,
      errorCount: 0,
    },
    steps: MOCK_STEPS_RETRIEVAL,
  },
  {
    id: "reg_ex2048_02_reasoning",
    executionId: "EX-2048",
    name: "Reasoning",
    category: "reasoning",
    startStep: 29,
    endStep: 61,
    stepCount: 33,
    status: "healthy",
    confidence: 0.94,
    isAnomaly: false,
    summary: "Formulated multi-step accounting reconciliation formula and structured Bloomberg consensus lookup vectors.",
    metrics: {
      latencyMs: 4200,
      tokenCount: 1210,
      errorCount: 0,
    },
    steps: MOCK_STEPS_REASONING,
  },
  {
    id: "reg_ex2048_03_anomalous",
    executionId: "EX-2048",
    name: "Validation",
    category: "anomaly",
    startStep: 62,
    endStep: 78,
    stepCount: 17,
    status: "critical",
    confidence: 0.91, // 91% failure likelihood
    isAnomaly: true,
    anomalyReason: "Step 73 (Validation) failed with 91% failure likelihood. Unusual output pattern and deviation from successful executions caused downstream synthesis failure.",
    summary: "Step 73 (Validation) detected 91% failure likelihood. Output deviated from previous successful executions and validation result did not match expected structure.",
    metrics: {
      latencyMs: 2800,
      tokenCount: 2480,
      errorCount: 2,
    },
    steps: MOCK_STEPS_ANOMALOUS,
  },
  {
    id: "reg_ex2048_04_finalization",
    executionId: "EX-2048",
    name: "Finalization",
    category: "finalization",
    startStep: 79,
    endStep: 127,
    stepCount: 49,
    status: "affected",
    confidence: 0.81,
    isAnomaly: false,
    summary: "Affected downstream by anomalous validation outputs. Agent emitted corrupted summary tables incorporating the hallucinated variance offset.",
    metrics: {
      latencyMs: 4300,
      tokenCount: 1270,
      errorCount: 0,
    },
    steps: MOCK_STEPS_FINALIZATION,
  },
];

export const MOCK_REGIONS_EXECUTION_01 = MOCK_REGIONS_EX2048;
