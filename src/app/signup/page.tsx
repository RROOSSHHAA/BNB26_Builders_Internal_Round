"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlackBoxLogo } from "@/components/ui/BlackBoxLogo";

export default function SignupPage() {
  const router = useRouter();
  const [org, setOrg] = React.useState("Autonomous Intelligence Lab");
  const [email, setEmail] = React.useState("sharwari@flightrecorder.ai");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-center items-center px-4 bg-grid-subtle">
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-white/15 text-white shadow-xs group-hover:border-white/30 transition-colors p-1.5">
          <BlackBoxLogo size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            BLACK BOX
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-sans font-medium text-zinc-400">
            AI Execution Intelligence
          </span>
        </div>
      </Link>

      <div className="w-full max-w-md rounded-xl border border-white/[0.08] bg-[#0c1017] p-6 sm:p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">Create Fleet Workspace</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Initialize your organization telemetry pipeline and start capturing agent runs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
              Organization Name
            </label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              required
              className="w-full rounded-md border border-white/10 bg-[#080b10] px-3.5 py-2 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-white/10 bg-[#080b10] px-3.5 py-2 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="cyan"
              isLoading={isLoading}
              className="w-full text-xs font-mono tracking-wider py-2.5"
            >
              <span>INITIALIZE WORKSPACE</span>
              <ArrowRight className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs text-zinc-500">
          <span>Already registered? </span>
          <Link href="/login" className="text-cyan-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
