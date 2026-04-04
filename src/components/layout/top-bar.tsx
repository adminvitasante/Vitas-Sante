import { Icon } from "@/components/ui/icon";

interface TopBarProps {
  greeting: string;
  subtitle: string;
  initials: string;
}

export function TopBar({ greeting, subtitle, initials }: TopBarProps) {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-tight font-headline">{greeting}</h2>
        <p className="text-on-surface-variant font-medium">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-surface-container-low rounded-full text-primary relative">
          <Icon name="notifications" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
