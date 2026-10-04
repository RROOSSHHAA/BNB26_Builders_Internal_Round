# BlackBox AI Flight Recorder SDK ✈️📦

> Real-time flight recorder and diagnostic telemetry SDK for Autonomous AI Agents.

---

## 🐍 Python SDK (`blackbox-agent-recorder`)

### Installation
```bash
pip install blackbox-agent-recorder
```

### Quickstart (LangChain / CrewAI / Raw Python)
```python
from blackbox_recorder import FlightRecorder

# 1. Initialize with your API Key
recorder = FlightRecorder(api_key="bb_live_9f82d1c0...")

# 2. Wrap your agent session
with recorder.session(agent_name="DevOps SRE Agent") as session:
    # Checkpoints capture immutable memory state for time-travel debugging
    session.record_checkpoint("pre_migration", {"db_version": "14.2"})

    # Step telemetry captures inputs, tool calls, and outputs
    session.log_step(
        name="Execute Schema Migration",
        tool="postgres_client",
        inputs={"sql": "ALTER TABLE users ADD COLUMN tier VARCHAR(50);"},
        status="SUCCESS"
    )

    # If an exception happens, BlackBox automatically captures the crash log!
    result = agent.run("Perform database migration")
    session.record_output(result)
```

---

## ⚡ TypeScript / Node.js SDK (`@blackbox/recorder`)

### Installation
```bash
npm install @blackbox/recorder
```

### Quickstart (Vercel AI SDK / LangChain.js / Node.js)
```typescript
import { FlightRecorder } from "@blackbox/recorder";

const recorder = new FlightRecorder({
  apiKey: "bb_live_9f82d1c0..."
});

const session = recorder.startSession({ agentName: "Customer Support Agent" });

try {
  session.logStep({
    name: "Query Vector DB",
    tool: "pinecone_search",
    inputs: { query: "Refund policy" }
  });

  const reply = await myAgent.execute("Refund request");
  await session.complete(reply);
} catch (error) {
  // Captures stack trace and triggers BlackBox AI Root Cause Analysis
  await session.fail(error);
}
```

---

## 🌟 Why BlackBox SDK?
1. **Zero-Overhead & Non-Blocking**: Telemetry flushes asynchronously so your agent is never slowed down.
2. **Crash-Safe**: If the BlackBox server or network is unreachable, your agent keeps running normally without interruption.
3. **Deterministic Replay Ready**: State checkpoints allow developers to step backward and forward through agent decisions.
