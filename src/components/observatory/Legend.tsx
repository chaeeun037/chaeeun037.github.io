"use client";

import { useEffect, useState } from "react";
import { starCells, STAR_TEMPS, WATER, type Magnitude } from "@/lib/observatory";

/** 범례에 쓰는 미니 별 — 하늘의 것과 같은 스프라이트를 쓴다 */
function Mini({
  mag,
  color = "#edf2f7",
  u = 2.4,
  tail = false,
}: {
  mag: Magnitude;
  color?: string;
  u?: number;
  /** 설명이 "물빛 + 꼬리"인데 그림에 꼬리가 없으면 말과 그림이 어긋난다 */
  tail?: boolean;
}) {
  return (
    <svg width="34" height="34" viewBox="-17 -17 34 34" aria-hidden="true">
      <g fill={color}>
        {tail &&
          [1, 2, 3, 4].map((k) => (
            <rect
              key={`t${k}`}
              x={k * 3}
              y={-k * 3}
              width={Math.max(1, 2.6 - k * 0.3)}
              height={Math.max(1, 2.6 - k * 0.3)}
              opacity={0.7 - k * 0.13}
              shapeRendering="crispEdges"
            />
          ))}
        {starCells(mag).map(([x, y], i) => (
          <rect key={i} x={x * u} y={y * u} width={u} height={u} shapeRendering="crispEdges" />
        ))}
      </g>
    </svg>
  );
}

/**
 * 별자리 읽는 법 — (?) 로 연다.
 * 하늘 위에 항상 띄워두면 시야를 가리고, 페이지를 나누면 하늘을 떠나야 한다.
 */
export default function Legend() {
  const [open, setOpen] = useState(false);

  // 모달이 떴을 때 Esc 로 닫힌다 — 마우스로만 닫히면 키보드 사용자가 갇힌다
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="obs-help" onClick={() => setOpen(true)} aria-label="별자리 읽는 법">
        ?
      </button>

      {open && (
        <div className="obs-modal-bg" onClick={() => setOpen(false)} role="presentation">
          <div
            className="obs-modal"
            role="dialog"
            aria-modal="true"
            aria-label="별자리 읽는 법"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="obs-close" onClick={() => setOpen(false)} aria-label="닫기">
              ×
            </button>
            <h2>별자리 읽는 법</h2>
            <p className="lead">
              작업 하나가 별 하나입니다. <strong>밝을수록 깊이 파고든 일</strong>이고, 인과로
              이어진 것들은 선으로 묶여 별자리가 됩니다. 발행된 글에 붙는 깊이 등급과 같은 축입니다.
            </p>

            <h3>파고든 깊이 — 모양과 크기로</h3>
            <div className="mags">
              {([1, 2, 3, 4, 5] as Magnitude[]).map((m) => (
                <div key={m}>
                  <Mini mag={m} u={m === 5 ? 1.9 : 2.4} />
                  <span>{m}</span>
                </div>
              ))}
            </div>
            <p className="note">
              가장 깊은 <strong>5등급은 상위 5%</strong>만 받습니다. 흔하면 등급이 아니니까요.
              낮은 등급은 못한 일이 아니라 <strong>단순했던 일</strong>입니다.
            </p>

            <h3>상태 — 색과 선명도로</h3>
            <ul className="states">
              <li>
                <Mini mag={3} color={WATER} tail />
                <div>
                  <strong>물빛 + 꼬리</strong>
                  <span>블로그에 발행된 기록. 유성이 되어 물로 내려갑니다</span>
                </div>
              </li>
              <li>
                <span className="dim">
                  <Mini mag={3} />
                </span>
                <div>
                  <strong>흐린 별</strong>
                  <span>아직 끝나지 않은 일</span>
                </div>
              </li>
              <li>
                <span className="temps">
                  {STAR_TEMPS.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                <div>
                  <strong>색온도</strong>
                  <span>실제 별처럼 청백~주황. 이것만은 뜻이 없는 장식입니다</span>
                </div>
              </li>
            </ul>

            <h3>담기지 않은 것</h3>
            <p className="note">
              제목·내용·티켓번호·정확한 날짜는 들어 있지 않습니다. 별에 적힌 문양은
              <strong> 원본이 없는 기호</strong>라 되돌려 읽을 수 없고, 시점은 월 단위까지만 남습니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
