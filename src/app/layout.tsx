import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Shuffle — A fast, native file manager for macOS";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s · Shuffle",
  },
  applicationName: "Shuffle",
  description: site.description,
  keywords: [
    "Shuffle",
    "macOS file manager",
    "Finder alternative",
    "Finder replacement",
    "best file manager for Mac",
    "open source file manager",
    "Apple Silicon file explorer",
    "GPU rendered file manager",
    "dual pane file manager macOS",
    "File Pilot for Mac",
    "Rust macOS app",
  ],
  authors: [{ name: site.author }],
  creator: site.author,
  publisher: site.author,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: "Shuffle",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Shuffle — a fast, native file manager for macOS" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "A free, open source, GPU-rendered Finder alternative for macOS. Native speed, dual panes, a command palette, and deep theming.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-[#e8edf7]">
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
