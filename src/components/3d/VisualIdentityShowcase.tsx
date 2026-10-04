"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FlightRecorderCore } from "./FlightRecorderCore";
import { NeuralGraphConcept } from "./NeuralGraphConcept";
import { ExecutionIntelligenceMap } from "./ExecutionIntelligenceMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Info, Sparkles, Layers, Box, Cpu } from "lucide-react";

type ConceptKey = "flight_recorder" | "neural_graph" | "intelligence_map";

interface EvaluationCriteria {
  visualQuality: number;
  relevance: number;
  clarity: number;
  uniqueness: number;
  performance: number;
  notes: string;
}

const EVALUATION_DATA: Record<ConceptKey, { title: string; subtitle: string; score: number; isWinner: boolean; criteria: EvaluationCriteria }> = {
  flight_recorder: {
    title: "Concept 1: Flight Recorder Core (Selected Signature)",
    subtitle: "High-density avionics telemetry cylinder with anomaly harmonic pulse and orbital stream rings",
    score: 9.8,
    isWinner: true,
    criteria: {
      visualQuality: 10,
      relevance: 10,
      clarity: 10,
      uniqueness: 9.5,
      performance: 9.7,
      notes: "Directly articulates the 'Flight Recorder' premise. The central monolith represents hardened, crash-proof trace storage, while orbital rings visualize real-time agent telemetry stream.",
    },
  },
  neural_graph: {
    title: "Concept 2: AI Agent Neural Graph",
    subtitle: "Inter-agent synapsing point cloud with dynamic execution edge weights",
    score: 7.2,
    isWinner: false,
    criteria: {
      visualQuality: 7.5,
      relevance: 7.0,
      clarity: 7.0,
      uniqueness: 6.5,
      performance: 8.0,
      notes: "Visually recognizable as an AI network, but generic. Fails to convey post-mortem diagnostics, execution compression, or flight recorder capabilities.",
    },
  },
  intelligence_map: {
    title: "Concept 3: Execution Intelligence Map",
    subtitle: "Chronological 3D strata separating Retrieval, Reasoning, Anomaly, and Finalization blocks",
    score: 8.1,
    isWinner: false,
    criteria: {
      visualQuality: 8.0,
      relevance: 8.5,
      clarity: 8.0,
      uniqueness: 8.0,
      performance: 8.0,
      notes: "Effectively conveys compressed execution regions, but resembles an abstract architectural block diagram rather than a hardened flight recorder instrument.",
    },
  },
};

export function VisualIdentityShowcase({ className }: { className?: string }) {
  const [activeConcept, setActiveConcept] = React.useState<ConceptKey>("flight_recorder");
  const [telemetryState, setTelemetryState] = React.useState<"anomaly" | "healthy">("anomaly");

  const current = EVALUATION_DATA[activeConcept];

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#080b11] p-6 lg:p-8 overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              3D Visual Identity Architecture
            </span>
            <Badge variant="cyan" size="sm">
              Design Decision
            </Badge>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-100">
            Black Box Visual Identity Exploration
          </h2>
          <p className="mt-1 text-xs text-zinc-400 max-w-xl">
            To avoid arbitrary 3D decoration, three distinct conceptual representations were designed and tested against strict developer product criteria.
          </p>
        </div>

        {/* Concept Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e1420] border border-white/[0.06]">
          <button
            onClick={() => setActiveConcept("flight_recorder")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5",
              activeConcept === "flight_recorder"
                ? "bg-white/10 text-cyan-300 font-semibold shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>Flight Recorder (Selected)</span>
          </button>

          <button
            onClick={() => setActiveConcept("neural_graph")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5",
              activeConcept === "neural_graph"
                ? "bg-white/10 text-zinc-200 font-semibold shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Neural Graph</span>
          </button>

          <button
            onClick={() => setActiveConcept("intelligence_map")}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5",
              activeConcept === "intelligence_map"
                ? "bg-white/10 text-zinc-200 font-semibold shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Execution Map</span>
          </button>
        </div>
      </div>

      {/* Main Display Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Canvas Viewport */}
        <div className="lg:col-span-7 relative h-[380px] rounded-xl border border-white/[0.06] bg-[#05070a] overflow-hidden flex items-center justify-center">
          {/* Subtle background radar circles */}
          <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

          {activeConcept === "flight_recorder" && (
            <FlightRecorderCore status={telemetryState} interactive={true} className="w-full h-full" />
          )}

          {activeConcept === "neural_graph" && (
            <NeuralGraphConcept className="w-full h-full" />
          )}

          {activeConcept === "intelligence_map" && (
            <ExecutionIntelligenceMap className="w-full h-full" />
          )}

          {/* Interactive Mode Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 bg-[#090d14]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-white/[0.06]">
              3D Canvas (Click & Drag to Rotate)
            </span>
          </div>

          {activeConcept === "flight_recorder" && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#090d14]/90 backdrop-blur-xs p-1 rounded-lg border border-white/10">
              <span className="text-[10px] font-mono text-zinc-400 px-2">Simulate Pulse:</span>
              <button
                onClick={() => setTelemetryState("anomaly")}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono",
                  telemetryState === "anomaly"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                Anomaly
              </button>
              <button
                onClick={() => setTelemetryState("healthy")}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono",
                  telemetryState === "healthy"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                Nominal
              </button>
            </div>
          )}
        </div>

        {/* Evaluation Matrix & Rationalization */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-zinc-100">{current.title}</h3>
              {current.isWinner && (
                <Badge variant="cyan" size="sm">
                  WINNER
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-400">{current.subtitle}</p>
          </div>

          {/* Criteria Scorecard */}
          <div className="rounded-lg border border-white/[0.06] bg-[#0c1017] p-4 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block pb-1 border-b border-white/[0.04]">
              Evaluation Criteria Matrix
            </span>

            {[
              { label: "Visual Quality & Polish", score: current.criteria.visualQuality },
              { label: "Relevance to Flight Recorder", score: current.criteria.relevance },
              { label: "Conceptual Clarity", score: current.criteria.clarity },
              { label: "Architectural Uniqueness", score: current.criteria.uniqueness },
              { label: "Framerate & Performance", score: current.criteria.performance },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        current.isWinner ? "bg-cyan-400" : "bg-zinc-400"
                      )}
                      style={{ width: `${metric.score * 10}%` }}
                    />
                  </div>
                  <span className="text-zinc-200 w-6 text-right">{metric.score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Evaluation Takeaway */}
          <div className="rounded-lg border border-white/[0.06] bg-[#0c1017] p-4">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Design Rationale
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {current.criteria.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
