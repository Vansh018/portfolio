import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WriteupArchive } from "../src/types/writeup";
import { createGitHubDateResolver, createLocalDateResolver, type DateResolver } from "./writeups/commit-dates";
import { readGitHubSource } from "./writeups/github-source";
import { readLocalSource } from "./writeups/local-source";
import { normalizeWriteup } from "./writeups/normalize";

const owner = process.env.WRITEUPS_OWNER || "Vansh018";
const repo = process.env.WRITEUPS_REPO || "Writeups";
const branch = process.env.WRITEUPS_BRANCH || "main";
const localPath = process.env.WRITEUPS_LOCAL_PATH?.trim();
const outputDirectory = path.resolve("src/generated/writeups");
const archivePath = path.join(outputDirectory, "archive.json");
const dateCachePath = path.join(outputDirectory, "commit-dates.json");

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function loadToken() {
  if (process.env.GITHUB_TOKEN) return;
  try {
    const contents = await readFile(path.resolve(".env.local"), "utf8");
    const match = contents.match(/^\s*GITHUB_TOKEN\s*=\s*(.+)$/m);
    if (match) process.env.GITHUB_TOKEN = match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    // .env.local is optional.
  }
}

async function readDateCache() {
  try {
    return JSON.parse(await readFile(dateCachePath, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

async function writeArchive(archive: WriteupArchive) {
  archive.writeups.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "") || a.title.localeCompare(b.title));
  const duplicate = archive.writeups.find((writeup, index) => archive.writeups.findIndex((candidate) => candidate.slug === writeup.slug) !== index);
  if (duplicate) throw new Error(`Duplicate writeup slug: ${duplicate.slug}`);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(archivePath, `${JSON.stringify(archive, null, 2)}\n`, "utf8");
}

async function backfillDates(writeups: WriteupArchive["writeups"], resolve: DateResolver) {
  const undated = writeups.filter((writeup) => !writeup.publishedAt);
  if (!undated.length) return;

  const cache = await readDateCache();
  let cached = 0;
  let fetched = 0;

  for (const writeup of undated) {
    const known = cache[writeup.sourcePath];
    if (known) {
      writeup.publishedAt = known;
      cached += 1;
      continue;
    }
    const date = await resolve(writeup.sourcePath);
    if (date) {
      writeup.publishedAt = date;
      cache[writeup.sourcePath] = date;
      fetched += 1;
    }
  }

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(dateCachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");

  console.log(`Dated ${cached + fetched}/${undated.length} writeups (${cached} cached, ${fetched} from repository history)`);
  const missing = undated.length - cached - fetched;
  if (missing) console.warn(`Warning: ${missing} writeups still have no date and will sort last`);
}

function isRateLimit(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /403|429|rate limit/i.test(message);
}

async function main() {
  await loadToken();

  if (process.env.SKIP_WRITEUP_SYNC === "1") {
    if (await exists(archivePath)) {
      console.log("Reusing generated writeup data (SKIP_WRITEUP_SYNC=1)");
      return;
    }
    console.warn("SKIP_WRITEUP_SYNC=1 but no generated data found; synchronizing anyway");
  }

  const resolveDate = localPath ? createLocalDateResolver(path.resolve(localPath)) : createGitHubDateResolver(owner, repo, branch);

  let source;
  try {
    source = localPath ? await readLocalSource(path.resolve(localPath)) : await readGitHubSource(owner, repo, branch);
  } catch (error) {
    if (!isRateLimit(error) || !(await exists(archivePath))) throw error;
    console.warn("GitHub rate limit reached; reusing the existing archive. Set GITHUB_TOKEN in .env.local to raise the limit.");
    const archive = JSON.parse(await readFile(archivePath, "utf8")) as WriteupArchive;
    await backfillDates(archive.writeups, resolveDate);
    await writeArchive(archive);
    return;
  }

  const writeups = await Promise.all(source.documents.map((document) => normalizeWriteup(document.path, document.content, owner, repo, branch)));
  const archive: WriteupArchive = {
    repository: `${owner}/${repo}`,
    branch,
    commitSha: source.commitSha,
    syncedAt: new Date().toISOString(),
    writeups,
  };

  await backfillDates(archive.writeups, resolveDate);
  await writeArchive(archive);
  console.log(`Synchronized ${archive.writeups.length} writeups from ${archive.repository}@${archive.commitSha.slice(0, 8)}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
