"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  STAR_TEMPS,
  WATER,
  hashSeed,
  seeded,
  starCells,
  type Constellation,
  type ObservatorySnapshot,
  type Star,
} from "@/lib/observatory";

type Placed = Star & { x: number; y: number; z: number; color: string };

const UNIT: Record<number, number> = { 1: 1.6, 2: 1.5, 3: 1.7, 4: 1.8, 5: 1.9 };

/**
 * 밤하늘 — 배경(성운·먼지)은 캔버스, 별과 별자리 선은 픽셀 SVG.
 * 배치는 `star.id` 시드 기반이라 같은 스냅샷이면 언제 봐도 같은 하늘이다.
 */
export default function Sky({ snapshot }: { snapshot: ObservatorySnapshot }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 560 });
  const [hover, setHover] = useState<
    | { kind: "star"; data: Placed; x: number; y: number }
    | { kind: "cons"; data: Constellation; x: number; y: number }
    | null
  >(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { placed, byId } = useMemo(() => {
    const { w, h } = size;
    const byId = new Map<string, Placed>();
    const placed: Placed[] = snapshot.stars.map((s) => {
      // id 를 시드로 써야 새로고침마다 별자리가 춤추지 않는다
      const r = seeded(hashSeed(s.id));
      const x = 40 + r() * Math.max(1, w - 80);
      // written 은 수평선 근처로 내려간다 — "바다로 내려간 별"
      const y = s.written ? h - 72 - r() * 52 : 36 + r() * Math.max(1, h - 160);
      const p: Placed = {
        ...s,
        x,
        y,
        z: 0.45 + r() * 0.55,
        color: s.written ? WATER : STAR_TEMPS[Math.floor(r() * STAR_TEMPS.length)],
      };
      byId.set(s.id, p);
      return p;
    });

    // 같은 별자리 구성원을 서로 끌어당긴다(인력 배치 1회 — 매 프레임 물리 시뮬이 아니다)
    for (const c of snapshot.constellations) {
      const r = seeded(hashSeed(c.id));
      const cx = 90 + r() * Math.max(1, w - 180);
      const cy = 70 + r() * Math.max(1, h - 230);
      for (const id of c.members) {
        const p = byId.get(id);
        if (!p || p.written) continue;
        const ang = r() * Math.PI * 2;
        const rad = 38 + r() * 62;
        p.x = Math.max(28, Math.min(w - 28, cx + Math.cos(ang) * rad));
        p.y = Math.max(26, Math.min(h - 130, cy + Math.sin(ang) * rad));
      }
    }
    return { placed, byId };
  }, [snapshot, size]);

  // 배경은 캔버스 — 성운·먼지는 부드러워야 해서 픽셀 규칙 밖이다
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const { w, h } = size;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = w * dpr;
    cv.height = h * dpr;
    const g = cv.getContext("2d");
    if (!g) return;
    g.scale(dpr, dpr);

    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#060d19");
    bg.addColorStop(0.55, "#0a1a2e");
    bg.addColorStop(1, "#0d2b45");
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    const nebula = (cx: number, cy: number, rad: number, rgb: string, a: number) => {
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
      gr.addColorStop(0, `rgba(${rgb},${a})`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr;
      g.beginPath();
      g.arc(cx, cy, rad, 0, Math.PI * 2);
      g.fill();
    };
    nebula(w * 0.68, h * 0.26, w * 0.38, "120,90,220", 0.2);
    nebula(w * 0.28, h * 0.46, w * 0.32, "78,205,196", 0.16);
    nebula(w * 0.5, h * 0.7, w * 0.28, "255,179,71", 0.07);

    // 은하수 띠
    g.save();
    g.translate(w * 0.5, h * 0.4);
    g.rotate(-0.4);
    for (let i = 0; i < 2; i++) {
      const gr = g.createLinearGradient(0, -90 + i * 36, 0, 90 + i * 36);
      gr.addColorStop(0, "rgba(150,180,230,0)");
      gr.addColorStop(0.5, `rgba(150,180,230,${0.08 - i * 0.03})`);
      gr.addColorStop(1, "rgba(150,180,230,0)");
      g.fillStyle = gr;
      g.fillRect(-w, -110 + i * 36, w * 2, 220);
    }
    g.restore();

    // 먼지별 — 데이터가 아니라 분위기
    const r = seeded(7);
    for (let i = 0; i < 420; i++) {
      g.fillStyle = `rgba(220,235,250,${0.1 + r() * 0.45})`;
      g.fillRect(r() * w, r() * h * 0.92, 1, 1);
    }
  }, [size]);

  const lines = useMemo(() => {
    const out: { c: Constellation; pts: Placed[] }[] = [];
    for (const c of snapshot.constellations) {
      // written 은 하늘을 떠났으므로 선에서 제외한다.
      // 포함하면 수평선까지 선이 끌려 내려가 화면을 가로지른다.
      const pts = c.members
        .map((id) => byId.get(id))
        .filter((p): p is Placed => !!p && !p.written);
      if (pts.length > 1) out.push({ c, pts });
    }
    return out;
  }, [snapshot, byId]);

  return (
    <div ref={wrapRef} className="obs-sky">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      <svg width={size.w} height={size.h} role="img" aria-label={`별 ${snapshot.stars.length}개, 별자리 ${snapshot.constellations.length}개`}>
        <defs>
          {[...STAR_TEMPS, WATER].map((c, i) => (
            <radialGradient key={c} id={`halo${i}`}>
              <stop offset="0" stopColor={c} stopOpacity="0.5" />
              <stop offset="45%" stopColor={c} stopOpacity="0.12" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {lines.map(({ c, pts }) => (
          <g
            key={c.id}
            className="obs-cons"
            onMouseEnter={() => setHover({ kind: "cons", data: c, x: pts[0].x, y: pts[0].y })}
            onMouseLeave={() => setHover(null)}
          >
            {pts.slice(0, -1).map((p, i) => (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={pts[i + 1].x}
                y2={pts[i + 1].y}
                shapeRendering="crispEdges"
              />
            ))}
            {/* 선 위 호버 판정을 넉넉하게 — 1px 선은 못 짚는다 */}
            {pts.slice(0, -1).map((p, i) => (
              <line
                key={`hit${i}`}
                x1={p.x}
                y1={p.y}
                x2={pts[i + 1].x}
                y2={pts[i + 1].y}
                stroke="transparent"
                strokeWidth="12"
              />
            ))}
          </g>
        ))}

        {placed.map((s) => {
          const u = UNIT[s.magnitude];
          const haloIdx = s.written ? STAR_TEMPS.length : STAR_TEMPS.indexOf(s.color);
          return (
            <g
              key={s.id}
              transform={`translate(${Math.round(s.x)},${Math.round(s.y)})`}
              opacity={s.written ? 1 : (s.merged ? 1 : 0.42) * (0.62 + s.z * 0.38)}
              onMouseEnter={() => setHover({ kind: "star", data: s, x: s.x, y: s.y })}
              onMouseLeave={() => setHover(null)}
            >
              {s.merged && s.magnitude >= 2 && (
                <circle r={u * (s.magnitude + 2) * 1.8} fill={`url(#halo${haloIdx})`} />
              )}
              {s.merged && s.magnitude >= 4 && (
                <path
                  d={`M${-u * (s.magnitude === 5 ? 15 : 11)} 0 H${u * (s.magnitude === 5 ? 15 : 11)} M0 ${-u * (s.magnitude === 5 ? 15 : 11)} V${u * (s.magnitude === 5 ? 15 : 11)}`}
                  stroke={s.color}
                  strokeOpacity="0.28"
                  strokeWidth="1"
                />
              )}
              {/* 글이 된 별은 **유성**이 되어 물로 내려간다.
                  수평선을 긋는 대신 꼬리로 방향을 준다 — 선을 그으면 우주에 인위적인 경계가 생긴다.
                  매끈한 그라데이션 대신 점이 작아지며 흐려지는 픽셀 방식. */}
              {/* 글이 된 별은 **유성**이 되어 물로 내려간다.
                  수평선을 긋는 대신 꼬리로 방향을 준다 — 선을 그으면 우주에 인위적인 경계가 생긴다.
                  꼬리는 세 줄 — 가운데가 길고 진하고, 양옆이 짧고 흐리다. 한 줄이면 점선처럼 보인다. */}
              {s.written &&
                [
                  { off: 0, len: 7, a: 0.72, sz: 3 },
                  { off: -2.6, len: 5, a: 0.4, sz: 2.2 },
                  { off: 2.6, len: 4, a: 0.32, sz: 2 },
                ].map((tail, ti) =>
                  Array.from({ length: tail.len }, (_, j) => j + 1).map((k) => (
                    <rect
                      key={`t${ti}-${k}`}
                      x={k * 3.4 + tail.off}
                      y={-k * 3.4 + tail.off}
                      width={Math.max(1, tail.sz - k * 0.28)}
                      height={Math.max(1, tail.sz - k * 0.28)}
                      fill={s.color}
                      opacity={Math.max(0.05, tail.a - k * 0.09)}
                      shapeRendering="crispEdges"
                    />
                  )),
                )}
              {starCells(s.magnitude).map(([cx, cy], i) => (
                <rect
                  key={i}
                  x={cx * u}
                  y={cy * u}
                  width={u}
                  height={u}
                  fill={s.color}
                  shapeRendering="crispEdges"
                />
              ))}
              <circle r={Math.max(10, u * 4)} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="obs-tip"
          style={{
            left: Math.min(Math.max(12, hover.x + 16), size.w - 200),
            top: Math.max(12, hover.y - 58),
          }}
        >
          {hover.kind === "cons" ? (
            <>
              <strong>{hover.data.name ?? "이름 없는 별자리"}</strong>
              <span>
                광도 {hover.data.magnitude} · 별 {hover.data.members.length}개 ·{" "}
                {hover.data.born.replace("-", "년 ")}월생
              </span>
            </>
          ) : (
            <>
              <strong className="obs-glyph">{hover.data.glyph}</strong>
              <span>
                광도 {hover.data.magnitude} · {hover.data.born.replace("-", "년 ")}월생
                {hover.data.written && " · 발행됨"}
                {!hover.data.merged && " · 진행 중"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
