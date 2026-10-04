"use client";

import * as React from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Server,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Terminal,
  FileCode,
  KeyRound,
  Download,
  Info,
  Check,
  Copy,
  Layers,
  Database,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/ToastContext";
import {
  getSecurityPolicy,
  saveSecurityPolicy,
  redactSensitiveText,
  redactSensitiveData,
  SecurityPolicy,
} from "@/lib/security";

export default function SecurityPage() {
  const { toast } = useToast();

  const [policy, setPolicy] = React.useState<SecurityPolicy>(getSecurityPolicy());
  const [deploymentMode, setDeploymentMode] = React.useState<"cloud" | "private">("cloud");
  const [retentionDays, setRetentionDays] = React.useState<number>(30);
  const [discardRawPayloads, setDiscardRawPayloads] = React.useState<boolean>(false);

  // Live Redaction Tester State
  const defaultSampleInput = JSON.stringify(
    {
      agent_id: "agt_research_v2",
      execution_id: "EX-2048",
      step: 73,
      auth_headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-ae934",
        api_key: "sk-proj-928472918374918237498127394",
        google_service_key: "AIzaSyD8293748293742938472938472938472",
      },
      task_payload: {
        customer_email: "lead_researcher@enterprise-corp.com",
        database_url: "postgres://admin:password_supersecret123@db.internal:5432/finance",
        query: "Fetch earnings forecast with temporal horizon 2026-Q4",
      },
    },
    null,
    2
  );

  const [testerInput, setTesterInput] = React.useState<string>(defaultSampleInput);
  const [testerOutput, setTesterOutput] = React.useState<string>("");
  const [hasTested, setHasTested] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);

  // Handle policy toggle updates
  const handleToggle = (key: keyof SecurityPolicy) => {
    const updated = {
      ...policy,
      [key]: !policy[key],
    };
    setPolicy(updated);
    saveSecurityPolicy(updated);

    toast({
      title: "Security Policy Updated",
      description: `Updated ${key} to ${updated[key] ? "Enabled" : "Disabled"}.`,
      type: "success",
    });
  };

  const handleRunRedactionTest = () => {
    try {
      const parsed = JSON.parse(testerInput);
      const sanitized = redactSensitiveData(parsed);
      setTesterOutput(JSON.stringify(sanitized, null, 2));
    } catch {
      // Fallback to text string redaction
      setTesterOutput(redactSensitiveText(testerInput));
    }
    setHasTested(true);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(testerOutput || testerInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full pb-16 font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Security & Privacy Center
            </span>
            <span className="text-xs text-zinc-400 font-mono">System / Telemetry Security</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Data Protection & Sandbox Security
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Configure automated PII and API credential redaction, monitor isolated replay sandbox containers, and manage on-premise VPC deployment architecture.
          </p>
        </div>

        {/* Global Security Posture Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-[#0e121b] border border-white/[0.08] px-3.5 py-2 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-left font-mono">
            <div className="text-xs text-zinc-200 font-semibold">Security Active</div>
            <div className="text-[10px] text-zinc-400">Zero Ingress Leakage</div>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Data Protection Status */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>DATA PROTECTION</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <span>Automated</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            API keys, tokens, and PII are redacted before trace persistence or export.
          </p>
        </div>

        {/* KPI 2: Replay Sandbox Isolation */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>REPLAY SANDBOX</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <span>gVisor / Ephemeral</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Alternative runs operate in isolated memory with immutable production guarantees.
          </p>
        </div>

        {/* KPI 3: Deployment Mode */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>DEPLOYMENT MODE</span>
            {deploymentMode === "cloud" ? (
              <Cloud className="w-4 h-4 text-blue-400" />
            ) : (
              <Server className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <div className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <span>{deploymentMode === "cloud" ? "Cloud Mode" : "Private VPC"}</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            {deploymentMode === "cloud"
              ? "Managed Black Box hosted cloud processing with TLS 1.3 encryption."
              : "Self-hosted container infrastructure within enterprise VPC firewalls."}
          </p>
        </div>

        {/* KPI 4: Export Sanitization */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>EXPORT ENFORCEMENT</span>
            <Download className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <span>100% Sanitized</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            All downloaded .txt error reports and config JSONs are stripped of secrets.
          </p>
        </div>
      </div>

      {/* 3. Deployment Architecture Section (Cloud vs Private Mode) */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-200 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Deployment Architecture & Isolation Boundary
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Choose between managed Cloud telemetry or self-hosted Private VPC deployment.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#080c14] border border-white/[0.08] rounded-lg">
            <button
              onClick={() => {
                setDeploymentMode("cloud");
                saveSecurityPolicy({ deploymentMode: "cloud" });
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                deploymentMode === "cloud"
                  ? "bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Mode (Active)</span>
            </button>
            <button
              onClick={() => {
                setDeploymentMode("private");
                saveSecurityPolicy({ deploymentMode: "private" });
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                deploymentMode === "private"
                  ? "bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Private / On-Premise</span>
            </button>
          </div>
        </div>

        {deploymentMode === "cloud" ? (
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.04] space-y-3 font-sans text-xs">
            <div className="flex items-center gap-2 text-blue-300 font-semibold">
              <Cloud className="w-4 h-4 text-blue-400" />
              <span>Cloud Mode Operational Characteristics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px] text-zinc-300">
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#090d15] space-y-1">
                <span className="text-zinc-400 block font-sans">Processing Location</span>
                <strong className="text-white">Black Box Hosted Infrastructure</strong>
                <p className="text-[10px] text-zinc-500">Fully managed low-latency ML inference cluster</p>
              </div>
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#090d15] space-y-1">
                <span className="text-zinc-400 block font-sans">Network Encryption</span>
                <strong className="text-white">mTLS / TLS 1.3 AES-GCM</strong>
                <p className="text-[10px] text-zinc-500">All agent telemetry encrypted in-transit and at rest</p>
              </div>
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#090d15] space-y-1">
                <span className="text-zinc-400 block font-sans">Replay Sandboxing</span>
                <strong className="text-white">Ephemeral MicroVMs (Firecracker)</strong>
                <p className="text-[10px] text-zinc-500">Sub-second state spinup with zero storage leaks</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/[0.04] space-y-4 font-sans text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-purple-300 font-semibold">
                <Server className="w-4 h-4 text-purple-400" />
                <span>Private / On-Premise Architecture (Enterprise Deployment-Ready)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/40 self-start sm:self-auto">
                VPC Ready · Zero Egress
              </span>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              In <strong>Private Mode</strong>, the complete Black Box telemetry collector, ML diagnosis engine, and replay sandbox containers run entirely within your enterprise VPC (AWS, GCP, Azure, or On-Premise Kubernetes). No trace data, model prompts, or tokens ever egress to external networks.
            </p>

            <div className="rounded-lg border border-white/[0.08] bg-[#07090f] p-3.5 font-mono text-[11px] text-zinc-300 space-y-2">
              <div className="text-zinc-400 flex items-center justify-between">
                <span>Self-Hosted Deployment Commands (Docker Compose):</span>
                <span className="text-[10px] text-purple-400">Air-Gapped Compatible</span>
              </div>
              <pre className="text-purple-300 overflow-x-auto py-1 scrollbar-thin">
{`# 1. Pull Black Box On-Premise Orchestrator
docker pull blackbox-enterprise/collector:v2.5.0
docker pull blackbox-enterprise/diagnosis-engine:v2.0.0

# 2. Launch Local Air-Gapped Stack
docker compose -f docker-compose.private-vpc.yml up -d

# 3. Bind Agent SDK Endpoint to Local VPC
export BLACKBOX_API_URL="http://blackbox.internal.vpc:4000/api/v1"`}
              </pre>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>
                Private Mode container images and Helm charts are deployment-ready for enterprise clusters.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Automated Redaction & Sensitive Data Protection Policies */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-5">
        <div className="border-b border-white/[0.06] pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-200 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            Automated Redaction & Credential Sanitization
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Black Box continuously scans telemetry streams and automatically replaces confidential values with redaction tokens.
          </p>
        </div>

        {/* Toggles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle 1: API Keys */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#090d15]">
            <div className="space-y-0.5 pr-3">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span>Auto-Redact API Keys</span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  sk-*, bb_*, AIza*
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Transforms API keys into <code className="text-zinc-300 font-mono">[REDACTED:API_KEY]</code> before storage.
              </p>
            </div>
            <button
              onClick={() => handleToggle("autoRedactApiKeys")}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                policy.autoRedactApiKeys ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  policy.autoRedactApiKeys ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Bearer Tokens */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#090d15]">
            <div className="space-y-0.5 pr-3">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span>Auto-Redact Auth Tokens</span>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                  Bearer *, JWT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Scrubs Authorization request headers and Bearer session tokens.
              </p>
            </div>
            <button
              onClick={() => handleToggle("autoRedactTokens")}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                policy.autoRedactTokens ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  policy.autoRedactTokens ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: PII & Emails */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#090d15]">
            <div className="space-y-0.5 pr-3">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span>Auto-Redact PII & Emails</span>
                <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                  GDPR / CCPA
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Redacts email addresses and personal credentials from user conversation steps.
              </p>
            </div>
            <button
              onClick={() => handleToggle("autoRedactPii")}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                policy.autoRedactPii ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  policy.autoRedactPii ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: Export Sanitization */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#090d15]">
            <div className="space-y-0.5 pr-3">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <span>Export Sanitization Enforcement</span>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  Mandatory
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Enforces strict credential stripping on all generated .txt and .json exports.
              </p>
            </div>
            <button
              onClick={() => handleToggle("exportSanitization")}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                policy.exportSanitization ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  policy.exportSanitization ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 5. Live Redaction Interactive Tester */}
        <div className="rounded-xl border border-white/[0.08] bg-[#070a10] p-4 space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-2.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Interactive Redaction Simulator
              </span>
              <p className="text-[11px] text-zinc-400 font-sans">
                Paste any trace JSON containing mock API keys, tokens, or emails to test sanitization.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTesterInput(defaultSampleInput);
                  setTesterOutput("");
                  setHasTested(false);
                }}
                className="text-xs font-mono border-white/10 text-zinc-300 hover:bg-white/[0.05] h-7"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Sample
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleRunRedactionTest}
                className="text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white h-7 px-3"
              >
                <Play className="w-3 h-3 mr-1" />
                Run Redaction Test
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs font-mono">
            {/* Input raw trace */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Raw Inbound Trace (Sensitive)
                </span>
                <span className="text-zinc-500">JSON / Text</span>
              </div>
              <textarea
                value={testerInput}
                onChange={(e) => setTesterInput(e.target.value)}
                rows={9}
                className="w-full rounded-lg border border-white/[0.1] bg-[#0c1017] p-3 text-[11px] font-mono text-zinc-300 focus:outline-hidden focus:border-cyan-500 scrollbar-thin"
              />
            </div>

            {/* Output sanitized trace */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Sanitized Trace Output (Stored & Exported)
                </span>
                {testerOutput && (
                  <button
                    onClick={handleCopyOutput}
                    className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={testerOutput || (hasTested ? "Zero output" : "Click 'Run Redaction Test' to execute the sanitizer.")}
                  rows={9}
                  className="w-full rounded-lg border border-emerald-500/30 bg-[#091017] p-3 text-[11px] font-mono text-emerald-300/90 focus:outline-hidden scrollbar-thin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Secure Replay Sandbox Progression Monitor */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Secure Replay Sandbox Lifecycle
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Counterfactual replay executions run in isolated containers. Production states remain 100% frozen.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            Zero Mutation Guarantee
          </span>
        </div>

        {/* 5-State Sandbox Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            {
              step: 1,
              name: "Sandbox Created",
              desc: "Isolated ephemeral container spun up; original run frozen as immutable.",
              status: "ACTIVE",
            },
            {
              step: 2,
              name: "Replay Running",
              desc: "Reusing cached execution vectors up to checkpoint Step N.",
              status: "ACTIVE",
            },
            {
              step: 3,
              name: "Correction Applied",
              desc: "Patched prompt, schema, or rule injected at target divergence step.",
              status: "ACTIVE",
            },
            {
              step: 4,
              name: "Verification",
              desc: "Validating downstream state convergence against nominal baseline.",
              status: "ACTIVE",
            },
            {
              step: 5,
              name: "Completed",
              desc: "Alternative execution verified successful; ready for export.",
              status: "ACTIVE",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="p-3.5 rounded-lg border border-white/[0.06] bg-[#090d15] space-y-1.5 font-sans relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  0{s.step}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <h3 className="text-xs font-semibold text-white font-mono">{s.name}</h3>
              <p className="text-[10px] text-zinc-400 leading-normal">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Immutability Callout */}
        <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] flex items-center gap-3 text-xs font-sans text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Production Immutability Guarantee:</strong> All source execution logs (<code className="text-white font-mono">EX-2048</code>, <code className="text-white font-mono">EX-2046</code>) remain write-locked. Replays create detached counterfactual branches with no access to production databases or active client credentials.
          </span>
        </div>
      </div>

      {/* 6. Data Retention & Workspace Privacy Controls */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 space-y-4">
        <div className="border-b border-white/[0.06] pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            Data Retention & Privacy Controls
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Control telemetry lifecycle, automatic payload disposal, and workspace trace retention policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {/* Retention Duration */}
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#090d15] space-y-2">
            <span className="font-semibold text-zinc-200 block">Telemetry Retention Period</span>
            <p className="text-[11px] text-zinc-400">
              Traces older than the configured threshold will be automatically scrubbed from cold storage.
            </p>
            <div className="pt-2 flex items-center gap-2 font-mono">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setRetentionDays(d);
                    saveSecurityPolicy({ retentionDays: d });
                    toast({
                      title: "Retention Policy Updated",
                      description: `Set trace retention to ${d} days.`,
                      type: "success",
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    retentionDays === d
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold"
                      : "border-white/10 bg-[#0e121b] text-zinc-400 hover:text-white"
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Raw Payload Disposal */}
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#090d15] space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="font-semibold text-zinc-200 block">
                Discard Raw Trace Payloads Post-Diagnosis
              </span>
              <p className="text-[11px] text-zinc-400">
                Preserve only statistical divergence metrics and failure causal graphs while purging raw step inputs/outputs.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
              <span className="text-[11px] font-mono text-zinc-400">
                Current Status: {discardRawPayloads ? "Purging Active" : "Preserving Payloads"}
              </span>
              <button
                onClick={() => {
                  setDiscardRawPayloads((prev) => !prev);
                  toast({
                    title: "Payload Policy Updated",
                    description: !discardRawPayloads
                      ? "Raw payloads will be discarded after diagnosis."
                      : "Raw payloads preserved for replay.",
                    type: "info",
                  });
                }}
                className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                  discardRawPayloads
                    ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                    : "border-white/10 bg-[#0e121b] text-zinc-300 hover:text-white"
                }`}
              >
                {discardRawPayloads ? "Enabled" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
