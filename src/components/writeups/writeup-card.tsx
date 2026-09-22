import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import type { Writeup } from "@/types/writeup";

export function WriteupCard({ writeup, index }: { writeup: Writeup; index: number }) {
  return <article className="writeup-card"><div className="writeup-card-index">A-{String(index + 1).padStart(2, "0")}</div><div className="writeup-card-body"><div className="writeup-card-meta"><span>{writeup.platform}</span>{writeup.difficulty ? <span>{writeup.difficulty}</span> : null}{writeup.publishedAt ? <time dateTime={writeup.publishedAt}>{new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(`${writeup.publishedAt}T00:00:00`))}</time> : null}<span>{writeup.readingMinutes} min</span></div><h3><Link href={`/writeups/${writeup.slug}/`}>{writeup.title}</Link></h3><p>{writeup.excerpt}</p><ul aria-label="Techniques">{writeup.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="writeup-card-actions"><Link href={`/writeups/${writeup.slug}/`}>Read writeup <ArrowRight /></Link><a href={writeup.sourceUrl} target="_blank" rel="noreferrer">GitHub source <ArrowUpRight /></a></div></div></article>;
}
