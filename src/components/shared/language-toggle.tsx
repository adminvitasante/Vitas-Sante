"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function LanguageToggle({ className }: { className?: string }) {
  const [locale, setLocale] = useState<"fr" | "en">("fr");

  return (
    <button
      onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
      className={cn("text-primary font-bold border-b-2 border-primary font-headline text-sm tracking-tight", className)}
    >
      {locale === "fr" ? "FR" : "EN"} | {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
