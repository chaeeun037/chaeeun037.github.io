---
title: "블로그를 다시 짓다 — 리뉴얼 킥오프"
description: "5년 묵은 Jekyll 블로그를 밀고 Next.js static export로 다시 시작하며 내린 결정들. 빌딩 로그 1편."
date: 2026-07-07
status: published
tags: [nextjs, github-pages]
series: 빌딩 로그
---

5년 전에 만든 Jekyll 블로그를 밀어냈다. 글 99편은 `archive/`로 옮겨 보존했고, 같은 저장소 위에 Next.js로 다시 짓는다. 이 글은 그 과정의 기술 결정을 기록하는 빌딩 로그의 첫 편이다.

## 왜 다시 짓는가

기존 블로그가 죽은 원인을 오래 생각했는데, 결론은 플랫폼이 아니라 **글감의 질**이었다. 형식만 갖춘 글을 양산하다 멈췄다. 그래서 이번 리뉴얼의 중심은 예쁜 블로그가 아니라, 좋은 글감이 발행의 관문이 되는 워크플로우다. 발행 주기도 강제하지 않는다. 양이 아니라 편당 밀도로 승부한다.

## 첫 결정: Next.js static export

콘텐츠 사이트라면 Astro가 정석에 가깝다. 그런데도 Next.js를 골랐다.

- 이 블로그는 앞으로 비공개 워크벤치(draft 열람 도구)를 품을 예정이고, 언젠가 Node 서버를 직접 붙여 CRUD로 확장할 계획이 있다. 그 마이그레이션 경로가 프레임워크 안에 내장되어 있다는 게 결정적이었다.
- 당분간은 GitHub Pages 위에서 `output: "export"`로 순수 정적 사이트로 돈다. API Routes, SSR, ISR, 이미지 최적화를 못 쓴다는 제약을 알고 수용했다.

## 발행 파이프라인

이 글이 그 파이프라인의 첫 통과물이다.

```
md 작성 → frontmatter 검증(빌드 관문) → main 푸시 → GitHub Actions → Pages 배포
```

frontmatter에 필수 필드(title, description, date)가 빠지면 빌드가 실패하도록 파서를 짰다. 대충 쓴 글이 발행되는 것을 시스템이 막는다 — 실패 원인을 도구로 재발 방지하는 셈이다.

다음 편은 draft 워크벤치를 다룰 예정이다. 비공개 draft 저장소를 런타임 GitHub API로 읽는, 서버 없는 read-only 도구다.
