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
  title: "Leads — Incorporadoras",
  description: "Painel de leads de incorporadoras (CNAE 4110-7/00) — RFB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
