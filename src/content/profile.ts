import type { Credential, SkillGroup, SocialLink } from "@/types/content";

export const profile = {
  name: "Vansh Marwaha",
  role: "Independent security researcher",
  focus: "Offensive security · Vulnerability research · CTFs",
  introduction:
    "I investigate real-world security failures, trace how they work, document the evidence, and disclose vulnerabilities responsibly.",
  about:
    "I am an independent security researcher with hands-on experience identifying and responsibly disclosing Critical and High severity vulnerabilities across government and private-sector applications. My focus areas include web application security, authentication and authorization, OAuth/JWT, SQL injection, SSRF, XSS, exposed secrets, PII exposure, cloud storage, LLM/API security, and enterprise/ERP security. I rank in the Top 1% on TryHackMe and hold the eJPT v2 certification, with a public portfolio of technical writeups.",
  email: "lightningfst8@gmail.com",
  disclosurePoints: [
    "I have reported vulnerabilities affecting approximately 6 government websites and 3 private-sector applications through responsible disclosure to CERT-In and affected organizations.",
    "My hands-on experience covers authentication bypasses, authorization issues, exposed credentials and secrets, PII exposure, SQL injection, SSRF, XSS, cloud-storage exposure, LLM/API security, and enterprise applications.",
    "I keep validation to the minimum necessary to confirm a finding and demonstrate impact; I do not intentionally download, save, exfiltrate, share, modify, or delete exposed data.",
    "My technical writeups document discovery, validation, impact, and remediation context.",
  ],
  certificationUrl:
    "https://certs.ine.com/5216f2f1-9e51-40ed-aff8-6ff9f523c510",
} as const;

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Vansh018/Writeups",
    handle: "Vansh018/Writeups",
  },
  {
    label: "TryHackMe",
    href: "https://tryhackme.com/p/lightningf8st14",
    handle: "lightningf8st14",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vansh-marwaha-5795a92b7/",
    handle: "vansh-marwaha",
  },
];

export const credentials: Credential[] = [
  {
    label: "TryHackMe",
    value: "Top 1%",
    detail: "Practical security labs",
    href: "https://tryhackme.com/p/lightningf8st14",
  },
  {
    label: "eJPT v2",
    value: "Certified",
    detail: "INE Security",
    href: profile.certificationUrl,
  },
  {
    label: "LUN4R 2026",
    value: "2nd place",
    detail: "Highest scorer on team",
  },
  {
    label: "PWN SEC 2026",
    value: "6th place",
    detail: "Highest scorer on team",
  },
  {
    label: "z0d1ak CTF",
    value: "75th / 1,200+",
    detail: "VIT Vellore · top scorer on team",
  },
  {
    label: "Research",
    value: "Critical / High",
    detail: "Real-world findings",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Web & application security",
    skills: [
      "Web application security",
      "Authentication",
      "Authorization",
      "OAuth",
      "JWT",
      "SQL injection",
      "SSRF",
      "XSS",
      "PII exposure",
      "Cloud storage security",
    ],
  },
  {
    title: "Offensive security",
    skills: [
      "Reconnaissance",
      "Enumeration",
      "Exploitation",
      "Penetration testing",
      "OSINT",
      "CTFs",
      "Vulnerability research",
      "Responsible disclosure",
    ],
  },
  {
    title: "Tools",
    skills: [
      "Burp Suite",
      "Nmap",
      "ffuf",
      "Metasploit",
      "Wireshark",
      "Kali Linux",
      "curl",
      "nc",
      "apktool",
      "Impacket",
      "smbclient",
    ],
  },
  {
    title: "Platforms & areas",
    skills: [
      "Linux",
      "Windows",
      "Enterprise / ERP applications",
      "APIs",
      "LLM / API security",
      "Azure / GCS storage",
      "Tomcat",
      "Jfrog Artifactory",
    ],
  },
];
