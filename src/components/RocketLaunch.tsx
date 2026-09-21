"use client";

import Image from "next/image";
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
 * 로켓 에셋은 파이프라인 산출물이다. **다른 로켓으로 바꾸려면 `assets-raw/rocket.png` 를 갈아끼우고
 * `pnpm pixel` 만 돌리면 된다** — 이 파일은 손대지 않는다.
 */
export default function RocketLaunch() {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);
  const navigated = useRef(false);

  // 길이를 CSS 와 JS 양쪽에 적으면 한쪽만 고쳤을 때 조용히 어긋난다 — 끝났다는 신호를 CSS 가 주게 한다
  const go = () => {
    if (navigated.current) return;
    navigated.current = true;
    router.push("/observatory");
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 모션을 줄이려는 사용자에겐 연출 없이 바로 보낸다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return go();
    if (launching) return;
    setLaunching(true);
    // animationend 가 오지 않는 경우(탭 비활성 등)에도 버튼이 먹통이 되면 안 된다
    window.setTimeout(go, 2000);
  };

  return (
    <a
      href="/observatory"
      className={`launchpad${launching ? " is-launching" : ""}`}
      onClick={onClick}
      aria-label={`관측소로 이동 — 아직 글이 되지 않은 기록 ${TEASER_STAR_COUNT}개`}
    >
      <span
        className="rocket"
        aria-hidden="true"
        // 화염(sputter)은 infinite 라 end 가 없다. 이름으로 한 번 더 걸러 둔다
        onAnimationEnd={(e) => {
          if (e.animationName === "liftoff") go();
        }}
      >
        <Image
          src="/pixel/land-rocket-13x112.png"
          width={13}
          height={112}
          alt=""
          className="px-art"
          unoptimized
        />
        <span className="flame" />
      </span>
      <span className="launch-text">
        <strong>관측소로 발사</strong>
        <em>아직 글이 되지 않은 기록 {TEASER_STAR_COUNT}</em>
      </span>
    </a>
  );
}
