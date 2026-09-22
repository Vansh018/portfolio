import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { WriteupExplorer } from "@/components/writeups/writeup-explorer";
import { getArchive, getWriteups } from "@/lib/writeups";

export const metadata: Metadata = { title: "Writeup archive", description: "Searchable CTF and practical security writeups by Vansh Marwaha." };

export default function WriteupsPage() {
  const archive = getArchive();
  const writeups = getWriteups();
  return <><SiteHeader /><main id="main-content" className="archive-page"><header className="archive-hero shell"><div><p>Technical archive / {writeups.length} records</p><h1>Field notes,<br />not highlight reels.</h1></div><div><p>Practical challenge work, reconstructed step by step. The archive is generated from GitHub whenever its source repository changes.</p></div></header><section className="archive-shell shell" aria-labelledby="archive-title"><div className="archive-sync"><h2 id="archive-title">Artifact index</h2><p><span>Source</span>{archive.repository}</p><p><span>Commit</span><code>{archive.commitSha.slice(0, 8)}</code></p></div><WriteupExplorer writeups={writeups} /></section><div className="archive-back shell"><Link href="/">Return to research index <ArrowRight /></Link></div></main></>;
}
