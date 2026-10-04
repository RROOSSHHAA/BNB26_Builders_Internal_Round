"use client";

import * as React from "react";
import { AIProviderType } from "@/types";
import { Cpu, Terminal, Server, Sparkles, Orbit } from "lucide-react";

interface ProviderVisualMarkProps {
  type: AIProviderType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProviderVisualMark({
  type,
  size = "md",
  className = "",
}: ProviderVisualMarkProps) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const getVisual = () => {
    switch (type) {
      case "google":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-400 group-hover:border-blue-500/50",
          icon: <Sparkles className="h-4 w-4" />,
          label: "G",
          accent: "Google Gemini",
        };
      case "openai":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-500/50",
          icon: <Orbit className="h-4 w-4" />,
          label: "OA",
          accent: "OpenAI GPT",
        };
      case "anthropic":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:border-amber-500/50",
          icon: <Cpu className="h-4 w-4" />,
          label: "AN",
          accent: "Anthropic Claude",
        };
      case "local":
        return {
          bg: "bg-purple-500/10 border-purple-500/30 text-purple-400 group-hover:border-purple-500/50",
          icon: <Terminal className="h-4 w-4" />,
          label: "LOC",
          accent: "Local Ollama / vLLM",
        };
      case "custom":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-500/50",
          icon: <Server className="h-4 w-4" />,
          label: "CUST",
          accent: "Custom Gateway",
        };
    }
  };

  const config = getVisual();

  return (
    <div
      className={`flex items-center justify-center rounded-lg border font-mono font-bold transition-all shrink-0 ${sizeClasses[size]} ${config.bg} ${className}`}
      title={config.accent}
    >
      {config.icon}
    </div>
  );
}
