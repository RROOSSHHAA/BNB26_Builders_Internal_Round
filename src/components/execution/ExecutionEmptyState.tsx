"use client";

import * as React from "react";
import { Radio, FilterX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { NoResultsState } from "@/components/ui/no-results-state";

interface ExecutionEmptyStateProps {
  type: "no_matches" | "first_time";
  onClearFilters?: () => void;
  onRecordExecution?: () => void;
}

export function ExecutionEmptyState({
  type,
  onClearFilters,
  onRecordExecution,
}: ExecutionEmptyStateProps) {
  if (type === "no_matches") {
    return (
      <NoResultsState
        title="No matching executions"
        description="Try a different search term or remove some filters."
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <EmptyState
      icon={Radio}
      title="No executions yet"
      description="Once your agents send execution traces to Black Box, they will appear here."
      primaryAction={{
        label: "Connect an Agent",
        href: "/dashboard/agents",
      }}
      secondaryAction={{
        label: "View Integrations",
        href: "/dashboard/integrations",
      }}
    />
  );
}
