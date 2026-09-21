import type { Metadata } from "next";
import Link from "next/link";
import Legend from "@/components/observatory/Legend";
import Sky from "@/components/observatory/Sky";
import { mockSnapshot } from "@/lib/observatory";

export const metadata: Metadata = {
  title: "관측소",
  description: "아직 글이 되지 않은 기록들을 밤하늘로 봅니다. 구조와 깊이만 담은 시각화입니다.",
};

/**
 * 관측소 (WB-1b / #31) — 1단계.
 * 지금은 **목업 데이터**다. 실데이터 연결(Gist 스냅샷)은 2단계.
 */
export default function ObservatoryPage() {
  const snapshot = mockSnapshot();
  const written = snapshot.stars.filter((s) => s.written).length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--t-muted)]">
          관측소
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--t-primary)]">
          아직 글이 되지 않은 것들
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--t-secondary)]">
          작업 하나가 별 하나입니다. 인과로 이어진 것들은 별자리가 되고,{" "}
          <strong>밝기는 그 일에 얼마나 깊이 파고들었는지</strong>입니다. 이미 글이 된 것은
          유성이 되어 물로 내려갑니다.
        </p>
      </header>

      <div className="obs-stage">
        <Sky snapshot={snapshot} />
        <Legend />
      </div>

      {/* 광도·개수는 아래쪽에 작게 — 하늘이 주인공이다 */}
      <div className="obs-meta">
        <span>별 {snapshot.stars.length}</span>
        <span>별자리 {snapshot.constellations.length}</span>
        <span>글이 됨 {written}</span>
        <span className="obs-legend">
          모양·크기 = 파고든 깊이 · <em style={{ color: "var(--c-shallow)" }}>유성</em> = 글이 됨 · 흐림 = 진행 중
        </span>
      </div>

      <p className="mt-8 max-w-2xl text-sm text-[var(--t-muted)]">
        비공개 작업 공간의 <strong>구조만</strong> 시각화한 것입니다. 제목·내용은 담겨 있지 않고,
        별에 적힌 문양은 원본이 없는 기호입니다.{" "}
        <span className="text-[var(--c-campfire)]">지금 보이는 것은 목업 데이터입니다.</span>
      </p>

      <p className="mt-8 text-sm">
        <Link href="/" className="zb-link">
          ← 베이스캠프로
        </Link>
      </p>
    </main>
  );
}
