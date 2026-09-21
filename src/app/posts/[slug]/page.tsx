import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown";
import DepthBadge from "@/components/DepthBadge";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";

export const dynamicParams = false;

/**
 * `output: export`는 동적 라우트에 **정적 경로가 최소 하나** 있기를 요구한다.
 * 빈 배열을 주면 "generateStaticParams가 없다"며 빌드가 통째로 깨진다 —
 * 그래서 발행 글이 0편이면 사이트 전체를 빌드할 수 없었다(2026-09-21 이전 제약).
 *
 * 글이 0편일 때만 자리 채움 슬러그 하나를 내보내고, 그 경로는 아래에서 notFound()로 떨어뜨린다.
 * 글이 한 편이라도 있으면 이 슬러그는 **생성되지 않는다** — 평소 산출물은 그대로다.
 */
const EMPTY_PLACEHOLDER_SLUG = "__no-posts__";

export function generateStaticParams() {
  const slugs = getPublishedPosts().map(({ slug }) => ({ slug }));
  return slugs.length > 0 ? slugs : [{ slug: EMPTY_PLACEHOLDER_SLUG }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  // 자리 채움 경로는 정적 export 특성상 200으로 응답한다 — 색인되지 않게 막는다
  if (!post) return { robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/posts/${post.slug}/`,
      publishedTime: `${post.date}T00:00:00+09:00`,
      ...(post.updated ? { modifiedTime: `${post.updated}T00:00:00+09:00` } : {}),
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--t-primary)]">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--t-muted)]">
          <time dateTime={post.date} className="tabular-nums">
            {post.date}
          </time>
          {post.depth && <DepthBadge depth={post.depth} />}
          {/* 경험 시점은 발행일과 경쟁하지 않게 더 흐리게 — 찾는 사람만 보면 되는 정보다 */}
          {post.experiencedAt && (
            <span className="meta-faint" title="이 글이 다루는 경험의 시점">
              {post.experiencedAt.replace("-", "년 ")}월의 기록
            </span>
          )}
          {post.updated && post.updated !== post.date && (
            <span className="meta-faint">{post.updated} 수정</span>
          )}
          {post.series && <span>· {post.series}</span>}
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>
      {/* 단일 다크 테마라 prose-invert 를 조건 없이 건다 — dark: 변형은 자동 다크모드 전제라 안 맞는다 */}
      <article
        className="prose prose-invert prose-neutral max-w-none zb-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
