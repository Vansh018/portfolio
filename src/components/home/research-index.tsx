import { researchRecords } from "@/content/research";
import { SectionHeading } from "@/components/layout/section-heading";

export function ResearchIndex() {
  return (
    <section className="section-block" id="research" aria-labelledby="research-title">
      <SectionHeading id="research-title" index="01" eyebrow="Selected evidence" title="Security research" description="High-level records of validated findings. Sensitive evidence, credentials, payloads, and personal data are intentionally excluded." />
      <div className="research-list">
        {researchRecords.map((record, index) => (
          <article className="research-row reveal" key={record.target}>
            <span className="record-index">R-{String(index + 1).padStart(2, "0")}</span>
            <div className="record-target"><h3>{record.target}</h3><p>{record.category}</p></div>
            <p className="record-summary">{record.summary}</p>
            <span className="record-status"><i aria-hidden="true" />{record.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
