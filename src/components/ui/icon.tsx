import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  filled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = { sm: "text-lg", md: "text-2xl", lg: "text-4xl", xl: "text-5xl" };

export function Icon({ name, filled = false, size = "md", className }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", sizeMap[size], className)}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {name}
    </span>
  );
}
