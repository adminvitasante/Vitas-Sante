import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-headline font-bold tracking-tight transition-all active:scale-95",
          {
            "clinical-gradient text-white shadow-lg hover:opacity-90": variant === "primary",
            "text-primary hover:bg-surface-container-high": variant === "secondary",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white": variant === "ghost",
            "bg-error text-white hover:opacity-90": variant === "danger",
          },
          {
            "px-4 py-2 text-sm rounded-xl": size === "sm",
            "px-6 py-3 text-sm rounded-xl": size === "md",
            "px-8 py-4 text-lg rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
