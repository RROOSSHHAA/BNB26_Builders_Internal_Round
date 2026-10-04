"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Terminal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlackBoxLogo } from "@/components/ui/BlackBoxLogo";

export function PublicNavigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#06080d]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/15 text-white shadow-xs group-hover:border-white/30 transition-colors p-1">
            <BlackBoxLogo size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              BLACK BOX
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-sans font-medium text-zinc-400">
              AI Execution Intelligence
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-zinc-400">
          <Link href="/dashboard" className="hover:text-zinc-100 transition-colors">
            Console
          </Link>
          <Link href="/dashboard/executions" className="hover:text-zinc-100 transition-colors">
            Trace Compression
          </Link>
          <Link href="/dashboard/integrations" className="hover:text-zinc-100 transition-colors">
            Integrations
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-100 transition-colors"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-mono">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="cyan" size="sm" className="text-xs font-mono gap-1.5">
              <span>Launch Console</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
