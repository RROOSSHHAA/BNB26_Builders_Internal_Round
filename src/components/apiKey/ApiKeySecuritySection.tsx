"use client";

import * as React from "react";
import { Server, RotateCcw, Ban, ShieldCheck, Lock } from "lucide-react";

export function ApiKeySecuritySection() {
  const points = [
    {
      title: "Server-side only",
      desc: "Never expose API keys in client-side browsers or public git repositories.",
      icon: <Server className="h-4 w-4 text-zinc-300" />,
    },
    {
      title: "Environment Variables",
      desc: "Store production keys securely in server environment variables or KMS vaults.",
      icon: <Lock className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: "Periodic Rotation",
      desc: "Rotate long-lived keys periodically to minimize exposure window risks.",
      icon: <RotateCcw className="h-4 w-4 text-zinc-300" />,
    },
    {
      title: "Instant Revocation",
      desc: "Revoke compromised credentials immediately to block unauthorized telemetry.",
      icon: <Ban className="h-4 w-4 text-rose-400" />,
    },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0e121b] p-5 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
          Keep your API keys secure
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 items-stretch">
        {points.map((pt, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-white/[0.06] bg-[#090d14] p-3.5 space-y-2 flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {pt.icon}
                <span className="font-semibold text-zinc-200 text-xs">
                  {pt.title}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                {pt.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
