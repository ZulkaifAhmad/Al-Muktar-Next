import React, { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import MainLayoutShell from "@/components/MainLayoutShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Al-Mukhtar — Premier Islamic & Academic Institute",
  description:
    "An esteemed Islamic institution cultivating future scholars and principled leaders through traditional Islamic jurisprudence, Tajweed, Quranic sciences, Arabic linguistics, and contemporary leadership.",
  keywords: [
    "Al-Mukhtar",
    "Islamic Institute",
    "Dars-e-Nizami",
    "Tajweed",
    "Quran Recitation",
    "Arabic Language",
    "Islamic Studies",
    "Peshawar",
  ],
  authors: [{ name: "Al-Mukhtar Institute" }],
  openGraph: {
    title: "Al-Mukhtar — Islamic & Academic Institute",
    description:
      "Cultivating principled scholars anchored in classical authenticity with real-world relevance.",
    url: siteUrl,
    siteName: "Al-Mukhtar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Institute",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900 dark:bg-[#080f19] dark:text-slate-100 min-h-screen">
        <Providers>
          <Suspense fallback={null}>
            <MainLayoutShell>{children}</MainLayoutShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
