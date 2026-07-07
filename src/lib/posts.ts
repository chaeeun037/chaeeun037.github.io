import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostStatus = "draft" | "published";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  tags: string[];
  series?: string;
  /** 대표글 여부 — 랜딩 큐레이션(BLOG-4)에서 사용 */
  featured: boolean;
  status: PostStatus;
}

export interface Post extends PostMeta {
  /** 마크다운 본문 (frontmatter 제외) */
  content: string;
}

class FrontmatterError extends Error {
  constructor(slug: string, message: string) {
    super(`[content/posts/${slug}.md] ${message}`);
    this.name = "FrontmatterError";
  }
}

function requireString(data: Record<string, unknown>, field: string, slug: string): string {
  const value = data[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new FrontmatterError(slug, `frontmatter "${field}"는 비어 있지 않은 문자열이어야 합니다`);
  }
  return value.trim();
}

function normalizeDate(value: unknown, slug: string): string {
  // YAML은 따옴표 없는 날짜를 Date로 파싱한다
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    throw new FrontmatterError(slug, `frontmatter "date"는 YYYY-MM-DD 형식이어야 합니다`);
  }
  return date.toISOString().slice(0, 10);
}

function parsePost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const status = data.status ?? "draft";
  if (status !== "draft" && status !== "published") {
    throw new FrontmatterError(slug, `frontmatter "status"는 draft 또는 published여야 합니다 (현재: ${status})`);
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    throw new FrontmatterError(slug, `frontmatter "tags"는 문자열 배열이어야 합니다`);
  }

  return {
    slug,
    title: requireString(data, "title", slug),
    description: requireString(data, "description", slug),
    date: normalizeDate(data.date, slug),
    tags: (data.tags ?? []).map(String),
    series: typeof data.series === "string" ? data.series : undefined,
    featured: data.featured === true,
    status,
    content,
  };
}

function readAll(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parsePost);
}

/** 발행 글만, 최신순 */
export function getPublishedPosts(): PostMeta[] {
  return readAll()
    .filter((p) => p.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content: _content, ...meta }) => meta);
}

/** 발행 글 단건 (draft는 상세 페이지도 생성하지 않는다) */
export function getPublishedPost(slug: string): Post | undefined {
  return readAll().find((p) => p.slug === slug && p.status === "published");
}

/** 대표글 (BLOG-4 큐레이션용) */
export function getFeaturedPosts(): PostMeta[] {
  return getPublishedPosts().filter((p) => p.featured);
}
