import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { credentials, profile, socialLinks } from "@/content/profile";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-rail" aria-hidden="true">
        <span>Independent security researcher</span>
      </div>
      <div className="hero-main">
        <div className="availability"><span />Find. Verify. Disclose.</div>
        <h1 id="hero-title"><span>Vansh</span><span>Marwaha</span></h1>
        <div className="hero-statement">
          <p className="hero-role">{profile.role}<br /><span>{profile.focus}</span></p>
          <p className="hero-intro">{profile.introduction}</p>
        </div>
        <div className="hero-actions">
          <a className="primary-link" href="#research">View research <ArrowRight /></a>
          <Link className="text-link" href="/writeups/">Browse writeups <ArrowUpRight /></Link>
        </div>
      </div>
      <div className="credential-grid" aria-label="Selected credentials">
        {credentials.map((credential, index) => {
          const content = <><span className="credential-index">0{index + 1}</span><span className="credential-label">{credential.label}</span><strong>{credential.value}</strong><span className="credential-detail">{credential.detail}</span></>;
          return credential.href ? <a key={credential.label} href={credential.href} target="_blank" rel="noreferrer">{content}</a> : <div key={credential.label}>{content}</div>;
        })}
      </div>
      <div className="hero-links" aria-label="Public profiles">
        {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><ArrowUpRight /></a>)}
        <Link href="/resume/"><span>Resume</span><ArrowRight /></Link>
      </div>
    </section>
  );
}
