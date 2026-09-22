import path from "node:path";
import type { Writeup } from "../../src/types/writeup";
import { assertSafeSize } from "./security";
import { renderMarkdown } from "./render-markdown";

const TAG_RULES: Array<[string, RegExp]> = [
  ["Web", /\b(web|http|https|website|browser)\b/i],
  ["Authentication", /\b(auth|authentication|login|password|credential)\b/i],
  ["Linux", /\b(linux|ubuntu|debian|bash|sudo)\b/i],
  ["Windows", /\b(windows|powershell|wmi|active directory)\b/i],
  ["Forensics", /\b(forensic|artifact|memory|disk|wireshark|pcap)\b/i],
  ["OSINT", /\bosint\b/i],
  ["Cryptography", /\b(crypto|cipher|encoded|encoding|base64|hash)\b/i],
  ["Privilege escalation", /\b(privilege escalation|privesc|root flag)\b/i],
  ["Enumeration", /\b(enumerat|nmap|ffuf|gobuster|directory scan)\b/i],
  ["Exploitation", /\b(exploit|reverse shell|payload|metasploit)\b/i],
];

function cleanText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromPath(sourcePath: string) {
  const folder = path.posix.basename(path.posix.dirname(sourcePath));
  return folder.replace(/^(tryhackme|picoctf|hsm)-/i, "").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function findTitle(markdown: string, sourcePath: string) {
  const heading = markdown.match(/^#{1,2}\s+(.+)$/m)?.[1]?.replace(/[*_`]/g, "").trim();
  const firstLine = markdown.split(/\r?\n/).map((line) => line.trim()).find((line) => line && !line.startsWith("!") && line.length < 120);
  return (heading || firstLine || titleFromPath(sourcePath)).replace(/^TRYHACKME\s*[—:-]+\s*/i, "").replace(/^PICOCTF\s*[—:-]+\s*/i, "").trim();
}

function inferDifficulty(markdown: string) {
  const match = markdown.match(/\b(easy|medium|hard|insane)\s+(?:level\s+)?(?:room|challenge|machine)?\b/i);
  return match ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : undefined;
}

function inferDate(markdown: string) {
  const match = markdown.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+20\d{2}\b/i);
  if (!match) return undefined;
  const date = new Date(match[0]);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10);
}

export async function normalizeWriteup(sourcePath: string, markdown: string, owner: string, repo: string, branch: string): Promise<Writeup> {
  assertSafeSize(markdown, sourcePath);
  const segments = sourcePath.split("/");
  const platform = segments[1] || "CTF";
  const slug = path.posix.basename(path.posix.dirname(sourcePath)).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  const title = findTitle(markdown, sourcePath);
  const plain = cleanText(markdown).replace(title, "").trim();
  const tags = TAG_RULES.filter(([, rule]) => rule.test(markdown)).map(([tag]) => tag).slice(0, 5);
  const { html, headings, wordCount } = await renderMarkdown(markdown, sourcePath, owner, repo, branch);

  return {
    slug,
    title,
    platform: platform === "THM" ? "TryHackMe" : platform,
    category: platform,
    tags: tags.length ? tags : ["CTF"],
    difficulty: inferDifficulty(markdown),
    publishedAt: inferDate(markdown),
    excerpt: plain.slice(0, 220).replace(/\s+\S*$/, "").trim() + (plain.length > 220 ? "…" : ""),
    sourcePath,
    sourceUrl: `https://github.com/${owner}/${repo}/blob/${branch}/${sourcePath}`,
    rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${sourcePath}`,
    html,
    headings,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
  };
}
