import { DEPTH_LABEL, type PostDepth } from "@/lib/posts";

/**
 * 깊이 등급 뱃지 — 미니 게이지(3바) + 등급 단어.
 * 숫자·단위는 표기하지 않는다(-5m/-20m/-40m 안은 2026-07-09에 폐기, 핸드오프 §5).
 * lv3만 캠프파이어색 — 대표글 마킹과 색 언어를 맞춘다.
 */
export default function DepthBadge({ depth }: { depth: PostDepth }) {
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
      {DEPTH_LABEL[depth]}
    </span>
  );
}
