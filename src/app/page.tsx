import PostListItem from "@/components/PostListItem";
import { getPublishedPosts } from "@/lib/posts";

export default function Home() {
  const posts = getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      {posts.length === 0 ? (
        <p className="py-20 text-center text-gray-500">아직 발행된 글이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </ul>
      )}
    </main>
  );
}
