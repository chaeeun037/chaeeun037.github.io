import Image from "next/image";
import Link from "next/link";
import { TEASER_STAR_COUNT, starCells } from "@/lib/observatory";

/**
 * 히어로 씬 (Zone A, #28) — 수직 세계관: 하늘 → 육지 → 물.
 * 시안: design/mockup-A6-final-polish.html, 스펙: 핸드오프 §3·§4
 *
 * 픽셀 에셋은 1x(원본 크기)로 놓는다 — §4.3 이 정수 배율만 허용하고,
 * 파이프라인이 이미 목표 그리드로 축소해 뒀다.
 * 미수령 에셋(캠핑장 씬·수중 씬)은 자리를 보이게 남긴다.
 */

const CLOUDS = [
  { src: "/pixel/sky-cloud-1-74x32.png", w: 74, h: 32, cls: "cloud-1" },
  { src: "/pixel/sky-cloud-2-55x32.png", w: 55, h: 32, cls: "cloud-2" },
  { src: "/pixel/sky-cloud-3-48x32.png", w: 48, h: 32, cls: "cloud-3" },
];

export default function Hero() {
  return (
    <div className="hero">
      {/* ── 하늘: 구름 3개가 전부 관측소 진입점 ── */}
      <div className="hero-sky">
        <div className="wrap sky-wrap">
          <div className="sky-clouds">
            {CLOUDS.map((c) => (
              <Link
                key={c.src}
                href="/observatory"
                className={`cloud-link ${c.cls}`}
                aria-label="관측소 — 아직 글이 되지 않은 기록"
              >
                <Image
                  src={c.src}
                  width={c.w}
                  height={c.h}
                  alt=""
                  className="px-art"
                  unoptimized
                  priority
                />
              </Link>
            ))}
            <Link
              href="/observatory"
              className="sky-teaser"
              aria-label={`관측소 — 아직 글이 되지 않은 기록 ${TEASER_STAR_COUNT}개`}
            >
              {/* 하늘 너머로 비치는 별 — 우주는 낮/밤과 무관하다.
                  수는 빌드 타임 상수 하나. 스냅샷을 홈에서 fetch하면 LCP 비용이 되돌아온다. */}
              <svg width="68" height="26" viewBox="-34 -13 68 26" aria-hidden="true">
                {[
                  { x: -23, m: 4 as const, u: 1.3 },
                  { x: -2, m: 5 as const, u: 1.2 },
                  { x: 20, m: 3 as const, u: 1.4 },
                ].map((s) => (
                  <g key={s.x} transform={`translate(${s.x},0)`} fill="var(--t-on-sky)">
                    {starCells(s.m).map(([cx, cy], i) => (
                      <rect
                        key={i}
                        x={cx * s.u}
                        y={cy * s.u}
                        width={s.u}
                        height={s.u}
                        shapeRendering="crispEdges"
                      />
                    ))}
                  </g>
                ))}
              </svg>
              <span className="count">관측소 — 아직 글이 되지 않은 기록 {TEASER_STAR_COUNT}</span>
            </Link>
          </div>

          <p className="hero-eyebrow">EXPEDITION LOG</p>
          <h1 className="hero-title">
            깊이 파고든
            <br />
            기록들
          </h1>
          <p className="hero-sub">
            프론트엔드 개발자 채은의 탐험 일지.
            <br />
            코드의 심해에서 건져 올린 것들을 기록합니다.
          </p>
        </div>
      </div>

      {/* ── 육지: 모닥불 CTA + 지름길(텐트·랜턴) ── */}
      <div className="hero-meadow">
        <div className="wrap">
          <div className="meadow-top">
            {/* 모닥불과 문구는 한 클릭 영역(§4-3) */}
            <Link href="#featured" className="cta-camp">
              <Image
                src="/pixel/land-campfire-57x48.png"
                width={57}
                height={48}
                alt=""
                className="px-art"
                unoptimized
              />
              <span className="hero-cta">대표 기록 보기 ↓</span>
            </Link>

            <nav className="camp-shortcuts" aria-label="바로가기">
              <Link href="/about">
                <Image
                  src="/pixel/land-tent-64x48.png"
                  width={64}
                  height={48}
                  alt=""
                  className="px-art"
                  unoptimized
                />
                <span className="lbl">About</span>
              </Link>
              <Link href="#all-posts">
                <Image
                  src="/pixel/land-lantern-40x64.png"
                  width={40}
                  height={64}
                  alt=""
                  className="px-art"
                  unoptimized
                />
                <span className="lbl">모든 기록</span>
              </Link>
            </nav>
          </div>

          <div className="meadow-scene">
            <div className="scene-slot">
              픽셀 씬 자리 — 봄 캠핑장(풀밭·나무, 오른쪽으로 물가와 이어짐)
              <br />
              에셋 수령 후 교체
            </div>
          </div>
        </div>
      </div>

      {/* ── 물: 수중 씬은 미수령이라 자리만. 그라데이션이 심해로 내려간다 ── */}
      <div className="hero-water">
        <div className="under-scene">
          <div className="wrap">
            <div className="scene-slot">
              픽셀 씬 자리 — 수중(햇빛 줄기·산호·물고기)
              <br />
              에셋 수령 후 교체
            </div>
          </div>
        </div>

        <div className="scroll-cue">
          DIVE DEEPER
          <span className="arrow" aria-hidden="true">
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
