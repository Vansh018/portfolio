import { skillGroups } from "@/content/profile";
import { SectionHeading } from "@/components/layout/section-heading";

export function SkillsMatrix() {
  return (
    <section className="section-block" id="skills" aria-labelledby="skills-title">
      <SectionHeading id="skills-title" index="04" eyebrow="Capabilities" title="Security practice" />
      <div className="skills-grid">
        {skillGroups.map((group, groupIndex) => (
          <article key={group.title}>
            <header><span>0{groupIndex + 1}</span><h3>{group.title}</h3></header>
            <ul>{group.skills.map((skill) => <li key={skill}><span>{skill}</span><i aria-hidden="true" /></li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}
