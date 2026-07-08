---
title: "서버 없이 비공개 데이터 읽기 — Draft 워크벤치 설계"
description: "정적 사이트 안에 PAT 인증 read-only 도구를 넣기까지의 결정들. 빌딩 로그 2편."
date: 2026-07-07
status: draft
tags: [nextjs, github-api]
series: 빌딩 로그
---

<!-- TODO(채은): 초안입니다. 경험·감상을 본인 목소리로 다듬은 뒤 status: published로 전환하세요. -->

이 블로그에는 비공개 영역이 하나 있다. `/workbench` — 내 draft 저장소의 글감 후보들을 포트폴리오 적합도 점수순으로 열람하는 도구다. 문제는 이 블로그가 GitHub Pages 위의 순수 정적 사이트라는 것. 서버가 없는데 비공개 데이터를 어떻게 안전하게 읽을까.

## 요구사항

- draft와 점수 원장은 private repo에 있다. 빌드 산출물에 절대 포함되면 안 된다.
- 사용자는 나 한 명. 로그인 인프라를 만들 이유가 없다.
- 읽기만 한다. 모든 쓰기는 repo 직접 푸시.

## 결정 1: fine-grained PAT + 런타임 fetch

OAuth는 브라우저 단독으로 토큰 교환이 안 된다(CORS + client secret). 프록시 서버를 두는 순간 "서버 없음"이 깨진다. 사용자가 1인이면 답은 단순해진다 — fine-grained PAT를 입력받아 localStorage에 두고, GitHub Contents API를 클라이언트에서 직접 호출한다. 보안의 실체는 UI가 아니라 **private repo의 권한 모델**이다. 401이 오면 토큰을 지우고 재입력을 받는 폴백이 인증 UX의 전부다.

## 결정 2: 파일 브라우저가 아니라 원장 뷰어

글감 후보를 파일 트리로 보여주면 점수·서사 맥락이 사라진다. 점수 시스템이 이미 단일 JSON 원장(runs·chains)을 유지하고 있으므로, 워크벤치는 **원장 1회 fetch**로 리스트를 그리고 md는 선택 시에만 가져온다. N+1 커밋 조회가 원천적으로 없다.

## 예상과 달랐던 것

경로 매핑 규칙을 확정하려고 실물 repo를 열어보니, PRD의 가설(`runs-archive/{run-id}.md` 단일 파일)이 틀려 있었다. 실제는 run당 디렉토리였고 안에 implementation/plan/task가 나뉘어 있었다. 가설은 문서가 아니라 실물로 검증해야 한다는 당연한 교훈. 이 발견으로 PAT 스코프도 repo 1개에서 2개로 늘었다.

<!-- TODO(채은): 실제 사용해본 소감, 스크린샷 추가 -->
