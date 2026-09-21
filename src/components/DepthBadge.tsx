import { DEPTH_LABEL, type PostDepth } from "@/lib/posts";

/**
 * 깊이 등급 뱃지 — 미니 게이지(3바) + 등급 단어.
 * 숫자·단위는 표기하지 않는다(-5m/-20m/-40m 안은 2026-07-09에 폐기, 핸드오프 §5).
 * lv3만 캠프파이어색 — 대표글 마킹과 색 언어를 맞춘다.
 */
export default function DepthBadge({
  depth,
  showLabel = true,
}: {
  depth: PostDepth;
  /** 옆에 등급 이름이 이미 있는 자리(깊이 기준 페이지)에서는 게이지만 쓴다 — 같은 단어를 두 번 읽히지 않게 */
  showLabel?: boolean;
}) {
  return (
    <span
      className={`depth depth-${depth}`}
      title={`깊이 등급 — ${DEPTH_LABEL[depth]}`}
    >
      <span className="depth-gauge" aria-hidden="true">
        {[1, 2, 3].map((level) => (
          <span key={level} className={`depth-bar${level <= depth ? " on" : ""}`} />
        ))}
      </span>
      {showLabel && DEPTH_LABEL[depth]}
    </span>
  );
}
