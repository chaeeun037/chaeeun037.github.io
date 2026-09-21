import type { Metadata } from "next";
import Link from "next/link";
import Observatory from "@/components/observatory/Observatory";

export const metadata: Metadata = {
  title: "관측소",
  description: "아직 글이 되지 않은 기록들을 밤하늘로 봅니다. 구조와 깊이만 담은 시각화입니다.",
};

/**
 * 관측소 (WB-1b / #31) — 1단계.
 * 지금은 **목업 데이터**다. 실데이터 연결(Gist 스냅샷)은 2단계.
 */
export default function ObservatoryPage() {
  return (
    <main className="wrap py-12">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--t-muted)]">
          관측소
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--t-primary)]">
          아직 글이 되지 않은 것들
        </h1>
        <p className="mt-3 text-[var(--t-secondary)]">
          작업 하나가 별 하나입니다. 인과로 이어진 것들은 별자리가 되고,{" "}
          <strong>밝기는 그 일에 얼마나 깊이 파고들었는지</strong>입니다. 이미 글이 된 것은
          유성이 되어 물로 내려갑니다.
        </p>
      </header>

      <Observatory />

      <p className="mt-8 text-sm">
        <Link href="/" className="zb-link">
          ← 베이스캠프로
        </Link>
      </p>
    </main>
  );
}
