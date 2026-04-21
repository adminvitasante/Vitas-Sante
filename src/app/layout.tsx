import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/providers";
import { DemoBanner } from "@/components/shared/demo-banner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vita Santé Club",
  description: "Premium health platform for Haiti and its Diaspora",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} font-body bg-surface text-on-surface antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <DemoBanner />
            {/*
              Wrapper shifts all page content down by --banner-h so the
              fixed banner doesn't overlap. Fixed elements (navbar,
              sidebar) ignore this wrapper — they each set
              `top: var(--banner-h, 0px)` themselves.
            */}
            <div style={{ paddingTop: "var(--banner-h, 0px)" }}>{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
