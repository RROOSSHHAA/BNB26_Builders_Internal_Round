import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "BLACK BOX — AI Flight Recorder for AI Agents",
  description: "Enterprise execution intelligence and AI-compressed root-cause diagnostics for autonomous agents.",
  icons: {
    icon: "/blackbox-logo-white.png",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#090a0f] text-[#f1f5f9] selection:bg-zinc-800 selection:text-zinc-100 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
