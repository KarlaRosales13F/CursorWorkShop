import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/marketlab/header";
import { ThemeProvider } from "@/components/marketlab/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketLab",
  description: "Fake-money prediction markets for a Cursor workshop.",
  icons: {
    icon: "/logo/iso-marketlab.webp",
  },
};

const themeInitScript = `
(() => {
  const storageKey = "marketlab-theme";
  const stored = localStorage.getItem(storageKey);
  const theme = stored === "light" || stored === "dark" ? stored : "system";
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static theme bootstrap script */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="system" storageKey="marketlab-theme">
          <div className="flex min-h-svh flex-col">
            <Header />
            <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
