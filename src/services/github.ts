const GITHUB_USERNAME = "OFThub";
const CACHE_KEY = "github_repos_cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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

type CacheEntry = {
  data: GitHubRepo[];
  timestamp: number;
};

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const entry: CacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
        return entry.data;
      }
    }
  } catch {
    // Malformed cache — ignore and re-fetch
  }

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GitHubRepo[] = await res.json();

  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — skip caching
  }

  return data;
}
