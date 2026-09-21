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
  /** 본문을 고친 날. sitemap의 lastModified가 이걸 쓴다 — 발행일이 아니라 수정일이 맞는 자리다 */
  updated?: string;
  /**
   * 경험 시점(`YYYY-MM`). **정렬·RSS·OG에는 쓰지 않는다** — 그 자리는 발행일 몫이다.
   * 오래전 경험을 최근에 정리했을 때 "지금 처음 겪은 일"로 읽히지 않게 하는 표시 전용 필드.
   */
  experiencedAt?: string;
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

function normalizeDate(value: unknown, slug: string, field = "date"): string {
  // YAML은 따옴표 없는 날짜를 Date로 파싱한다
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    throw new FrontmatterError(slug, `frontmatter "${field}"는 YYYY-MM-DD 형식이어야 합니다`);
  }
  return date.toISOString().slice(0, 10);
}

/**
 * 경험 시점 — `YYYY-MM`(월) 또는 `YYYY-MM-DD`(일)를 받는다.
 * 월까지만 적어도 되게 한 이유: 몇 년 전 경험의 날짜를 정확히 기억할 수 없고,
 * 굳이 지어내면 그게 더 부정확한 기록이 된다.
 * YAML이 `2024-03`을 문자열로, `2024-03-05`를 Date로 파싱하므로 둘 다 받는다.
 */
function normalizeExperiencedAt(value: unknown, slug: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 7);
  if (typeof value !== "string" || !/^\d{4}-\d{2}(-\d{2})?$/.test(value.trim())) {
    throw new FrontmatterError(
      slug,
      `frontmatter "experiencedAt"는 YYYY-MM 또는 YYYY-MM-DD 형식이어야 합니다 (현재: ${String(value)})`,
    );
  }
  return value.trim().slice(0, 7); // 표시는 월 단위로 통일한다
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
    updated: data.updated === undefined ? undefined : normalizeDate(data.updated, slug, "updated"),
    experiencedAt:
      data.experiencedAt === undefined ? undefined : normalizeExperiencedAt(data.experiencedAt, slug),
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

/** 발행 글만, **발행일 최신순**(기본 정렬) */
export function getPublishedPosts(): PostMeta[] {
  return readAll()
    .filter((p) => p.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content: _content, ...meta }) => meta);
}

/**
 * 경험 시점 최신순. 기본 목록은 발행일 순이고 이건 **선택적 보기**다 —
 * "언제 겪은 일인지" 축으로 훑고 싶을 때 쓴다. 경험 시점이 없는 글은 발행일로 대신한다.
 * (지금은 UI가 이 정렬을 노출하지 않는다. 데이터와 함수만 먼저 둔다.)
 */
export function getPublishedPostsByExperience(): PostMeta[] {
  return getPublishedPosts().sort((a, b) =>
    (b.experiencedAt ?? b.date).localeCompare(a.experiencedAt ?? a.date),
  );
}

/** 발행 글 단건 (draft는 상세 페이지도 생성하지 않는다) */
export function getPublishedPost(slug: string): Post | undefined {
  return readAll().find((p) => p.slug === slug && p.status === "published");
}

/** 대표글 (BLOG-4 큐레이션용) */
export function getFeaturedPosts(): PostMeta[] {
  return getPublishedPosts().filter((p) => p.featured);
}
