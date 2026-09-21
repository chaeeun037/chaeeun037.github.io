"use client";

import { useEffect, useRef } from "react";

/**
 * 다이버 트랙 — 스크롤 진행률에 1:1 로 하강한다(핸드오프 §4).
 * 글 상세에서는 읽기 진행 표시기를 겸하므로 별도 진행바를 만들지 않는다(#29 에서 폐기).
 *
 * 다이버 캐릭터는 채은이 제작해 교체할 자리다 — 지금은 자리 표시만 한다.
 */
export default function DiverTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const diverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const diver = diverRef.current;
    if (!track || !diver) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const range = track.clientHeight - diver.clientHeight;
      diver.style.transform = `translateY(${progress * range}px)`;
    };
    // 스크롤마다 레이아웃을 읽으면 프레임을 놓친다 — rAF 로 한 프레임에 한 번만
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="diver-track" ref={trackRef} aria-hidden="true">
      <div className="line" />
      <div className="diver" ref={diverRef}>
        다이버
        <br />
        64²
      </div>
    </div>
  );
}
