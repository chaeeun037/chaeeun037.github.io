import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostListItem({ post }: { post: PostMeta }) {
  return (
    <li>
      <Link href={`/posts/${post.slug}`} className="group block py-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold group-hover:underline">{post.title}</h2>
          <time dateTime={post.date} className="shrink-0 text-sm text-gray-400">
            {post.date}
          </time>
        </div>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{post.description}</p>
        {post.tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </li>
  );
}
