"use client";

import * as React from "react";
import { DemoStateMode } from "@/types/state";

interface DemoStateContextType {
  mode: DemoStateMode;
  setMode: (mode: DemoStateMode) => void;
  isRetrying: boolean;
  triggerRetry: (onComplete?: () => void) => void;
  resetToPopulated: () => void;
}

const DemoStateContext = React.createContext<DemoStateContextType | undefined>(undefined);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<DemoStateMode>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get("state");
      if (
        stateParam === "loading" ||
        stateParam === "empty" ||
        stateParam === "error" ||
        stateParam === "partial" ||
        stateParam === "populated"
      ) {
        return stateParam;
      }
    }
    return "populated";
  });
  const [isRetrying, setIsRetrying] = React.useState<boolean>(false);

  const triggerRetry = React.useCallback((onComplete?: () => void) => {
    setIsRetrying(true);
    setMode("loading");
    // Simulate brief recovery cycle
    setTimeout(() => {
      setIsRetrying(false);
      setMode("populated");
      onComplete?.();
    }, 1200);
  }, []);

  const resetToPopulated = React.useCallback(() => {
    setMode("populated");
  }, []);

  return (
    <DemoStateContext.Provider
      value={{
        mode,
        setMode,
        isRetrying,
        triggerRetry,
        resetToPopulated,
      }}
    >
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState() {
  const context = React.useContext(DemoStateContext);
  if (!context) {
    throw new Error("useDemoState must be used within a DemoStateProvider");
  }
  return context;
}
