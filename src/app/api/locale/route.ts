import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { locales } from "@/i18n/routing";

// POST /api/locale { locale: 'fr' | 'en' }
// Sets the NEXT_LOCALE cookie AND, if the user is authenticated,
// persists the choice to users.locale so it travels with the account.
export async function POST(req: NextRequest) {
  const { locale } = await req.json().catch(() => ({ locale: null }));

  if (!locale || !(locales as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  // Persist to the user record if logged in.
  const session = await auth();
  if (session?.user?.id) {
    await supabase
      .from("users")
      .update({ locale })
      .eq("id", session.user.id);
  }

  // Set cookie — 1 year, same-site so it survives navigation.
  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
