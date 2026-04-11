import type { Metadata } from "next";
import { Raleway, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const SITE_URL = "https://slateui.elias4044.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "SlateUI — Roblox UI Framework",
    template: "%s — SlateUI",
  },
  description:
    "A modular, event-driven Roblox UI framework built for developers who care about code quality. Zero globals. Router-driven navigation. Single require().",

  keywords: [
    "Roblox",
    "UI framework",
    "Roblox Studio",
    "Luau",
    "GUI",
    "SlateUI",
    "Roblox plugin",
    "Roblox UI library",
  ],

  authors: [{ name: "SlateUI" }],
  creator: "SlateUI",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SlateUI",
    title: "SlateUI — Roblox UI Framework",
    description:
      "A modular, event-driven Roblox UI framework. Zero globals. Router-driven navigation. Single require().",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SlateUI — Roblox UI Framework",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SlateUI — Roblox UI Framework",
    description:
      "A modular, event-driven Roblox UI framework. Zero globals. Router-driven navigation. Single require().",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`bg-[#0B0B0B] ${raleway.variable} ${mono.variable}`}>
      <body className="bg-[#0B0B0B] antialiased font-sans">{children}</body>
    </html>
  );
}
