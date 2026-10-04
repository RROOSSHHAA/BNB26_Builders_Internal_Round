"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Terminal, Sparkles, Code2 } from "lucide-react";

interface RecordExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecordExecutionModal({
  isOpen,
  onClose,
}: RecordExecutionModalProps) {
  const [lang, setLang] = React.useState<"python" | "typescript">("python");
  const [copied, setCopied] = React.useState(false);

  const pythonCode = `# 1. Install SDK
pip install blackbox-agent-recorder

# 2. Wrap your agent execution
from blackbox import FlightRecorder

recorder = FlightRecorder(api_key="bb_live_9f82d1c0...")

with recorder.session(agent_name="Research Agent") as session:
    # Your agent code runs normally
    result = agent.run("Audit Tesla Q4 financial margins")
    session.record_output(result)`;

  const tsCode = `// 1. Install SDK
npm install @blackbox/recorder

// 2. Wrap your agent execution
import { FlightRecorder } from "@blackbox/recorder";

const recorder = new FlightRecorder({
  apiKey: "bb_live_9f82d1c0..."
});

const session = await recorder.startSession({ agentName: "Research Agent" });
const result = await agent.run("Audit Tesla Q4 financial margins");
await session.complete(result);`;

  const activeSnippet = lang === "python" ? pythonCode : tsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Agent Execution"
      description="Ingest telemetry from your autonomous agents with zero configuration"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-mono text-zinc-500">
            Frontend Preview Mode • Mock Telemetry
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Language Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-white/[0.08] bg-[#070a0f]">
            <button
              onClick={() => setLang("python")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                lang === "python"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setLang("typescript")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                lang === "typescript"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              TypeScript
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="relative rounded-lg border border-white/[0.08] bg-[#05080e] p-4 overflow-x-auto">
          <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
            {activeSnippet}
          </pre>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0c1017] flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-zinc-400 leading-relaxed">
            Black Box automatically discovers and segments your trace steps into
            high-level execution regions without requiring manual telemetry annotation.
          </p>
        </div>
      </div>
    </Modal>
  );
}
