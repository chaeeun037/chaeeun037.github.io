"use client";

import { useEffect, useState } from "react";
import Legend from "@/components/observatory/Legend";
import Sky from "@/components/observatory/Sky";
import { mockSnapshot, type ObservatorySnapshot } from "@/lib/observatory";

/**
 * 관측소 데이터 로더 (2단계 배선).
 *
 * 스냅샷은 harness 스크립트가 만들어 **공개 Gist**를 갱신하고, 여기서 런타임에 가져온다
 * (2026-07-09 결정 — 커밋·리빌드 없이 갱신되게 하려고).
 *
 * 빌드 타임 임베드는 한 번 검토했다가 거뒀다 — 홈 상단 배치안을 위해 꺼낸 완화책이었는데
 * 관측소가 별도 페이지로 결론 나며 근거가 사라졌다. 이 페이지에 온 사람은 별을 보러 온 것이라
 * 잠깐을 기다린다(이탈이 걸린 자리가 아니다).
 *
 * URL 이 없으면 목업을 쓴다 — 아직 파이프라인이 없는 단계이고, 로컬 개발에서도 필요하다.
 */
const SNAPSHOT_URL = process.env.NEXT_PUBLIC_OBSERVATORY_SNAPSHOT_URL;

type State =
  | { kind: "loading" }
  | { kind: "ready"; snapshot: ObservatorySnapshot; source: "live" | "mock" }
  | { kind: "error"; message: string };

export default function Observatory() {
  const [state, setState] = useState<State>(
    // URL 이 없으면 기다릴 이유가 없다 — 목업으로 바로 그린다
    SNAPSHOT_URL ? { kind: "loading" } : { kind: "ready", snapshot: mockSnapshot(), source: "mock" },
  );

  useEffect(() => {
    if (!SNAPSHOT_URL) return;
    let alive = true;

    fetch(SNAPSHOT_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`스냅샷을 가져오지 못했습니다 (${res.status})`);
        return res.json();
      })
      .then((data: ObservatorySnapshot) => {
        if (!alive) return;
        // 형태를 최소한으로 확인한다 — 깨진 JSON 이 그대로 렌더로 흘러가면 원인을 찾기 어렵다
        if (!Array.isArray(data?.stars) || !Array.isArray(data?.constellations)) {
          throw new Error("스냅샷 형식이 올바르지 않습니다");
        }
        setState({ kind: "ready", snapshot: data, source: "live" });
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setState({ kind: "error", message: e instanceof Error ? e.message : "알 수 없는 오류" });
      });

    return () => {
      alive = false;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="obs-stage">
        {/* 스켈레톤 — 배경(성운·먼지)은 정적이라 즉시 깔리고 별자리만 비어 있다 */}
        <Sky snapshot={null} />
        <p className="obs-status">우주를 불러오는 중…</p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="obs-stage">
        <Sky snapshot={null} />
        <p className="obs-status obs-status-error">
          {state.message} — 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const { snapshot, source } = state;
  const written = snapshot.stars.filter((s) => s.written).length;

  return (
    <>
      <div className="obs-stage">
        <Sky snapshot={snapshot} />
        <Legend />
      </div>

      {/* 광도·개수는 아래쪽에 작게 — 우주가 주인공이다 */}
      <div className="obs-meta">
        <span>별 {snapshot.stars.length}</span>
        <span>별자리 {snapshot.constellations.length}</span>
        <span>글이 됨 {written}</span>
        <span className="obs-legend">
          모양·크기 = 파고든 깊이 ·{" "}
          <em style={{ color: "var(--c-shallow)" }}>유성</em> = 글이 됨 · 흐림 = 진행 중
        </span>
      </div>

      <p className="mt-8 text-sm text-[var(--t-muted)]">
        비공개 작업 공간의 <strong>구조만</strong> 시각화한 것입니다. 제목·내용은 담겨 있지 않고,
        별에 적힌 문양은 원본이 없는 기호입니다.
        {source === "mock" && (
          <span className="text-[var(--c-campfire)]"> 지금 보이는 것은 목업 데이터입니다.</span>
        )}
      </p>
    </>
  );
}
