import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export type DateResolver = (sourcePath: string) => Promise<string | undefined>;

function toIsoDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : undefined;
}

export function createGitHubDateResolver(owner: string, repo: string, branch: string): DateResolver {
  return async (sourcePath) => {
    try {
      const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponent(sourcePath)}&per_page=1`,
        { headers },
      );
      if (!response.ok) return undefined;
      const commits = (await response.json()) as Array<{ commit?: { committer?: { date?: string } } }>;
      return toIsoDate(commits[0]?.commit?.committer?.date);
    } catch {
      return undefined;
    }
  };
}

export function createLocalDateResolver(root: string): DateResolver {
  return async (sourcePath) => {
    try {
      const { stdout } = await run("git", ["log", "-1", "--format=%cs", "--", sourcePath], { cwd: root });
      return toIsoDate(stdout.trim());
    } catch {
      return undefined;
    }
  };
}
