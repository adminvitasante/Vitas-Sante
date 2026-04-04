import { cn } from "@/lib/utils";
import { Icon } from "./icon";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

const variantStyles = {
  success: "bg-secondary-container text-on-secondary-container",
  warning: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  error: "bg-error-container text-on-error-container",
  info: "bg-primary-fixed text-on-primary-fixed-variant",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export function Badge({ variant = "neutral", children, icon, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", variantStyles[variant], className)}>
      {icon && <Icon name={icon} size="sm" filled />}
      {children}
    </span>
  );
}
