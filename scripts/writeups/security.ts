import path from "node:path";

export const MAX_FILES = 150;
export const MAX_FILE_BYTES = 250_000;

export function validateRepositoryPath(value: string) {
  const normalized = value.replaceAll("\\", "/");
  if (!normalized.startsWith("writeups/") || normalized.includes("../") || path.posix.isAbsolute(normalized)) {
    throw new Error(`Unsafe repository path: ${value}`);
  }
  if (!normalized.toLowerCase().endsWith(".md")) {
    throw new Error(`Unsupported writeup type: ${value}`);
  }
  return normalized;
}

export function assertSafeSize(content: string, sourcePath: string) {
  const size = Buffer.byteLength(content, "utf8");
  if (size > MAX_FILE_BYTES) throw new Error(`Writeup exceeds ${MAX_FILE_BYTES} bytes: ${sourcePath}`);
}

export function safeAssetUrl(url: string, sourcePath: string, owner: string, repo: string, branch: string) {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = new URL(trimmed);
    const allowedHosts = new Set(["raw.githubusercontent.com", "github.com", "user-images.githubusercontent.com", "camo.githubusercontent.com", "cdn-images-1.medium.com"]);
    return allowedHosts.has(parsed.hostname) ? parsed.toString() : "";
  }
  if (/^(data|javascript|vbscript|file):/i.test(trimmed) || trimmed.startsWith("//")) return "";
  const parent = path.posix.dirname(sourcePath);
  const resolved = path.posix.normalize(path.posix.join(parent, trimmed));
  if (!resolved.startsWith("writeups/") || resolved.includes("../")) return "";
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolved}`;
}
