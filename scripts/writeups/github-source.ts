import { MAX_FILES, validateRepositoryPath } from "./security";

type GitTreeEntry = { path: string; type: "blob" | "tree"; size?: number };
type GitTreeResponse = { sha: string; truncated: boolean; tree: GitTreeEntry[] };

export type SourceDocument = { path: string; content: string };
export type SourceResult = { commitSha: string; documents: SourceDocument[] };

export async function readGitHubSource(owner: string, repo: string, branch: string): Promise<SourceResult> {
  const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers });
  if (!treeResponse.ok) throw new Error(`GitHub tree request failed: ${treeResponse.status} ${treeResponse.statusText}`);
  const tree = (await treeResponse.json()) as GitTreeResponse;
  if (tree.truncated) throw new Error("GitHub tree response was truncated");

  const paths = tree.tree
    .filter((entry) => entry.type === "blob" && entry.path.startsWith("writeups/") && entry.path.toLowerCase().endsWith(".md"))
    .map((entry) => validateRepositoryPath(entry.path));
  if (paths.length > MAX_FILES) throw new Error(`Repository contains more than ${MAX_FILES} Markdown files`);

  const documents = await Promise.all(paths.map(async (sourcePath) => {
    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${sourcePath}`);
    if (!response.ok) throw new Error(`Raw writeup request failed for ${sourcePath}: ${response.status}`);
    return { path: sourcePath, content: await response.text() };
  }));

  return { commitSha: tree.sha, documents };
}
