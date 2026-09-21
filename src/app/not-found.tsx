import Image from "next/image";
import Link from "next/link";

/**
 * 404 — 조난 (#29 / THEME-3).
 * 세계관: 방문자는 길을 잃고 심해에 떠 있다. 돌아갈 곳은 육지의 베이스캠프다.
 *
 * 조난 씬 에셋은 미수령이라 **랜턴을 대신 쓴다** — "모든 기록"의 지름길로 이미 쓰는 물건이지만,
 * 여기서는 홀로 떠 있는 불빛이라는 다른 뜻으로 읽힌다. 전용 에셋이 오면 교체한다.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
      <Image
        src="/pixel/land-lantern-glow-40x64.png"
        width={40}
        height={64}
        alt=""
        className="px-art opacity-90"
        unoptimized
      />

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--t-muted)]">
        404 — 조난
      </p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--t-primary)]">
        여기엔 아무 기록도 없습니다
      </h1>
      <p className="mt-3 max-w-md text-[var(--t-secondary)]">
        주소가 바뀌었거나, 아직 닿지 않은 수심입니다. 랜턴을 들고 베이스캠프로
        돌아가는 편이 빠릅니다.
      </p>

      <Link href="/" className="hero-cta mt-8">
        베이스캠프로 돌아가기
      </Link>

      <p className="mt-6 text-sm">
        <Link href="/#all-posts" className="zb-link">
          모든 기록 보기
        </Link>
      </p>
    </main>
  );
}
