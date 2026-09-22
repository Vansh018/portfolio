import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/layout/section-heading";
import { WriteupExplorer } from "@/components/writeups/writeup-explorer";
import { getArchive, getWriteups } from "@/lib/writeups";

export function WriteupPreview() {
  const archive = getArchive();
  return (
    <section className="section-block" id="writeups" aria-labelledby="writeups-title">
      <SectionHeading id="writeups-title" index="02" eyebrow="Technical archive" title="Field notes & writeups" description="A searchable archive pulled from GitHub and rebuilt whenever a new writeup is published." />
      <div className="preview-sync"><span>{getWriteups().length} artifacts indexed</span><span>Source commit {archive.commitSha.slice(0, 8)}</span><Link href="/writeups/">View complete archive <ArrowRight /></Link></div>
      <WriteupExplorer writeups={getWriteups()} compact />
    </section>
  );
}
