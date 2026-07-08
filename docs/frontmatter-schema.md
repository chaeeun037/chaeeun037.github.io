# Frontmatter 스키마 (BLOG-5)

`content/posts/<slug>.md`의 frontmatter 규격. 파서: `src/lib/posts.ts` (gray-matter).
필수 필드가 누락되면 **빌드가 실패한다** — 대충 쓴 글이 발행되는 것을 막는 관문.

## 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `title` | string | ✅ | — | 글 제목 |
| `description` | string | ✅ | — | 요약. 목록·메타태그(SEO-1)에 사용 |
| `date` | YYYY-MM-DD | ✅ | — | 작성일. 목록 정렬 기준 |
| `status` | `draft` \| `published` | — | `draft` | **published만 노출.** draft는 목록·상세 어디에도 생성 안 됨 |
| `tags` | string[] | — | `[]` | 태그 |
| `series` | string | — | — | 시리즈명 (예: `빌딩 로그`) |
| `featured` | boolean | — | `false` | 대표글 여부. 랜딩 큐레이션(BLOG-4)에서 사용 |

- slug는 파일명에서 결정된다 (`hello-world.md` → `/posts/hello-world`).

## 예시

```yaml
---
title: "Next.js static export로 블로그 다시 짓기"
description: "GitHub Pages 위에서 Next.js를 정적으로 돌리기 위한 결정들"
date: 2026-07-07
status: published
tags: [nextjs, github-pages]
series: 빌딩 로그
featured: true
---
```
