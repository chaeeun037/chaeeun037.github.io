const TOKEN_KEY = "workbench_pat";

export const DRAFT_REPO = "chaeeun037/dev-journal";
export const RUNS_REPO = "chaeeun037/claude-harness";

/** 401/403 — 토큰이 무효하거나 권한이 없음. 토큰 삭제 → 재입력 폴백 트리거. */
export class GhAuthError extends Error {
  constructor(public status: number) {
    super(`GitHub 인증 실패 (${status})`);
    this.name = "GhAuthError";
  }
}

/** 404 — 파일 없음(또는 fine-grained PAT 스코프 밖). 미리보기 폴백 체인에서 사용. */
export class GhNotFoundError extends Error {
  constructor(path: string) {
    super(`파일 없음: ${path}`);
    this.name = "GhNotFoundError";
  }
}

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

function headers(token: string, raw: boolean): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** repo 내 파일을 raw 텍스트로 가져온다 (Contents API). */
export async function fetchRawFile(repo: string, path: string, token: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: headers(token, true),
  });
  if (res.status === 401 || res.status === 403) throw new GhAuthError(res.status);
  if (res.status === 404) throw new GhNotFoundError(`${repo}/${path}`);
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${repo}/${path}`);
  return res.text();
}

/** PAT가 필요한 두 repo에 모두 접근 가능한지 검증한다. */
export async function validateToken(token: string): Promise<{ ok: boolean; message?: string }> {
  const checks = await Promise.all(
    [DRAFT_REPO, RUNS_REPO].map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: headers(token, false),
      });
      return { repo, status: res.status };
    }),
  );
  const failed = checks.filter((c) => c.status !== 200);
  if (failed.length === 0) return { ok: true };
  return {
    ok: false,
    message: `접근 실패: ${failed.map((f) => `${f.repo} (${f.status})`).join(", ")} — fine-grained PAT에 두 repo의 Contents read 권한이 있는지 확인하세요.`,
  };
}
