import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "next-themes";

import { Link, Toast } from "@heroui/react";

import { ThemeSwitcher } from "./components/ThemeSwitcher";

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
  title: "Rating Site",
  description: "Site to rate activities",
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
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          {children}

          <footer><Link href="/">Home</Link> | <Link href="activities">Activities</Link> | <ThemeSwitcher className="inline" /></footer>

          <Toast.Provider />
        </ThemeProvider>
      </body>
    </html>
  );
};