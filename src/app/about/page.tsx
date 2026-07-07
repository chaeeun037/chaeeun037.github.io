import type { Metadata } from "next";
import { getFeaturedPosts } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "프론트엔드 개발자 김채은 소개",
};

export default function AboutPage() {
  const featured = getFeaturedPosts().slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold">김채은</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        프론트엔드 개발자. 문제를 해결한 과정과 그 과정에서 내린 기술 결정을 기록합니다.
        {/* TODO(채은): 한 줄 소개 다듬기 */}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">지금 하는 일</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {/* TODO(채은): 현 소속·역할·주요 성과 — 실제 이력으로 채우기 */}
          (준비 중)
        </p>
      </section>

      {featured.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">대표글</h2>
          <ul className="mt-2 list-inside list-disc text-gray-600 dark:text-gray-400">
            {featured.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">연락</h2>
        <ul className="mt-2 text-gray-600 dark:text-gray-400">
          <li>
            GitHub —{" "}
            <a href="https://github.com/chaeeun037" className="hover:underline">
              @chaeeun037
            </a>
          </li>
          <li>
            Email —{" "}
            <a href="mailto:chaeeun.dev@gmail.com" className="hover:underline">
              chaeeun.dev@gmail.com
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
