import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlackBoxLogoProps {
  className?: string;
  size?: number;
  variant?: "white" | "dark";
}

export function BlackBoxLogo({
  className,
  size = 24,
  variant = "white",
}: BlackBoxLogoProps) {
  const src =
    variant === "white"
      ? "/blackbox-logo-white.png"
      : "/blackbox-logo-transparent.png";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt="Black Box Logo"
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain select-none"
        priority
      />
    </div>
  );
}
