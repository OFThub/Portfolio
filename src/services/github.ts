/**
 * Live repository metadata for the Projects section.
 *
 * This is the app's only untrusted-input boundary, so everything that crosses
 * it is narrowed here rather than at each call site: the response is reduced to
 * the fields the UI needs, and `homepage` — the one value that becomes an
 * href — is rejected unless it is http(s).
 */

const GITHUB_USERNAME = "OFThub";
const CACHE_KEY = "github_repos_cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;

export type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  html_url: string;
  homepage: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

type CacheEntry = { data: GitHubRepo[]; timestamp: number };

/** Only http(s) may ever reach an href — blocks javascript:/data: payloads. */
function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Narrow one API object to the shape the UI actually renders. */
function toRepo(raw: unknown): GitHubRepo | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const name = str(r.name);
  if (!name) return null;

  return {
    name,
    description: typeof r.description === "string" ? r.description : null,
    language: typeof r.language === "string" ? r.language : null,
    stargazers_count: num(r.stargazers_count),
    forks_count: num(r.forks_count),
    topics: Array.isArray(r.topics) ? r.topics.filter((t): t is string => typeof t === "string") : [],
    html_url: safeUrl(r.html_url) ?? `https://github.com/${GITHUB_USERNAME}`,
    homepage: safeUrl(r.homepage),
    updated_at: str(r.updated_at),
    fork: r.fork === true,
    archived: r.archived === true,
  };
}

function readCache(): GitHubRepo[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const entry = JSON.parse(cached) as CacheEntry;
    if (!Array.isArray(entry?.data) || typeof entry.timestamp !== "number") return null;
    if (Date.now() - entry.timestamp >= CACHE_TTL_MS) return null;
    // Re-narrow: localStorage is writable by anything sharing this origin.
    return entry.data.map(toRepo).filter((r): r is GitHubRepo => r !== null);
  } catch {
    return null; // malformed or unavailable — just re-fetch
  }
}

function writeCache(data: GitHubRepo[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() } satisfies CacheEntry));
  } catch {
    // Quota exceeded or storage disabled — caching is an optimisation, not a
    // requirement, so a failure here must not break the section.
  }
}

export async function fetchGitHubRepos(signal?: AbortSignal): Promise<GitHubRepo[]> {
  const cached = readCache();
  if (cached) return cached;

  // GitHub's unauthenticated API can hang; cap it and honour the caller's abort.
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" }, signal: timeout.signal },
    );

    if (!res.ok) {
      // 403 with no remaining quota is rate limiting, not an outage.
      const rateLimited = res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0";
      throw new Error(rateLimited ? "GitHub API rate limit reached" : `GitHub API error: ${res.status}`);
    }

    const body: unknown = await res.json();
    if (!Array.isArray(body)) throw new Error("GitHub API returned an unexpected payload");

    const repos = body.map(toRepo).filter((r): r is GitHubRepo => r !== null);
    writeCache(repos);
    return repos;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
