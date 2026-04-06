"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { SidebarConfig } from "./sidebar-items";

export function Sidebar({ config, basePath }: { config: SidebarConfig; basePath: string }) {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col py-6 px-4 space-y-2 z-40 hidden md:flex">
      <div className="mb-8 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Vita-Sante-Logo.png" alt="Vita Santé" className="h-10 mb-2" />
        <p className="text-xs font-medium text-on-surface-variant">{config.subtitle}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {config.items.map((item) => {
          const fullHref = `${basePath}${item.href}`;
          const isActive = pathname === fullHref || pathname.startsWith(fullHref + "/");
          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-headline text-sm font-medium transition-all",
                isActive
                  ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-outline-variant/20 space-y-1">
        {config.ctaLabel && (
          <Link
            href={config.ctaHref || "#"}
            className="w-full mb-4 py-3 bg-error text-white rounded-xl font-headline text-sm font-bold flex items-center justify-center gap-2"
          >
            {config.ctaIcon && <Icon name={config.ctaIcon} size="sm" />}
            {config.ctaLabel}
          </Link>
        )}
        {config.bottomItems.map((item) => (
          <Link
            key={item.href}
            href={`${basePath}${item.href}`}
            className="flex items-center space-x-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high transition-all font-headline text-sm font-medium"
          >
            <Icon name={item.icon} size="sm" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="w-full flex items-center space-x-3 px-4 py-2 text-error hover:bg-error-container/30 transition-all font-headline text-sm font-medium rounded-lg mt-2"
        >
          <Icon name="logout" size="sm" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
