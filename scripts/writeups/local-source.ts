import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { MAX_FILES, validateRepositoryPath } from "./security";
import type { SourceResult } from "./github-source";

async function walk(directory: string, root: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    if (entry.isSymbolicLink()) return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute, root);
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".md")) return [];
    return [path.relative(root, absolute).replaceAll("\\", "/")];
  }));
  return paths.flat();
}

export async function readLocalSource(root: string): Promise<SourceResult> {
  const paths = (await walk(path.join(root, "writeups"), root)).map(validateRepositoryPath);
  if (paths.length > MAX_FILES) throw new Error(`Local repository contains more than ${MAX_FILES} Markdown files`);
  const documents = await Promise.all(paths.map(async (sourcePath) => ({ path: sourcePath, content: await readFile(path.join(root, ...sourcePath.split("/")), "utf8") })));
  return { commitSha: "local", documents };
}
