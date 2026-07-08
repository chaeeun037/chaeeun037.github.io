import { DRAFT_REPO, RUNS_REPO, GhNotFoundError, fetchRawFile } from "@/lib/github";

export const LEDGER_PATH = "momsitter/portfolio-score-ledger.json";

/* ---------- 원장 원형 (dev-journal portfolio-score-ledger.json) ---------- */

interface RawRunScore {
  total: number;
  dims?: number[];
  scored_at?: string;
}

interface RawRun {
  created: string;
  title: string;
  merged?: boolean;
  written?: boolean;
  state?: string;
  source?: string;
  artifact?: string;
  scores?: Record<string, RawRunScore>;
}

interface RawChainScore {
  narrative_value: number;
  dims?: number[];
  note?: string;
}

interface RawChain {
  title: string;
  source?: string;
  arc_type?: string;
  spine?: string;
  members: string[];
  provisional?: boolean;
  span?: { from?: string; to?: string; ongoing?: boolean };
  scores?: Record<string, RawChainScore>;
}

export interface Ledger {
  current_rubric_version: number | string;
  current_chain_rubric_version: number | string;
  runs: Record<string, RawRun>;
  chains: Record<string, RawChain>;
}

/* ---------- 워크벤치 표시 모델 (PRD §9 규칙 적용 결과) ---------- */

export interface RunCandidate {
  id: string;
  title: string;
  created: string;
  /** current_rubric_version 점수만. 없으면 미채점 */
  score: number | null;
  written: boolean;
  source: "FE" | "HARNESS";
  artifact?: string;
}

export interface ChainMember {
  id: string;
  title: string;
  written: boolean;
  score: number | null;
  artifact?: string;
}

export interface ChainCandidate {
  id: string;
  title: string;
  spine?: string;
  /** narrative_value (current_chain_rubric_version) */
  score: number | null;
  spanTo: string;
  ongoing: boolean;
  provisional: boolean;
  members: ChainMember[];
}

function runScore(run: RawRun, version: string): number | null {
  return run.scores?.[version]?.total ?? null;
}

function toCandidate(id: string, run: RawRun, version: string): RunCandidate {
  return {
    id,
    title: run.title,
    created: run.created,
    score: runScore(run, version),
    written: run.written === true,
    source: run.source === "HARNESS" ? "HARNESS" : "FE",
    artifact: run.artifact,
  };
}

/** 단독 글감 후보 — merged:false·closed 제외, written 제외 (PRD §9) */
export function getRunCandidates(ledger: Ledger): RunCandidate[] {
  const version = String(ledger.current_rubric_version);
  return Object.entries(ledger.runs)
    .filter(([, run]) => run.merged !== false && run.state !== "closed" && run.written !== true)
    .map(([id, run]) => toCandidate(id, run, version));
}

/** 체인 후보 — 멤버는 written이어도 표시(뱃지) (PRD §9) */
export function getChainCandidates(ledger: Ledger): ChainCandidate[] {
  const runVersion = String(ledger.current_rubric_version);
  const chainVersion = String(ledger.current_chain_rubric_version);
  return Object.entries(ledger.chains).map(([id, chain]) => ({
    id,
    title: chain.title,
    spine: chain.spine,
    score: chain.scores?.[chainVersion]?.narrative_value ?? null,
    spanTo: chain.span?.to ?? "",
    ongoing: chain.span?.ongoing === true,
    provisional: chain.provisional === true,
    members: chain.members.map((memberId) => {
      const run = ledger.runs[memberId];
      return {
        id: memberId,
        title: run?.title ?? memberId,
        written: run?.written === true,
        score: run ? runScore(run, runVersion) : null,
        artifact: run?.artifact,
      };
    }),
  }));
}

export type SortKey = "score" | "recent";

export function sortRuns(list: RunCandidate[], by: SortKey): RunCandidate[] {
  return [...list].sort((a, b) =>
    by === "score"
      ? (b.score ?? -1) - (a.score ?? -1)
      : b.created.localeCompare(a.created),
  );
}

export function sortChains(list: ChainCandidate[], by: SortKey): ChainCandidate[] {
  return [...list].sort((a, b) =>
    by === "score"
      ? (b.score ?? -1) - (a.score ?? -1)
      : b.spanTo.localeCompare(a.spanTo),
  );
}

/* ---------- 데이터 fetch (전부 런타임, 빌드 산출물 미포함) ---------- */

export async function fetchLedger(token: string): Promise<Ledger> {
  const raw = await fetchRawFile(DRAFT_REPO, LEDGER_PATH, token);
  return JSON.parse(raw) as Ledger;
}

/** run 미리보기 md — 경로 매핑 규칙은 PRD §9 (OQ-1 확정) */
export async function fetchRunPreview(
  run: Pick<RunCandidate, "id" | "artifact">,
  token: string,
): Promise<{ path: string; markdown: string }> {
  if (run.artifact) {
    const path = run.artifact.replace(/^claude-notes\//, "momsitter/");
    return { path: `${DRAFT_REPO}/${path}`, markdown: await fetchRawFile(DRAFT_REPO, path, token) };
  }
  const candidates = ["runs-archive", "runs"].flatMap((dir) =>
    ["implementation.md", "plan.md", "task.md"].map((file) => `${dir}/${run.id}/${file}`),
  );
  for (const path of candidates) {
    try {
      return { path: `${RUNS_REPO}/${path}`, markdown: await fetchRawFile(RUNS_REPO, path, token) };
    } catch (e) {
      if (e instanceof GhNotFoundError) continue;
      throw e;
    }
  }
  throw new GhNotFoundError(`${RUNS_REPO}/runs(-archive)/${run.id}/*.md`);
}
