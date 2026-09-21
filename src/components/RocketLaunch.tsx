"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { TEASER_STAR_COUNT } from "@/lib/observatory";

/**
 * 관측소 진입 — 하늘과 육지 경계에서 로켓을 쏘아 올린다.
 * IDEAS.md 2026-07-09 "로켓 발사 관측소 진입 연출"의 축소판이다(스크롤 확장 대신 페이지 이동).
 *
 * 왜 별 티저를 버렸나: 낮 하늘에 어두운 별을 찍으니 빛나는 것이 아니라 티끌로 보였고,
 * 무엇보다 **무엇을 누르라는 건지 읽히지 않았다.** 로켓은 행동이 분명하다.
 *
 * 로켓 에셋은 미수령이라 CSS 로 임시 형태를 그린다 — 수령하면 이 블록만 <Image> 로 바꾼다.
 */
export default function RocketLaunch() {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);
  const timer = useRef<number | null>(null);

  const go = () => router.push("/observatory");

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 모션을 줄이려는 사용자에겐 연출 없이 바로 보낸다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return go();
    if (launching) return;
    setLaunching(true);
    timer.current = window.setTimeout(go, 620);
  };

  return (
    <a
      href="/observatory"
      className={`launchpad${launching ? " is-launching" : ""}`}
      onClick={onClick}
      aria-label={`관측소로 이동 — 아직 글이 되지 않은 기록 ${TEASER_STAR_COUNT}개`}
    >
      <span className="rocket" aria-hidden="true">
        <span className="flame" />
      </span>
      <span className="launch-text">
        <strong>관측소로 발사</strong>
        <em>아직 글이 되지 않은 기록 {TEASER_STAR_COUNT}</em>
      </span>
    </a>
  );
}
