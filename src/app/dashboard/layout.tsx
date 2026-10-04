"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/layout/command-palette";
import { WorkspaceProvider, useWorkspace } from "@/context/WorkspaceContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { ToastProvider } from "@/context/ToastContext";
import { DemoStateProvider } from "@/context/DemoStateContext";
import { DeveloperStateSwitcher } from "@/components/ui/developer-state-switcher";

function DashboardShellContent({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isSidebarCollapsed } = useWorkspace();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f1f5f9] flex overflow-x-hidden font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-200",
          isSidebarCollapsed ? "md:pl-18" : "md:pl-64"
        )}
      >
        <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Main Content Workspace with smooth page transition */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <DemoStateProvider>
        <ToastProvider>
          <DashboardShellContent>{children}</DashboardShellContent>
        </ToastProvider>
      </DemoStateProvider>
    </WorkspaceProvider>
  );
}
