import React from "react";
import { cn } from "@/lib/utils";

export type FoodType = "veg" | "non_veg" | "vegan" | "egg" | "Veg" | "NonVeg" | "Vegan" | "Egg";

export function FoodTypeIcon({
  type,
  className,
  size = "md",
}: {
  type?: FoodType | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const normalized = (type || "").toLowerCase().replace(/[^a-z]/g, "");
  const isVeg = normalized === "veg" || normalized === "vegetarian";
  const isNonVeg = normalized === "nonveg";
  const isEgg = normalized === "egg";
  const isVegan = normalized === "vegan";

  const boxSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4.5 h-4.5" : "w-3.5 h-3.5";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2";

  if (isVeg || isVegan) {
    return (
      <span
        title={isVegan ? "Vegan" : "Vegetarian"}
        className={cn(
          "inline-flex items-center justify-center border border-emerald-600 rounded-[3px] bg-emerald-50/60 shrink-0",
          boxSize,
          className,
        )}
      >
        <span className={cn("rounded-full bg-emerald-600", dotSize)} />
      </span>
    );
  }

  if (isEgg) {
    return (
      <span
        title="Contains Egg"
        className={cn(
          "inline-flex items-center justify-center border border-amber-600 rounded-[3px] bg-amber-50/60 shrink-0",
          boxSize,
          className,
        )}
      >
        <span className={cn("rounded-full bg-amber-600", dotSize)} />
      </span>
    );
  }

  // Non-Veg default
  return (
    <span
      title="Non-Vegetarian"
      className={cn(
        "inline-flex items-center justify-center border border-rose-600 rounded-[3px] bg-rose-50/60 shrink-0",
        boxSize,
        className,
      )}
    >
      <span
        className={cn(
          "border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-rose-600",
          size === "sm" ? "scale-75" : size === "lg" ? "scale-125" : "",
        )}
      />
    </span>
  );
}

export default FoodTypeIcon;
