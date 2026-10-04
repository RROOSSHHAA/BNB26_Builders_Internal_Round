/**
 * BLACK BOX — Autonomous AI Flight Recorder SDK (TypeScript / Node.js)
 * -------------------------------------------------------------------
 * Compatible with LangChain.js, Vercel AI SDK, AutoGPT, CrewAI, and OpenAI/Anthropic APIs.
 */

export interface StepRecord {
  stepId: string;
  name: string;
  tool?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  durationMs: number;
  timestamp: number;
}

export interface FlightSessionOptions {
  agentName: string;
  tags?: string[];
}

export class FlightSession {
  public readonly sessionId: string;
  public readonly agentName: string;
  public readonly tags: string[];
  public steps: StepRecord[] = [];
  private startTime: number;
  public status: "SUCCESS" | "FAILED" | "RUNNING" = "RUNNING";
  public error?: string;

  constructor(
    private recorder: FlightRecorder,
    options: FlightSessionOptions,
  ) {
    this.agentName = options.agentName;
    this.tags = options.tags || [];
    this.sessionId = `EX-${Math.floor(Date.now() % 10000)}`;
    this.startTime = Date.now();
  }

  /**
   * Log an individual tool call, prompt response, or execution step
   */
  public logStep(params: {
    name: string;
    tool?: string;
    inputs?: Record<string, unknown>;
    outputs?: Record<string, unknown>;
    durationMs?: number;
    status?: "SUCCESS" | "FAILED";
  }): StepRecord {
    const step: StepRecord = {
      stepId: `step-${this.steps.length + 1}`,
      name: params.name,
      tool: params.tool || "llm_reasoning",
      inputs: params.inputs || {},
      outputs: params.outputs || {},
      durationMs: params.durationMs || 0,
      status: params.status || "SUCCESS",
      timestamp: Date.now(),
    };
    this.steps.push(step);
    return step;
  }

  /**
   * Capture an immutable state checkpoint for deterministic time-travel replay
   */
  public recordCheckpoint(name: string, state: Record<string, unknown>) {
    return this.logStep({
      name: `Checkpoint: ${name}`,
      tool: "memory_snapshot",
      inputs: { memory: state },
      status: "SUCCESS",
    });
  }

  /**
   * Mark mission successful and flush flight telemetry
   */
  public async complete(result?: unknown) {
    this.status = "SUCCESS";
    this.logStep({
      name: "Mission Complete",
      outputs: { result },
      status: "SUCCESS",
    });
    await this.flush();
  }

  /**
   * Record fatal exception telemetry and flush black box crash data
   */
  public async fail(err: Error | unknown) {
    this.status = "FAILED";
    const errorMessage = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    this.error = errorMessage;
    this.logStep({
      name: "CRASH_EXCEPTION",
      tool: "runtime_kernel",
      outputs: {
        error: errorMessage,
        stack,
      },
      status: "FAILED",
    });

    await this.flush();
  }

  private async flush() {
    const durationMs = Date.now() - this.startTime;
    await this.recorder._flushSession({
      executionId: this.sessionId,
      agentName: this.agentName,
      status: this.status,
      durationMs,
      stepCount: this.steps.length,
      error: this.error,
      steps: this.steps,
      tags: this.tags,
    });
  }
}

export interface FlightRecorderConfig {
  apiKey: string;
  endpoint?: string;
}

export class FlightRecorder {
  private apiKey: string;
  private endpoint: string;

  constructor(config: FlightRecorderConfig) {
    this.apiKey = config.apiKey;
    this.endpoint = (config.endpoint || "http://localhost:4000/api/v1").replace(/\/+$/, "");
  }

  /**
   * Start a new flight recording session for an AI Agent
   */
  public startSession(options: FlightSessionOptions): FlightSession {
    return new FlightSession(this, options);
  }

  /**
   * Internal telemetry dispatcher (Non-blocking: will never crash the host agent)
   */
  public async _flushSession(payload: Record<string, unknown>) {
    try {
      await fetch(`${this.endpoint}/executions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "User-Agent": "BlackBox-TS-SDK/1.0.0",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // Non-blocking telemetry ingestion
    }
  }
}
