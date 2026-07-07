"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DRAFT_REPO, RUNS_REPO, tokenStore, validateToken } from "@/lib/github";

type Props = {
  /** 인증된 토큰과, 401 시 게이트로 복귀시키는 콜백을 받는다 */
  children: (token: string, onAuthError: () => void) => ReactNode;
};

export default function AuthGate({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(tokenStore.get());
    setReady(true);
  }, []);

  function handleAuthError() {
    tokenStore.clear();
    setToken(null);
    setError("토큰이 만료되었거나 권한이 없습니다. 다시 입력해주세요.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const candidate = input.trim();
    if (!candidate) return;
    setBusy(true);
    setError(null);
    const result = await validateToken(candidate).catch(() => ({
      ok: false as const,
      message: "네트워크 오류 — 잠시 후 다시 시도하세요.",
    }));
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "인증에 실패했습니다.");
      return;
    }
    tokenStore.set(candidate);
    setInput("");
    setToken(candidate);
  }

  if (!ready) return null;

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-20">
        <h1 className="text-xl font-bold">Workbench</h1>
        <p className="mt-2 text-sm text-gray-500">
          비공개 영역입니다. <code>{DRAFT_REPO}</code>·<code>{RUNS_REPO}</code>에 Contents
          read 권한이 있는 fine-grained PAT를 입력하세요.
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="github_pat_…"
            autoComplete="off"
            className="rounded border border-gray-300 px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={busy || input.trim() === ""}
            className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
          >
            {busy ? "검증 중…" : "인증"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end px-6 pt-4">
        <button
          onClick={() => {
            tokenStore.clear();
            setToken(null);
          }}
          className="text-xs text-gray-400 hover:underline"
        >
          토큰 삭제(로그아웃)
        </button>
      </div>
      {children(token, handleAuthError)}
    </div>
  );
}
