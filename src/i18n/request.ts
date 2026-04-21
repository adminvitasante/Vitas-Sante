import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./routing";

// Resolves locale from (priority):
//   1. NEXT_LOCALE cookie (set by the language toggle server action)
//   2. Default ('fr')
// We do NOT use URL-based locale routing (no /fr/...) because that would
// require restructuring every protected route. Cookie-based switching
// keeps the app tree flat and still persists the choice across visits.

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const locale =
    cookieLocale && (locales as readonly string[]).includes(cookieLocale)
      ? cookieLocale
      : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
