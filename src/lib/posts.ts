import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostStatus = "draft" | "published";

/**
 * 깊이 등급 — **저자의 에디토리얼 선언**이다(핸드오프 §5).
 * 원장 점수·글자 수 같은 것에서 자동 산출하지 않는다. 축이 다르다.
 *   1 스노클 — 하나의 개념·팁·도구 소개
 *   2 다이빙 — 문제→원인→해결의 완결 과정, "왜"가 1층 이상
 *   3 심해   — 다층 원인 규명·시스템 설계 판단·검증/재발 방지 포함
 * 운영 규칙: **심해 인플레이션 금지.** 심해 비중이 낮을수록 신뢰 신호다.
 */
export type PostDepth = 1 | 2 | 3;

export const DEPTH_LABEL: Record<PostDepth, string> = {
  1: "스노클",
  2: "다이빙",
  3: "심해",
};

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
  /** 미지정이면 뱃지를 붙이지 않는다 — 선언 안 한 글에 등급을 지어내지 않기 위해서다 */
  depth?: PostDepth;
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
  // 잘못된 값은 조용히 무시하지 않고 빌드를 막는다 — frontmatter 검증이 발행 관문이다(docs/publishing.md)
  if (data.depth !== undefined && ![1, 2, 3].includes(data.depth)) {
    throw new FrontmatterError(slug, `frontmatter "depth"는 1(스노클)·2(다이빙)·3(심해) 중 하나여야 합니다 (현재: ${data.depth})`);
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
    depth: data.depth as PostDepth | undefined,
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
