import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown";
import DepthBadge from "@/components/DepthBadge";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/posts/${post.slug}/`,
      publishedTime: `${post.date}T00:00:00+09:00`,
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
