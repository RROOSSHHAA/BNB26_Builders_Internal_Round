"use client";

import * as React from "react";
import Link from "next/link";
import { PublicNavigation } from "@/components/layout/navigation";
import { VisualIdentityShowcase } from "@/components/3d/VisualIdentityShowcase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Terminal,
  Layers,
  Sparkles,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Cpu,
  Zap,
  Activity,
  GitFork,
  ArrowUpRight,
  Database,
  Brain,
  Wrench,
  AlertTriangle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#06080d] text-[#f1f5f9] flex flex-col bg-grid-subtle">
      {/* Public Navbar */}
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>BLACK BOX FOUNDATION 1.0</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">MISSION TELEMETRY ACTIVE</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl">
              An AI Flight Recorder for{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Autonomous AI Agents
              </span>
            </h1>

            <p className="max-w-2xl text-sm md:text-base text-zinc-400 leading-relaxed font-sans">
              When an autonomous agent crashes, loops, or hallucinates across a 127-step multi-agent run, you don&apos;t need a raw log dump. You need AI-compressed execution intelligence to instantly locate where execution diverged.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="text-xs font-mono tracking-wider gap-2">
                  <span>ENTER CONSOLE</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/dashboard/executions/exec_tesla_variance_01">
                <Button variant="secondary" size="lg" className="text-xs font-mono tracking-wider gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span>INSPECT 127-STEP ANOMALY</span>
                </Button>
              </Link>
            </div>

            {/* Live Telemetry Pulse Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl pt-10">
              {[
                { label: "COMPRESSION FACTOR", val: "94.2%", sub: "127 steps → 4 regions" },
                { label: "ROOT CAUSE ACCURACY", val: "98.1%", sub: "Automated ML diagnosis" },
                { label: "TELEMETRY LATENCY", val: "0.4ms", sub: "Zero overhead hooks" },
                { label: "FRAMEWORK INTEGRATIONS", val: "CrewAI • LangChain • AutoGen", sub: "Python & OTel ready" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/[0.06] bg-[#090d14]/80 p-3.5 text-left backdrop-blur-xs"
                >
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    {stat.label}
                  </span>
                  <span className="text-lg font-bold font-mono text-zinc-100 mt-1 block">
                    {stat.val}
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block truncate">
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3D Visual Identity Showcase Section */}
      <section className="py-12 border-t border-white/[0.06] bg-[#07090e]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <VisualIdentityShowcase />
        </div>
      </section>

      {/* The Core Paradigm: AI-Compressed Execution */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Paradigm Shift
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              AI-Compressed Execution vs. Giant Raw Log Dumps
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              Standard observability platforms flood developers with 100+ raw span rows. Black Box compresses the execution trajectory into semantically grounded execution regions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* The Old Broken Way */}
            <div className="rounded-xl border border-red-500/20 bg-red-950/[0.06] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Legacy Raw Log Viewers (Cognitive Overload)
                  </h3>
                </div>
                <Badge variant="crimson" size="sm">
                  127 UNCOMPRESSED ROWS
                </Badge>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] text-zinc-500 max-h-64 overflow-hidden relative">
                <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                  [Step 001] GET /v1/edgar/10k ... status=200 latency=120ms
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                  [Step 002] parse_chunks_regex ... matches=14 latency=30ms
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                  [Step 003] vector_embed ... embedding_dim=1536 latency=140ms
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.04] opacity-75">
                  [Step 004..061] 58 more repetitive raw tool & LLM invocations...
                </div>
                <div className="p-2 rounded bg-red-900/30 border border-red-500/30 text-red-300">
                  [Step 062] HTTP 422 Unprocessable Entity - lost in the noise
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.04] opacity-50">
                  [Step 063..127] 64 cascaded hallucinated continuation steps...
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#090b10] to-transparent flex items-end justify-center pb-2 text-[10px] text-zinc-500">
                  Developer must manually scroll and guess where the mistake started
                </div>
              </div>
            </div>

            {/* The Black Box Way */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/[0.08] p-6 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.04)]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-zinc-100">
                    Black Box AI-Compressed Regions
                  </h3>
                </div>
                <Badge variant="cyan" size="sm">
                  4 MEANINGFUL REGIONS
                </Badge>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Data Retrieval", range: "Steps 1–28", status: "HEALTHY", col: "emerald", icon: Database },
                  { name: "Reasoning & Decomposition", range: "Steps 29–61", status: "HEALTHY", col: "cyan", icon: Brain },
                  { name: "Anomalous Region (Root Cause)", range: "Steps 62–78", status: "SUSPICIOUS REGION", col: "crimson", icon: AlertTriangle, anomaly: true },
                  { name: "Finalization & Output", range: "Steps 79–127", status: "WARNING", col: "amber", icon: Wrench },
                ].map((reg) => (
                  <div
                    key={reg.name}
                    className={`rounded-lg border p-3 flex items-center justify-between ${
                      reg.anomaly
                        ? "border-red-500/40 bg-red-950/20 shadow-xs"
                        : "border-white/[0.06] bg-[#0c111a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${reg.anomaly ? "bg-red-500/20 text-red-400" : "bg-white/[0.06] text-zinc-300"}`}>
                        <reg.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-100 block">
                          {reg.name}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400">
                          {reg.range}
                        </span>
                      </div>
                    </div>
                    <Badge variant={reg.anomaly ? "crimson" : "default"} size="sm">
                      {reg.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#05070a] py-8 text-center text-xs font-mono text-zinc-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">BLACK BOX</span>
            <span>•</span>
            <span>AI Flight Recorder for AI Agents</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-zinc-300">Console</Link>
            <Link href="/dashboard/executions" className="hover:text-zinc-300">Traces</Link>
            <Link href="/dashboard/api-keys" className="hover:text-zinc-300">API Keys</Link>
            <span>v1.0.0-foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
