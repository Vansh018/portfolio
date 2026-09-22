import { AboutContact } from "@/components/home/about-contact";
import { CtfTrackRecord } from "@/components/home/ctf-track-record";
import { Hero } from "@/components/home/hero";
import { ResearchIndex } from "@/components/home/research-index";
import { SkillsMatrix } from "@/components/home/skills-matrix";
import { WriteupPreview } from "@/components/home/writeup-preview";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <div className="shell"><Hero /><ResearchIndex /><WriteupPreview /><CtfTrackRecord /><SkillsMatrix /><AboutContact /></div>
      </main>
      <footer className="site-footer"><div className="shell"><span>Vansh Marwaha</span></div></footer>
    </>
  );
}
