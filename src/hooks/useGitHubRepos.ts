import { useEffect, useState } from "react";
import { fetchGitHubRepos, type GitHubRepo } from "../services/github";

type HookState = {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
};

/**
 * Repository metadata for the Projects section.
 *
 * The section renders fine with an empty list, so a failure here degrades to
 * "no live stars" rather than an error screen.
 */
export function useGitHubRepos(): HookState {
  const [state, setState] = useState<HookState>({ repos: [], loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    fetchGitHubRepos(controller.signal)
      .then((repos) => {
        if (!controller.signal.aborted) setState({ repos, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return; // unmounted or superseded
        setState({
          repos: [],
          loading: false,
          error: err instanceof Error ? err.message : "Could not load GitHub data",
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
