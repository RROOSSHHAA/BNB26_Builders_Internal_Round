import * as React from "react";
import { FilterX, RotateCcw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface NoResultsStateProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  onClearFilters?: () => void;
  className?: string;
}

export function NoResultsState({
  title = "No matching records found",
  description = "Try adjusting your search criteria, clearing active filters, or expanding the time window.",
  searchTerm,
  onClearFilters,
  className,
}: NoResultsStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-white/10 bg-[#070a11]/60 font-mono transition-all duration-200",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#0e1420] text-zinc-400 mb-3 shadow-inner">
        <FilterX className="h-5 w-5 text-amber-400/80 stroke-[1.5]" />
      </div>

      <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">{title}</h3>
      
      {searchTerm && (
        <div className="mt-1 text-xs text-cyan-400 font-mono">
          Query: &ldquo;<span className="text-zinc-200">{searchTerm}</span>&rdquo;
        </div>
      )}

      <p className="mt-1 max-w-sm text-xs text-zinc-400 leading-relaxed font-sans sm:font-mono">
        {description}
      </p>

      {onClearFilters && (
        <div className="mt-5">
          <Button
            size="sm"
            variant="outline"
            onClick={onClearFilters}
            className="border-white/15 hover:border-white/30 text-zinc-300 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Active Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
