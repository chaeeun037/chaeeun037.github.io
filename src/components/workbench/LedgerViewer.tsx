"use client";

import { useCallback, useEffect, useState } from "react";
import { GhAuthError } from "@/lib/github";
import {
  fetchLedger,
  fetchRunPreview,
  getChainCandidates,
  getRunCandidates,
  sortChains,
  sortRuns,
  type ChainCandidate,
  type Ledger,
  type RunCandidate,
  type SortKey,
} from "@/lib/ledger";
import { renderMarkdownBasic } from "@/lib/markdown";

type Tab = "runs" | "chains";

type Preview =
  | { kind: "loading"; label: string }
  | { kind: "markdown"; label: string; path: string; html: string }
  | { kind: "chain"; chain: ChainCandidate }
  | { kind: "error"; label: string; message: string };

function Badge({ children, tone }: { children: string; tone: "green" | "amber" | "gray" }) {
  const tones = {
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    gray: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  } as const;
  return <span className={`rounded px-1.5 py-0.5 text-[11px] ${tones[tone]}`}>{children}</span>;
}

function Score({ value }: { value: number | null }) {
  if (value === null) return <Badge tone="gray">미채점</Badge>;
  return <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>;
}

export default function LedgerViewer({
  token,
  onAuthError,
}: {
  token: string;
  onAuthError: () => void;
}) {
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("runs");
  const [sort, setSort] = useState<SortKey>("score");
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    fetchLedger(token)
      .then(setLedger)
      .catch((e) => {
        if (e instanceof GhAuthError) onAuthError();
        else setError(e instanceof Error ? e.message : String(e));
      });
  }, [token, onAuthError]);

  const openRun = useCallback(
    async (run: Pick<RunCandidate, "id" | "title" | "artifact">) => {
      setPreview({ kind: "loading", label: run.title });
      try {
        const { path, markdown } = await fetchRunPreview(run, token);
        const html = await renderMarkdownBasic(markdown);
        setPreview({ kind: "markdown", label: run.title, path, html });
      } catch (e) {
        if (e instanceof GhAuthError) return onAuthError();
        setPreview({
          kind: "error",
          label: run.title,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    },
    [token, onAuthError],
  );

  if (error) return <p className="py-20 text-center text-sm text-red-500">{error}</p>;
  if (!ledger) return <p className="py-20 text-center text-sm text-gray-500">원장 불러오는 중…</p>;

  const runs = sortRuns(getRunCandidates(ledger), sort);
  const chains = sortChains(getChainCandidates(ledger), sort);

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[minmax(320px,2fr)_3fr]">
      {/* 좌: 리스트 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1 text-sm">
            {(["runs", "chains"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-2.5 py-1 ${tab === t ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                {t === "runs" ? `글감 후보 ${runs.length}` : `체인 ${chains.length}`}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSort(sort === "score" ? "recent" : "score")}
            className="text-xs text-gray-500 hover:underline"
          >
            정렬: {sort === "score" ? "점수순" : "최신순"} ⇄
          </button>
        </div>

        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {tab === "runs" &&
            runs.map((run) => (
              <li key={run.id}>
                <button onClick={() => openRun(run)} className="flex w-full items-start justify-between gap-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-900">
                  <span>
                    <span className="block text-sm font-medium">{run.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                      {run.created} <Badge tone="gray">{run.source}</Badge>
                    </span>
                  </span>
                  <Score value={run.score} />
                </button>
              </li>
            ))}
          {tab === "chains" &&
            chains.map((chain) => (
              <li key={chain.id}>
                <button onClick={() => setPreview({ kind: "chain", chain })} className="flex w-full items-start justify-between gap-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-900">
                  <span>
                    <span className="block text-sm font-medium">{chain.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                      ~{chain.spanTo}
                      {chain.ongoing && <Badge tone="green">진행 중</Badge>}
                      {chain.provisional && <Badge tone="amber">추정치</Badge>}
                      <span>멤버 {chain.members.length}</span>
                    </span>
                  </span>
                  <Score value={chain.score} />
                </button>
              </li>
            ))}
        </ul>
      </section>

      {/* 우: 미리보기 */}
      <section className="min-h-[60vh] rounded border border-gray-100 p-5 dark:border-gray-800">
        {!preview && <p className="text-sm text-gray-400">왼쪽에서 글감을 선택하면 미리보기가 열립니다.</p>}
        {preview?.kind === "loading" && <p className="text-sm text-gray-400">{preview.label} 불러오는 중…</p>}
        {preview?.kind === "error" && (
          <div className="text-sm">
            <p className="font-medium">{preview.label}</p>
            <p className="mt-2 text-red-500">{preview.message}</p>
          </div>
        )}
        {preview?.kind === "markdown" && (
          <div>
            <p className="mb-4 break-all font-mono text-xs text-gray-400">{preview.path}</p>
            <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: preview.html }} />
          </div>
        )}
        {preview?.kind === "chain" && (
          <div className="text-sm">
            <h2 className="text-base font-semibold">{preview.chain.title}</h2>
            {preview.chain.spine && <p className="mt-3 text-gray-600 dark:text-gray-400">{preview.chain.spine}</p>}
            <h3 className="mt-5 text-xs font-semibold uppercase text-gray-400">멤버 ({preview.chain.members.length})</h3>
            <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
              {preview.chain.members.map((member) => (
                <li key={member.id}>
                  <button onClick={() => openRun(member)} className="flex w-full items-center justify-between gap-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900">
                    <span className="flex items-center gap-2">
                      {member.title}
                      {member.written && <Badge tone="green">발행됨</Badge>}
                    </span>
                    <Score value={member.score} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
