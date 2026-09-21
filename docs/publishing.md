# 발행 가이드 (BLOG-3)

모든 쓰기 작업은 repo 직접 푸시로만 한다 (블로그·워크벤치는 read-only).

## 절차

1. `content/posts/<slug>.md` 작성 — slug가 URL이 된다 (`/posts/<slug>/`)
2. frontmatter 작성 — 규격은 [frontmatter-schema.md](frontmatter-schema.md). `status: published`여야 노출된다
3. 로컬 확인: `npm run dev` 또는 `npm run build` (필수 필드 누락 시 여기서 빌드가 실패한다 — 발행 관문)
4. main에 푸시(또는 PR 머지) → GitHub Actions가 빌드·배포 → https://chaeeun037.github.io 노출

## 주의

- draft 글(`status: draft` 또는 status 생략)은 목록·상세 어디에도 생성되지 않는다
- ~~published 글이 0편이면 빌드가 실패한다~~ **해소됨(2026-09-21).** `output: export`가 동적 라우트에 정적 경로를 최소 하나 요구하는 건 여전하지만, 글이 0편일 때만 자리 채움 슬러그 하나를 내보내고 그 경로를 `notFound()`로 떨어뜨린다(`src/app/posts/[slug]/page.tsx`). 글이 한 편이라도 있으면 그 슬러그는 생성되지 않는다.
