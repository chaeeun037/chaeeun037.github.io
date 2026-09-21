import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}/`,
    // 수정일이 있으면 그걸 쓴다 — lastModified 는 "마지막으로 고친 때"이지 발행일이 아니다.
    // 발행일을 넣어두면 글을 고쳐도 검색엔진이 갱신을 모른다.
    lastModified: post.updated ?? post.date,
  }));
  return [
    { url: `${SITE_URL}/`, lastModified: posts[0]?.lastModified },
    { url: `${SITE_URL}/about/` },
    ...posts,
  ];
}
