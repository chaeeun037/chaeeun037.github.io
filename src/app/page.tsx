import Link from "next/link";
import DepthBadge from "@/components/DepthBadge";
import PostListItem from "@/components/PostListItem";
import Hero from "@/components/Hero";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/posts";

export default function Home() {
  // 도감 카드는 3장까지 — 핸드오프 §4-5 의 No.01~03 탭이 3장을 전제한다
  const featured = getFeaturedPosts().slice(0, 3);
  const posts = getPublishedPosts();

  return (
    <>
      <Hero />
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        {featured.length > 0 && (
          <section id="featured" className="mb-12 scroll-mt-20">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--t-muted)]">
              대표 기록
            </h2>
            {/* 도감 카드 — 2px 보더 + 4px 픽셀 그림자. 번호 탭은 우상단(§4-5) */}
            <ul className="mt-4 flex flex-col gap-5">
              {featured.map((post, i) => (
                <li key={post.slug}>
                  <Link href={`/posts/${post.slug}`} className="dex-card group">
                    <span className="dex-no">
                      No.{String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="pr-16 font-semibold text-[var(--t-primary)] underline-offset-4 group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--t-secondary)]">
                      {post.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      {post.depth && <DepthBadge depth={post.depth} />}
                      <time
                        dateTime={post.date}
                        className="text-xs tabular-nums text-[var(--t-muted)]"
                      >
                        {post.date}
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts.length === 0 ? (
          <p className="py-20 text-center text-[var(--t-muted)]">
            아직 발행된 글이 없습니다.
          </p>
        ) : (
          <section id="all-posts" className="scroll-mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              {featured.length > 0 && (
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--t-muted)]">
                  모든 기록
                </h2>
              )}
              {/* sec-note (핸드오프 §4-6) — 뱃지만 보고는 기준을 알 수 없으니 정의로 가는 길을 둔다.
                  대표 기록이 없어도 목록엔 뱃지가 붙으므로 이 링크는 항상 보인다. */}
              <Link href="/depth" className="zb-link ml-auto text-xs">
                깊이 기준이 궁금하다면?
              </Link>
            </div>
            <ul className="divide-y divide-[var(--line)]">
              {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
