import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}/`,
    lastModified: post.date,
  }));
  return [
    { url: `${SITE_URL}/`, lastModified: posts[0]?.lastModified },
    { url: `${SITE_URL}/about/` },
    ...posts,
  ];
}
