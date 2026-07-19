import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "About",
  description: "프론트엔드 개발자 김채은 — 탐험가 프로필(경력 하이라이트·기술 스택)",
};

// ── 콘텐츠 원본: docs/about-content.md + mockup-about-v1
// Q1~Q6 전부 확정 반영(2026-07-19) — 결정 기록은 docs/about-content.md 4장 참조

const INTRO =
  "문제를 파고들어 근본 원인까지 내려가는 프론트엔드 개발자. 해결 과정과 그때 내린 기술 결정을 기록합니다.";

const ROLE =
  "돌봄 매칭 플랫폼에서 프론트엔드 개발을 리딩하고 있습니다(소수 인원 FE 체제). 신규 입사자 온보딩·멘토링, 팀 컨벤션과 리뷰 프로세스 정착, 신규 사업 FE 설계를 맡아 왔습니다.";

type GearGroup = {
  label: string;
  variant?: "main" | "infra";
  items: string[];
};

const GEAR: GearGroup[] = [
  { label: "주력", variant: "main", items: ["React", "TypeScript", "Next.js", "React Query"] },
  {
    label: "실무 검증",
    items: ["모노레포", "Storybook", "Feature Toggle", "Jest/RTL/MSW", "렌더 최적화"],
  },
  {
    label: "인프라 · 관측 — 화면 너머까지",
    variant: "infra",
    items: ["Docker", "GitHub Actions", "ArgoCD", "Nginx", "Sentry", "Datadog"],
  },
  { label: "AI 워크플로", items: ["Claude Code 멀티에이전트", "AI 코드리뷰"] },
];

type Expedition = {
  no: string;
  title: string;
  desc: string;
  stat: string;
  /** 연결 글감. 전부 발행 예정(soon) — 발행되면 slug를 채운다 */
  post: string;
};

const EXPEDITIONS: Expedition[] = [
  {
    no: "EXP.01",
    title: "모노레포 배포 시간 34.2% 단축",
    desc: "Docker 레이어 캐싱과 BuildKit registry cache로, 소스만 바뀌어도 의존성을 재설치하던 배포를 재설계.",
    stat: "약 20분 → 13분대",
    post: "Docker 레이어 캐싱으로 배포 줄이기",
  },
  {
    no: "EXP.02",
    title: "8개월 묵은 사파리 채팅 WebSocket 난제 해결",
    desc: "오래 미해결이던 이슈를 프론트 범위를 넘어 인프라(CORS) 영역까지 추적해 마무리.",
    stat: "8개월 미해결 → 해결",
    post: "FE에서 인프라까지 내려간 추적기",
  },
  {
    no: "EXP.03",
    title: "신규 광고 BM 안정화 + 사파리 백필 복구",
    desc: "광고 SDK 모노레포 이식, Nginx 보안 헤더 재설계(CSP 수립)로 사파리에서 차단되던 백필 광고 복구.",
    stat: "CPV 목표 달성 · 집계 정합성 확보",
    post: "보안 헤더에 막힌 광고 되살리기",
  },
  {
    no: "EXP.04",
    title: "대량 푸시로 죽던 서버 부하를 캐싱으로 해소",
    desc: "대량 발송 시 과호출되던 API를 24h TTL 캐시 + inFlight 중복 제거로 재설계.",
    stat: "캐시 적중률 92.5%",
    post: "TTL 캐싱과 inFlight 중복 제거",
  },
  {
    no: "EXP.05",
    title: "흩어진 팀 컨벤션을 실행 가능한 PR 게이트로",
    desc: "반복 지적되던 컨벤션 ~40개를 프리플라이트 린터로 자동화, 기계 검사와 LLM 검사를 분리해 튜닝.",
    stat: "LLM 검사 76초 → 5초",
    post: "기계 검사와 LLM 검사 분리하기",
  },
];

export default function AboutPage() {
  // 딥다이브 글은 아직 0편 — 가장 최근 발행글(빌딩 로그)로 동선을 잇는다
  const latestPost = getPublishedPosts()[0];

  return (
    <main className="charsheet">
      <div className="about-head">
        <div className="wrap">
          <div className="about-eyebrow">BASE CAMP</div>
          <h1 className="about-title">탐험가 프로필</h1>

          <div className="sheet">
            {/* 좌: 프로필 + 장비 슬롯 */}
            <aside className="panel">
              <div className="avatar-wrap">
                <div className="ph avatar">
                  아바타 자리
                  <br />
                  다이버/백패커 64²
                  <br />
                  (에셋 파이프라인 후)
                </div>
                <div className="text-center">
                  <div className="p-name">채은</div>
                  <div className="p-tag">Frontend Developer</div>
                </div>
              </div>

              <p className="p-intro">{INTRO}</p>
              <div className="p-role">{ROLE}</div>

              <div className="p-links">
                <a href="https://github.com/chaeeun037">GitHub</a>
                <span aria-hidden>·</span>
                <a href="mailto:chaeeun.dev@gmail.com">Email</a>
              </div>

              <div className="gear">
                <h3>장비 슬롯</h3>
                {GEAR.map((group) => (
                  <div className="slot-group" key={group.label}>
                    <div className="slot-label">{group.label}</div>
                    <div className="slots">
                      {group.items.map((item) => (
                        <span
                          className={`slot${group.variant ? ` ${group.variant}` : ""}`}
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* 우: 탐사 일지 */}
            <section className="exped">
              <h2>탐사 일지</h2>
              <div className="sub">
                검증된 수치만 기록합니다 — 각 탐사의 전체 이야기는 다이빙 로그로 발행 예정
              </div>

              {EXPEDITIONS.map((exp) => (
                <article className="log" key={exp.no}>
                  <span className="no">{exp.no}</span>
                  <h3>{exp.title}</h3>
                  <p>{exp.desc}</p>
                  <div className="meta">
                    <span className="stat">{exp.stat}</span>
                    <span className="post-link soon">{exp.post}</span>
                  </div>
                </article>
              ))}

              {latestPost && (
                <div className="featured-note">
                  🏕 탐사의 전체 기록(다이빙 로그)은 순차 발행 중입니다. 지금은{" "}
                  <Link href={`/posts/${latestPost.slug}`}>{latestPost.title}</Link>
                  를 읽을 수 있어요.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
