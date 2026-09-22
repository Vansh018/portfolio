import { ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/layout/section-heading";
import { ctfRecords, featuredCtf } from "@/content/ctfs";

export function CtfTrackRecord() {
  return (
    <section className="section-block" id="ctfs" aria-labelledby="ctf-title">
      <SectionHeading id="ctf-title" index="03" eyebrow="Practical track record" title="CTFs" />
      <div className="ctf-layout">
        <article className="ctf-feature">
          <div className="ctf-meta"><span>{featuredCtf.meta}</span><span>{featuredCtf.badge}</span></div>
          <h3>{featuredCtf.event}</h3>
          <div className="placement"><strong>{featuredCtf.placement}</strong><span>{featuredCtf.caption}</span></div>
          <p>{featuredCtf.note}</p>
        </article>
        <div className="lab-records">
          {ctfRecords.map((record, index) => (
            <article key={record.event}>
              <span>{String(index + 1).padStart(2, "0")} / {record.kind}</span>
              <h3>{record.event}</h3>
              <strong>{record.result}</strong>
              <p>{record.detail}</p>
              {record.href ? <a href={record.href} target="_blank" rel="noreferrer">Open profile <ArrowUpRight /></a> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
