/**
 * 관측소 스냅샷 (WB-1b / #31) — 1단계: 타입 + 목업.
 * 설계: claude-harness `contexts/personal/blog/design/observatory-design-2026-09-21.md`
 *
 * **이 타입에 없는 것은 스냅샷에 존재하지 않는다.** 화이트리스트가 유일한 방어선이다 —
 * 스냅샷은 공개 데이터이므로(공개 Gist·정적 번들 어느 쪽이든 누구나 받아갈 수 있다),
 * 제목·spine·source·arc_type·원점수·티켓번호·일 단위 날짜는 담지 않는다.
 */

export type Magnitude = 1 | 2 | 3 | 4 | 5;

export interface Star {
  /** 원장 키의 해시 앞자리 — 역산 불가, 갱신 간 안정 */
  id: string;
  /** 광도 = 점수 버킷. 1~4는 사분위, 5는 상위 5%. 원점수는 싣지 않는다 */
  magnitude: Magnitude;
  /** 발행된 글감 — 바다로 내려간 별 */
  written: boolean;
  /** 일이 끝났는지 — 선명 vs 흐림 */
  merged: boolean;
  /** YYYY-MM. "2026년 7월생 별". 일 단위는 회사 일정과 대조 가능해 버린다 */
  born: string;
  /** 시드 기반 생성 문양. **제목의 함수가 아니다** — 원본이 없어야 복호화가 불가능하다 */
  glyph: string;
}

export interface Constellation {
  id: string;
  /** Star.id 참조 — 연결 구조만 */
  members: string[];
  magnitude: Magnitude;
  /** 멤버 중 가장 이른 시점 */
  born: string;
  /**
   * 별자리 이름 — **저자 선언.** 주제에서 자동 생성하지 않는다.
   * 자동 생성하면 매핑이 체계적이라 패턴이 샌다.
   * 허용 층위는 분야("광고자리")까지. 제휴사·구체 기능명·티켓번호는 금지.
   * 미지정이면 이름 없이 글리프로만 표시한다.
   */
  name?: string;
}

export interface ObservatorySnapshot {
  version: 1;
  /** YYYY-MM */
  generatedAt: string;
  stars: Star[];
  constellations: Constellation[];
}

/* ────────────────────────────────────────────────────────────
   별 스프라이트 — 셀 단위 픽셀. 광도마다 실루엣이 다르다.
   히어로 티저와 관측소가 같은 함수를 쓴다(두 곳의 별이 달라 보이면 안 된다).
   ──────────────────────────────────────────────────────────── */

