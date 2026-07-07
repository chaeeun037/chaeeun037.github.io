import type { Metadata } from "next";
import Link from "next/link";
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
    default: "chaeeun037.log",
    template: "%s — chaeeun037.log",
  },
  description: "기술 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-gray-100 dark:border-gray-800">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold">
              chaeeun037.log
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
