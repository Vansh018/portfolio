"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { useActiveSection } from "@/hooks/use-active-section";

const items = [
  ["research", "Research"],
  ["writeups", "Writeups"],
  ["ctfs", "CTFs"],
  ["skills", "Skills"],
  ["about", "About"],
  ["contact", "Contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const sectionIds = useMemo(() => items.map(([id]) => id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label="Vansh Marwaha, home">
          <span aria-hidden="true">VM</span>
          <span>Researcher</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {items.map(([id, label]) => (
            <Link key={id} href={`/#${id}`} aria-current={activeSection === id ? "location" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {items.map(([id, label], index) => (
          <Link key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
