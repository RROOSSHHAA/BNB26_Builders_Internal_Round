"use client";

import * as React from "react";
import { ArrowDown, Layers, Sparkles, Cpu, GitCompare, RotateCcw } from "lucide-react";

export function ModelAgnosticArchitecture() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-white/[0.08] bg-[#0e121b] p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
            Architecture
          </span>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-zinc-300" />
            <span>Built for your AI stack.</span>
          </h2>
        </div>

        <span className="rounded bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 text-[10px] font-medium text-zinc-300 self-start sm:self-center">
          Model-Agnostic Engine
        </span>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
        Black Box is designed around a provider-independent execution layer, allowing agents and models from different providers to be observed through a common execution format.
      </p>

      {/* Visual Pipeline Flow */}
      <div className="rounded-xl border border-white/[0.06] bg-[#090d14] p-5 space-y-4">
        {/* Tier 1: Different Providers */}
        <div>
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-2">
            1. Autonomous AI Providers & Runtimes
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs items-stretch">
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3 text-center flex flex-col justify-between h-full">
              <span className="font-semibold text-white block">Google</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Gemini 2.0 / 1.5</span>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3 text-center flex flex-col justify-between h-full">
              <span className="font-semibold text-white block">OpenAI</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">GPT-4o / o1 / o3</span>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3 text-center flex flex-col justify-between h-full">
              <span className="font-semibold text-white block">Anthropic</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Claude 3.5 Sonnet</span>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3 text-center flex flex-col justify-between h-full">
              <span className="font-semibold text-white block">Open-Source</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Ollama / vLLM</span>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3 text-center col-span-2 sm:col-span-1 flex flex-col justify-between h-full">
              <span className="font-semibold text-white block">Custom Gateway</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Enterprise Proxy</span>
            </div>
          </div>
        </div>

        {/* Down Arrow Separator */}
        <div className="flex justify-center text-zinc-600">
          <ArrowDown className="h-4 w-4 text-zinc-500" />
        </div>

        {/* Tier 2: Normalized Intermediate Execution Layer */}
        <div className="rounded-xl border border-white/10 bg-[#0e121b] p-4 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] border border-white/10 px-3 py-1 text-[11px] text-white font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            <span>COMMON BLACK BOX EXECUTION LAYER</span>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-xl mx-auto pt-1 leading-relaxed">
            Normalized JSON schema standardizing tool calls, multi-step thought chains, context window usage, and step latencies into a unified timeline format.
          </p>
        </div>

        {/* Down Arrow Separator */}
        <div className="flex justify-center text-zinc-600">
          <ArrowDown className="h-4 w-4 text-zinc-500" />
        </div>

        {/* Tier 3: Universal Downstream Observability */}
        <div>
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-2">
            2. Common Observability & Debugging Suite
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-stretch">
            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3.5 space-y-1 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs mb-1">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Causal Failure Diagnosis</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Identify root causes regardless of which underlying model executed the prompt.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3.5 space-y-1 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-xs mb-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Checkpoint Replay</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Rewind to Step 70 with cached prefixes and re-execute candidate patches safely.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-[#0e121b] p-3.5 space-y-1 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-xs mb-1">
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>Behavioral Diffing</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Compare divergence between different models or model iterations side-by-side.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
