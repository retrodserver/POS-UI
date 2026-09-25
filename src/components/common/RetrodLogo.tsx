import React from "react";
import { cn } from "@/lib/utils";

export interface RetrodLogoProps {
  className?: string;
  variant?: "dark" | "light" | "auto";
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RetrodLogo({
  className,
  variant = "dark",
  collapsed = false,
  size = "md",
}: RetrodLogoProps) {
  const isDark = variant === "dark";

  if (collapsed) {
    return (
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl font-sans font-black tracking-tighter text-[19px] transition-transform hover:scale-105 select-none shadow-md",
          isDark
            ? "bg-white text-[#0b192c] shadow-black/20"
            : "bg-slate-900 text-white shadow-slate-900/20",
          className,
        )}
      >
        <span>R</span>
        <span className="text-teal-500 font-black">.</span>
      </div>
    );
  }

  const heightClasses = {
    sm: "h-7",
    md: "h-8",
    lg: "h-10",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex flex-col select-none leading-none group transition-all",
        heightClasses,
        className,
      )}
    >
      {/* Vector Retrod. Travel Tech Logo */}
      <svg
        viewBox="0 0 170 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "h-full w-auto block transition-transform group-hover:scale-[1.02]",
          isDark ? "text-white" : "text-slate-950",
        )}
      >
        <text
          x="0"
          y="38"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, 'Inter', 'Montserrat', 'Segoe UI', sans-serif"
          fontWeight="900"
          fontSize="44"
          letterSpacing="-1.8"
        >
          Retrod
          <tspan fill="#0d9488">.</tspan>
        </text>
        <text
          x="166"
          y="50"
          textAnchor="end"
          fill={isDark ? "#cbd5e1" : "#475569"}
          fontFamily="system-ui, -apple-system, 'Inter', sans-serif"
          fontWeight="800"
          fontSize="11"
          letterSpacing="0.8"
        >
          Travel Tech
        </text>
      </svg>
    </div>
  );
}

export default RetrodLogo;
