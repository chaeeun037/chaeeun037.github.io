import Link from "next/link";
import DepthBadge from "@/components/DepthBadge";
import type { PostMeta } from "@/lib/posts";

export default function PostListItem({ post }: { post: PostMeta }) {
  return (
    <li>
      <Link href={`/posts/${post.slug}`} className="group block py-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--t-primary)] underline-offset-4 group-hover:underline">
            {post.title}
          </h2>
          <time
            dateTime={post.date}
            className="shrink-0 text-sm tabular-nums text-[var(--t-muted)]"
          >
            {post.date}
          </time>
        </div>
        <p className="mt-1 text-[var(--t-secondary)]">{post.description}</p>
        {/* 깊이 뱃지와 태그는 한 줄에 — 핸드오프 §4-6 "깊이 뱃지 + 카테고리 인라인" */}
        {(post.depth || post.tags.length > 0) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            {post.depth && <DepthBadge depth={post.depth} />}
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-[var(--t-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </li>
  );
}
