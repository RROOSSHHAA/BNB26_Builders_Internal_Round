"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types";
import { Terminal, Sparkles, Check } from "lucide-react";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (newAgent: Agent) => void;
}

export function AddAgentModal({
  isOpen,
  onClose,
  onAddAgent,
}: AddAgentModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [model, setModel] = React.useState("claude-3-7-sonnet");
  const [environment, setEnvironment] = React.useState("Development");
  const [framework, setFramework] = React.useState<"LangChain" | "CrewAI" | "AutoGen" | "LlamaIndex">("CrewAI");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: Agent = {
      id: `agt_${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      framework,
      model,
      status: "active",
      totalExecutions: 0,
      successRate: 100,
      failureCount: 0,
      successfulCount: 0,
      anomalyRate: 0,
      avgDurationMs: 8200,
      lastRunAt: new Date().toISOString(),
      description: description.trim() || "Autonomous workflow agent.",
      tags: [framework.toLowerCase(), "custom", "v1"],
      environment,
      recentHealth: [
        { id: "h1", status: "ok" },
        { id: "h2", status: "ok" },
      ],
      failureDistribution: [],
    };

    onAddAgent(newAgent);
    onClose();
    // Reset form
    setName("");
    setDescription("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect AI Agent"
      description="Register an autonomous agent to monitor execution telemetry and capture failure flight logs"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            <span>Create Agent</span>
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Agent Name */}
        <div>
          <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
            Agent Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Financial Audit Squad, Customer Triage Agent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief overview of the agent's workflow and execution goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none resize-none"
          />
        </div>

        {/* Framework & Model Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Framework
            </label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value as any)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="CrewAI">CrewAI</option>
              <option value="LangChain">LangChain</option>
              <option value="AutoGen">AutoGen</option>
              <option value="LlamaIndex">LlamaIndex</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
              Model / Provider
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070a0f] p-2 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Demo Reasoning Model">Demo Reasoning Model</option>
              <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
          </div>
        </div>

        {/* Environment */}
        <div>
          <label className="text-xs font-mono uppercase text-zinc-400 mb-1.5 block">
            Environment
          </label>
          <div className="flex items-center gap-2">
            {["Development", "Staging", "Production"].map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => setEnvironment(env)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                  environment === env
                    ? "border-cyan-500/50 bg-cyan-950/30 text-cyan-300 font-bold"
                    : "border-white/10 bg-[#070a0f] text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-white/[0.05] bg-[#0c1017] text-[11px] font-sans text-zinc-400 flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Mock configuration state. Once created, install the Black Box SDK inside your agent repo to pipe trace steps.
          </span>
        </div>
      </form>
    </Modal>
  );
}
