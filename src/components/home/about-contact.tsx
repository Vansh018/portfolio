import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/layout/section-heading";
import { profile, socialLinks } from "@/content/profile";

export function AboutContact() {
  return (
    <>
      <section className="section-block" id="about" aria-labelledby="about-title">
        <SectionHeading id="about-title" index="05" eyebrow="Background & ethics" title="About me" />
        <div className="about-grid">
          <div className="about-copy"><p>{profile.about}</p><p>My research spans government and private-sector applications, with a focus on understanding the root cause, validating only what is necessary, and reporting findings through responsible channels.</p><Link className="about-link" href="/resume/">View resume <ArrowRight /></Link></div>
          <div className="profile-records">
            <article><span>Certification</span><h3>eJPT v2</h3><p>eLearnSecurity Junior Penetration Tester</p><a href={profile.certificationUrl} target="_blank" rel="noreferrer">Verify certificate <ArrowUpRight /></a></article>
          </div>
        </div>
        <aside className="disclosure-note" aria-labelledby="disclosure-title"><span aria-hidden="true">{"//"}</span><div><p>Responsible disclosure</p><h3 id="disclosure-title">Validate the issue. Minimize access. Protect the people behind the data.</h3></div><ul className="disclosure-points">{profile.disclosurePoints.map((point) => <li key={point}>{point}</li>)}</ul></aside>
      </section>
      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-index">06 / Contact</div>
        <div><p>For security research, collaboration, or responsible disclosure conversations.</p><h2 id="contact-title">Let’s discuss</h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight /></a></div>
        <div className="contact-profiles">{socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><span>{link.handle}</span><ArrowUpRight /></a>)}</div>
      </section>
    </>
  );
}
