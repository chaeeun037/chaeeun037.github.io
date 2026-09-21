import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import DiverTrack from "@/components/DiverTrack";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "ko_KR",
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        {/* 탐험 일지 테마 픽셀 폰트 (About 캐릭터 시트 등에서 사용). Google Fonts 미제공이라 CDN 로드 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/* 헤더: 로고 + GitHub·RSS. Posts·About 링크는 뺐다 —
            랜딩의 지름길 아이콘(텐트→About, 랜턴→모든 기록)이 내비를 대체한다(핸드오프 §4-1).
            그 지름길은 히어로 씬(#28)에 있으므로, 그때까지 About 은 랜딩 하단·직접 URL 로 간다. */}
        <header className="zb-header">
          <div className="wrap flex items-center justify-between py-4">
            <Link href="/" className="zb-logo">
              {SITE_NAME}
            </Link>
            <nav className="flex items-center gap-4">
              <a
                href="https://github.com/chaeeun037"
                className="zb-icon"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              </a>
              <a href="/feed.xml" className="zb-icon" aria-label="RSS">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M2 11.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" transform="translate(0 -3)" />
                  <path d="M2 5.5v2.2c3.36 0 6.1 2.74 6.1 6.1h2.2C10.3 9.2 6.6 5.5 2 5.5Z" transform="translate(0 -2)" />
                  <path d="M2 1.5v2.2c5.57 0 10.1 4.53 10.1 10.1h2.2C14.3 7.3 8.8 1.5 2 1.5Z" transform="translate(0 -1)" />
                </svg>
              </a>
            </nav>
          </div>
        </header>
        {/* 다이버 트랙은 전 페이지 고정 — 글 상세에서는 읽기 진행 표시기를 겸한다(핸드오프 §4) */}
        <DiverTrack />
        {children}
        {/* 푸터 (핸드오프 §4-7). About 링크를 여기 둔 건 헤더에서 뺐기 때문이다 —
            대체 경로인 히어로 지름길(텐트→About)이 #28 이라 아직 없어서, 그때까지 유일한 진입점이다. */}
        <footer className="mt-auto" style={{ background: "var(--c-deeper)", borderTop: "1px solid var(--line)" }}>
          <div className="wrap flex flex-wrap items-center justify-between gap-3 py-6 text-sm">
            <span className="text-[var(--t-muted)]">베이스캠프에서 기록함</span>
            <nav className="flex items-center gap-4">
              <Link href="/about" className="zb-link">
                About
              </Link>
              <a href="/feed.xml" className="zb-link">
                RSS
              </a>
              <a
                href="https://github.com/chaeeun037"
                className="zb-link"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
