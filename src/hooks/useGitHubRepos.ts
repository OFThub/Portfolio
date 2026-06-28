import { useEffect, useState } from "react";
import { fetchGitHubRepos, GitHubRepo } from "../services/github";

type HookState = {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
};

export function useGitHubRepos(): HookState {
  const [state, setState] = useState<HookState>({
    repos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setState({ repos, loading: false, error: null }))
      .catch((err) =>
        setState({ repos: [], loading: false, error: err.message })
      );
  }, []);

  return state;
}
