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
  title: {
    default: "Scuola Sci Pratonevoso",
    template: "%s · Scuola Sci Pratonevoso",
  },
  description:
    "App ufficiale della Scuola Sci Pratonevoso: lezioni, schede, badge e messaggi per allievi e maestri.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ski-ice text-ski-ink">
        {children}
      </body>
    </html>
  );
}
