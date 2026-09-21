import type { Metadata } from "next";
import Link from "next/link";
import DepthBadge from "@/components/DepthBadge";
import { DEPTH_LABEL, type PostDepth } from "@/lib/posts";

export const metadata: Metadata = {
  title: "깊이 기준",
  description:
    "글에 붙는 깊이 등급(스노클·다이빙·심해)을 어떤 기준으로 매기는지 공개합니다.",
};

/**
 * 깊이 기준 노티스 페이지 (#30 / THEME-4).
 * 핸드오프 §5 — "등급 정의 공개, 투명성 자체가 신뢰 신호".
 *
 * 기준을 적어두는 것만으로는 부족하고 **왜 자동 산출하지 않는지**까지 밝혀야
 * 등급이 자의적으로 보이지 않는다. 그래서 판정 주체와 운영 규칙을 같이 싣는다.
 */

const GRADES: {
  depth: PostDepth;
  criteria: string;
  example: string;
}[] = [
  {
    depth: 1,
    criteria: "하나의 개념·팁·도구를 소개한다.",
    example:
      "쓸 만한 API 하나, 설정 한 줄의 의미, 몰랐던 브라우저 동작. 읽는 데 오래 걸리지 않고 바로 써먹을 수 있는 것.",
  },
  {
    depth: 2,
    criteria: "문제 → 원인 → 해결의 과정이 완결돼 있고, “왜”가 한 층 이상 파여 있다.",
    example:
      "무엇을 고쳤는지가 아니라 왜 그렇게 고쳤는지가 남는 글. 다른 선택지를 왜 버렸는지가 들어간다.",
  },
  {
    depth: 3,
    criteria:
      "원인을 여러 층에서 규명하고, 시스템 설계 판단과 검증·재발 방지까지 포함한다.",
    example:
      "증상이 아니라 구조를 고친 기록. 같은 문제가 다시 안 나게 만든 장치와, 그게 실제로 동작하는지 확인한 방법이 함께 있다.",
  },
];

export default function DepthPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-14">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--t-muted)]">
          깊이 기준
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--t-primary)]">
          이 글은 얼마나 깊은가
        </h1>
        <p className="mt-4 text-[var(--t-secondary)]">
          글 목록과 상세에 붙는 작은 게이지는 <strong>깊이 등급</strong>입니다. 글의
          좋고 나쁨이 아니라 <strong>어디까지 파고들었는지</strong>를 나타냅니다. 기준을
          공개해 두는 편이 등급을 신뢰할 수 있게 만든다고 보아 이 페이지를 둡니다.
        </p>
      </header>

      <section className="flex flex-col gap-5">
        {GRADES.map((g) => (
          <article
            key={g.depth}
            className="border-l-2 border-[var(--line)] pl-5"
            style={
              g.depth === 3 ? { borderColor: "var(--c-campfire)" } : undefined
            }
          >
            <div className="flex items-baseline gap-3">
              <DepthBadge depth={g.depth} showLabel={false} />
              <h2 className="text-lg font-semibold text-[var(--t-primary)]">
                {DEPTH_LABEL[g.depth]}
              </h2>
            </div>
            <p className="mt-2 text-[var(--t-secondary)]">{g.criteria}</p>
            <p className="mt-1.5 text-sm text-[var(--t-muted)]">{g.example}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 border-t border-[var(--line)] pt-8">
        <h2 className="text-lg font-semibold text-[var(--t-primary)]">
          등급을 매기는 방식
        </h2>

        <h3 className="mt-6 text-sm font-semibold text-[var(--t-primary)]">
          사람이 직접 선언합니다
        </h3>
        <p className="mt-1.5 text-[var(--t-secondary)]">
          글자 수나 코드 블록 개수 같은 것으로 자동 계산하지 않습니다. 길다고 깊은
          글이 아니고, 짧아도 구조를 건드린 글이 있습니다. 재는 축이 다르기 때문에
          자동화하면 숫자는 나오지만 뜻이 사라집니다.
        </p>

        <h3 className="mt-6 text-sm font-semibold text-[var(--t-primary)]">
          심해는 아껴 씁니다
        </h3>
        <p className="mt-1.5 text-[var(--t-secondary)]">
          모든 글이 심해라면 등급은 아무것도 말해주지 않습니다.{" "}
          <strong className="text-[var(--c-campfire)]">
            심해가 드물수록 그 표시가 믿을 만해진다
          </strong>
          고 보고, 비중이 낮게 유지되도록 관리합니다. 대표 기록으로 올리는 글은 심해
          중에서만 고릅니다.
        </p>
      </section>

      <p className="mt-12 text-sm">
        <Link href="/#all-posts" className="zb-link">
          ← 모든 기록으로
        </Link>
      </p>
    </main>
  );
}
