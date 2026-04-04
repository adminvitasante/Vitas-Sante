import { cn } from "@/lib/utils";
import { Icon } from "./icon";

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("bg-surface-container-lowest rounded-2xl p-6 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
        <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center">
          <Icon name={icon} size="sm" className="text-primary" />
        </div>
      </div>
      <p className="text-3xl font-black text-primary tracking-tight">{value}</p>
      {trend && <span className={cn("text-xs font-semibold", trendUp ? "text-secondary" : "text-error")}>{trend}</span>}
    </div>
  );
}
