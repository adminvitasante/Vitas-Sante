import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5",
            "text-on-surface font-body text-sm placeholder:text-outline",
            "focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-colors",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
