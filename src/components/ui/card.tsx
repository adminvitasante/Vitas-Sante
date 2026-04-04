import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  surface?: "lowest" | "low" | "default" | "high";
}

export function Card({ className, surface = "lowest", children, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl p-8", {
        "bg-surface-container-lowest": surface === "lowest",
        "bg-surface-container-low": surface === "low",
        "bg-surface-container": surface === "default",
        "bg-surface-container-high": surface === "high",
      }, className)}
      {...props}
    >
      {children}
    </div>
  );
}
