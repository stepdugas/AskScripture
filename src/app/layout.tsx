import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PreferencesProvider } from "@/lib/preferences/provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { env } from "@/lib/env";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const verification: Record<string, string> = {};
if (env.googleSiteVerification) verification.google = env.googleSiteVerification;
if (env.bingSiteVerification) verification.other = env.bingSiteVerification;

export const metadata: Metadata = {
  metadataBase: new URL("https://askscripture.com"),
  title: {
    default: "AskScripture — Read the Bible with context, not commentary",
    template: "%s · AskScripture",
  },
  description:
    "Read the Bible with side-by-side translations, original-language word studies (Greek + Hebrew), 340,000 cross-references, and a study chat with six framings. Editorial, sourced, no denominational agenda.",
  openGraph: { type: "website", siteName: "AskScripture" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "AskScripture — Daily verse" },
      ],
    },
  },
  ...(Object.keys(verification).length > 0 ? { verification } : {}),
};

export const viewport: Viewport = {
  themeColor: "#1B2845",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <PreferencesProvider>
          <ServiceWorkerRegister />
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<HeaderFallback />}>
              <SiteHeader />
            </Suspense>
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}

function HeaderFallback() {
  return <div className="h-14 border-b border-rule" />;
}
