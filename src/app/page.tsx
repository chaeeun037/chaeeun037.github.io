import Link from "next/link";
import PostListItem from "@/components/PostListItem";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/posts";

export default function Home() {
  const featured = getFeaturedPosts().slice(0, 5);
  const posts = getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            대표글
          </h2>
          <ul className="mt-2">
            {featured.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="group block py-3">
                  <h3 className="font-semibold group-hover:underline">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.length === 0 ? (
        <p className="py-20 text-center text-gray-500">아직 발행된 글이 없습니다.</p>
      ) : (
        <section>
          {featured.length > 0 && (
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              모든 글
            </h2>
          )}
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {posts.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
