import archiveData from "@/generated/writeups/archive.json";
import type { Writeup, WriteupArchive } from "@/types/writeup";

const archive = archiveData as WriteupArchive;

export function getArchive() { return archive; }
export function getWriteups() { return archive.writeups; }
export function getWriteup(slug: string): Writeup | undefined { return archive.writeups.find((writeup) => writeup.slug === slug); }
export function getPlatforms() { return [...new Set(archive.writeups.map((writeup) => writeup.platform))].sort(); }
export function getTags() { return [...new Set(archive.writeups.flatMap((writeup) => writeup.tags))].sort(); }