/** 광도별 셀 좌표. 1칸 = u px, 정수 배율만(§4.3) */
export function starCells(mag: Magnitude): [number, number][] {
  if (mag === 1) return [[0, 0]];
  if (mag === 2) return [[0, 0], [1, 0], [0, 1], [1, 1]];
  if (mag === 3) {
    return [[0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [-2, 0], [-1, 0], [1, 0], [2, 0]];
  }
  if (mag === 4) {
    // 대각은 1칸까지. 2칸 이상 뻗으면 별이 아니라 꽃이 된다
    return [
      [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3],
      [-3, 0], [-2, 0], [-1, 0], [1, 0], [2, 0], [3, 0],
      [-1, -1], [1, -1], [-1, 1], [1, 1],
    ];
  }
  // 광도 5 — 대각 팔이 뻗은 8갈래. 대각 주변을 채우면 사각 뭉치가 되므로 팔만 뻗는다
  return [
    [0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
    [-4, 0], [-3, 0], [-2, 0], [-1, 0], [1, 0], [2, 0], [3, 0], [4, 0],
    [-1, -1], [-2, -2], [-3, -3],
    [1, -1], [2, -2], [3, -3],
    [-1, 1], [-2, 2], [-3, 3],
    [1, 1], [2, 2], [3, 3],
  ];
}

/** 별 색온도 — 실제 별처럼 청백~주황. **장식이다**(등급이 아니다) */
export const STAR_TEMPS = ["#cfe4ff", "#edf2f7", "#ffeccc", "#ffc98a", "#ffb347"];
/** written 전용 — 이것만 색이 데이터다 */
export const WATER = "#7fd4e8";

/** 결정론적 난수 — 같은 스냅샷이면 언제 봐도 같은 하늘 */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 문자열 → 안정적인 정수 시드 */
export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ────────────────────────────────────────────────────────────
   목업 — 1단계는 실데이터를 한 번도 건드리지 않는다.
   규모만 실제와 맞춘다(2026-09-21 원장: run 77 · chain 20 · written 10).
   ──────────────────────────────────────────────────────────── */

/**
 * 별자리 이름 초안 (2026-09-22) — 원장 22개 체인의 spine 을 읽고 지었다.
 *
 * **고유명사 0개.** 제휴사·기능명·티켓번호를 쓰지 않고 *일어난 일의 모양*으로만 부른다:
 * 인증은 "열쇠", 토글은 "수문", 중복은 "겹그림자". 같은 영역을 두 번 판 것은 접미사로 묶는다.
 *
 * 점수 내림차순이라 배열 순서 = 대략의 중요도다.
 * 실데이터 연결(2단계) 시 체인 id 와 매핑해 옮긴다 — **확정은 저자 몫**이다.
 */
const DRAFT_NAMES = [
  "관측탑자리",            // 에러 볼륨 KPI — 기준선을 스스로 폐기하고 감축·검증
  "대장간자리",            // 자기 도구를 벼리다 그 도구가 낳은 비용을 다시 고침
  "관문자리",              // 게이트를 우회했다 원안으로 되돌아오기까지 네 번
  "매듭자리",              // 하나를 당겼더니 다른 매듭이 풀림
  "눈금자리",              // 재는 수단을 잃자 판정 기준을 갈아끼움
  "모닥불자리",            // 혼자 쬐던 불을 여럿이 쬐게
  "열쇠자리 · 첫 문",      // 새 문을 열자 안쪽이 옛 지도만 알고 있었다
  "되감김자리",            // 되돌렸는데 나흘 뒤 누가 다시 뒤집음
  "증명자리",              // 신원을 확인하는 방식을 바꾸자 연쇄가 시작됨
  "열쇠자리 · 두 번째 문", // 같은 문을 다시, 이번엔 분석부터
  "겹그림자자리",          // 같은 것이 두 번 나타나는 걸 세 번에 걸쳐 봉쇄
  "저울자리",              // 값을 매기고 청구하는 길
  "뒤집힌표식자리",        // 정책이 뒤집혀 표식 장치를 통째로 버림
  "봉인자리",              // 봉인 방식을 세 안 세웠다가 스스로 폐기
  "길목자리",              // 작은 부탁이 지켜야 할 길목으로
  "묵은해도자리",          // 몇 년째 있던 잘못된 지도 한 장
  "작은깃발자리",          // 깃발 하나 다는 일이 전면 작업이 됨
  "수문자리",              // 수문을 닫고 나서 물길이 그대로인지 확인
  "뱃길자리",              // 배는 그대로였다 — 항로 규약이 만든 차이
  "겹접수자리",            // 같은 배에 두 번 오르지 못하게
];

export function mockSnapshot(): ObservatorySnapshot {
  const r = seeded(20260921);
  const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
  const stars: Star[] = [];

  for (let i = 0; i < 77; i++) {
    const roll = r();
    stars.push({
      id: `s${i.toString(36)}${Math.floor(r() * 1296).toString(36)}`,
      // 상위 5%만 광도 5 — 등급이 흔하면 등급이 아니다
      magnitude: (roll > 0.95 ? 5 : (1 + Math.floor(roll * 4))) as Magnitude,
      written: i < 10,
      merged: r() > 0.22,
      born: months[Math.floor(r() * months.length)],
      glyph: String.fromCharCode(0x4e00 + Math.floor(r() * 2000)),
    });
  }

  const constellations: Constellation[] = [];
  let cursor = 10; // written 은 하늘을 떠났으므로 별자리 구성에서 제외
  for (let c = 0; c < 20 && cursor < stars.length; c++) {
    const size = 2 + Math.floor(r() * 3); // 최소 2 — 혼자면 선이 없어 별자리가 아니다
    const members = stars.slice(cursor, cursor + size).map((s) => s.id);
    cursor += size;
    if (members.length < 2) continue; // 혼자면 별자리가 아니다(선이 없다)
    const born = stars
      .filter((s) => members.includes(s.id))
      .map((s) => s.born)
      .sort()[0];
    constellations.push({
      id: `c${c}`,
      members,
      magnitude: (1 + Math.floor(r() * 5)) as Magnitude,
      born,
      name: DRAFT_NAMES[c],
    });
  }

  return { version: 1, generatedAt: "2026-09", stars, constellations };
}

/** 티저용 — 홈에서는 이 수 하나만 쓴다(스냅샷 전체를 fetch하면 LCP 비용이 홈으로 온다) */
export const TEASER_STAR_COUNT = 77;
