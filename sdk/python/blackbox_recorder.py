"""
BLACK BOX — Autonomous AI Flight Recorder SDK (Python)
------------------------------------------------------
Lightweight, zero-overhead telemetry SDK for Python AI agents.
Compatible with LangChain, CrewAI, AutoGPT, LlamaIndex, and raw OpenAI/Anthropic APIs.

Usage:
    from blackbox_recorder import FlightRecorder

    recorder = FlightRecorder(api_key="bb_live_xxx", endpoint="https://api.blackbox.ai/v1")

    with recorder.session(agent_name="SRE DevOps Agent") as session:
        result = agent.execute("Database migration")
        session.log_step(step_name="SQL Execution", payload={"sql": "ALTER TABLE..."}, status="SUCCESS")
"""

import time
import json
import traceback
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, List


class FlightSession:
    """Manages an active agent mission flight recording."""

    def __init__(self, recorder, agent_name: str, session_id: str, tags: Optional[List[str]] = None):
        self.recorder = recorder
        self.agent_name = agent_name
        self.session_id = session_id
        self.tags = tags or []
        self.steps: List[Dict[str, Any]] = []
        self.start_time = time.time()
        self.status = "RUNNING"
        self.error: Optional[str] = None

    def log_step(
        self,
        name: str,
        tool: Optional[str] = None,
        inputs: Optional[Dict[str, Any]] = None,
        outputs: Optional[Dict[str, Any]] = None,
        duration_ms: int = 0,
        status: str = "SUCCESS",
    ):
        """Record an individual agent execution step or tool call."""
        step_entry = {
            "step_id": f"step-{len(self.steps) + 1}",
            "name": name,
            "tool": tool or "llm_reasoning",
            "inputs": inputs or {},
            "outputs": outputs or {},
            "status": status,
            "duration_ms": duration_ms,
            "timestamp": time.time(),
        }
        self.steps.append(step_entry)
        return step_entry

    def record_checkpoint(self, state_name: str, memory_state: Dict[str, Any]):
        """Capture an immutable state checkpoint for deterministic time-travel replay."""
        return self.log_step(
            name=f"Checkpoint: {state_name}",
            tool="memory_snapshot",
            inputs={"captured_memory": memory_state},
            status="SUCCESS",
        )

    def record_output(self, result: Any):
        """Finalize the mission with successful output."""
        self.status = "SUCCESS"
        self.log_step(name="Mission Complete", outputs={"result": str(result)}, status="SUCCESS")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = int((time.time() - self.start_time) * 1000)
        if exc_type is not None:
            self.status = "FAILED"
            self.error = str(exc_val)
            # Automatically record black box flight crash telemetry
            self.log_step(
                name="CRASH_EXCEPTION",
                tool="runtime_kernel",
                inputs={"exception_type": exc_type.__name__},
                outputs={
                    "error_message": str(exc_val),
                    "stack_trace": traceback.format_exc(),
                },
                status="FAILED",
            )

        # Dispatch black box telemetry payload
        self.recorder._flush_session(self, duration)
        # Suppress exception or let bubble (bubble up to maintain host runtime integrity)
        return False


class FlightRecorder:
    """Main entrypoint for BlackBox Autonomous Agent Flight Recording."""

    def __init__(self, api_key: str, endpoint: str = "http://localhost:4000/api/v1"):
        self.api_key = api_key
        self.endpoint = endpoint.rstrip("/")

    def session(self, agent_name: str, tags: Optional[List[str]] = None) -> FlightSession:
        """Create a new flight recording context manager."""
        session_id = f"EX-{int(time.time() * 1000) % 10000}"
        return FlightSession(self, agent_name=agent_name, session_id=session_id, tags=tags)

    def _flush_session(self, session: FlightSession, total_duration_ms: int):
        """Send captured telemetry to BlackBox backend ingestion engine."""
        payload = {
            "executionId": session.session_id,
            "agentName": session.agent_name,
            "status": session.status,
            "durationMs": total_duration_ms,
            "stepCount": len(session.steps),
            "error": session.error,
            "steps": session.steps,
            "tags": session.tags,
        }

        try:
            req = urllib.request.Request(
                f"{self.endpoint}/executions",
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}",
                    "User-Agent": "BlackBox-Python-SDK/1.0.0",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=3) as resp:
                pass
        except Exception:
            # Non-blocking: SDK must never interrupt or break host agent workflow
            pass
