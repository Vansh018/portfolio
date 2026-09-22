export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type Credential = {
  label: string;
  value: string;
  detail: string;
  href?: string;
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type ResearchRecord = {
  target: string;
  category: string;
  summary: string;
  status: "Responsibly disclosed" | "Security research";
};

export type CtfRecord = {
  kind: "CTF" | "Platform";
  event: string;
  result: string;
  detail: string;
  href?: string;
};
