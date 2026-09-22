import type { CtfRecord } from "@/types/content";

export const featuredCtf = {
  event: "LUN4R 2026",
  meta: "CTF · 2026",
  badge: "Highest scorer on team",
  placement: "2",
  caption: "place",
  note: "Second-place finish, and I was the team’s highest scorer.",
} as const;

export const ctfRecords: CtfRecord[] = [
  {
    kind: "CTF",
    event: "PWN SEC 2026",
    result: "6th place",
    detail: "I was the team’s highest scorer.",
  },
  {
    kind: "CTF",
    event: "z0d1ak CTF",
    result: "75th / 1,200+",
    detail: "VIT Vellore · I was the team’s top scorer.",
  },
  {
    kind: "CTF",
    event: "TheFewChosen CTF 26",
    result: "172nd / 1,030",
    detail: "Team 404squad.",
  },
  {
    kind: "Platform",
    event: "TryHackMe",
    result: "Top 1%",
    detail: "I have extensive hands-on lab experience.",
    href: "https://tryhackme.com/p/lightningf8st14",
  },
];
