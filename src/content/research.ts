import type { ResearchRecord } from "@/types/content";

export const researchRecords: ResearchRecord[] = [
  {
    target: "SSC.gov.in",
    category: "JWT / Authentication",
    summary:
      "Exposed client-side JWT secrets enabling JWT minting, authentication bypass, and administrative-panel access.",
    status: "Responsibly disclosed",
  },
  {
    target: "URISE — Uttar Pradesh",
    category: "SQL injection",
    summary:
      "SQL injection identified with potential access to a database containing 1.8M+ PII records.",
    status: "Responsibly disclosed",
  },
  {
    target: "MyClassBoard ERP",
    category: "OAuth / Account takeover",
    summary:
      "Missing OAuth security controls identified that could enable administrative account takeover.",
    status: "Responsibly disclosed",
  },
  {
    target: "Entab CampusCare ERP",
    category: "Hardcoded API credentials",
    summary:
      "Leaked hardcoded API credentials and secrets identified, with potential for unauthorized school-website access.",
    status: "Responsibly disclosed",
  },
  {
    target: "ABP News",
    category: "Exposed data & credentials",
    summary:
      "Identified remnants associated with an apparent compromise involving 400K+ records and exposed credentials.",
    status: "Security research",
  },
  {
    target: "sports.yas.gov.in",
    category: "Directory listing / PII exposure",
    summary:
      "Public directory listing identified containing sensitive documents with Aadhaar numbers and driving-licence information.",
    status: "Responsibly disclosed",
  },
  {
    target: "OLA Krutrim",
    category: "Unauthenticated SSRF",
    summary:
      "Reported an unauthenticated SSRF via the OAuth CIMD client_id flow, allowing a server-side request to an attacker-controlled URL.",
    status: "Responsibly disclosed",
  },
  {
    target: "CoRover.ai",
    category: "Cloud storage exposure",
    summary:
      "Reported anonymous access to cloud storage containing large collections of audio, video, documents, and bot assets.",
    status: "Responsibly disclosed",
  },
  {
    target: "Skit.ai",
    category: "Unauthenticated LLM / API access",
    summary:
      "Reported unauthenticated ACP Sandbox access capable of returning paid Anthropic inference, creating potential API cost exposure.",
    status: "Responsibly disclosed",
  },
  {
    target: "Haptik",
    category: "File write → RCE",
    summary:
      "Reported an unauthenticated arbitrary file-write vulnerability in Jfrog Artifactory OSS 4.5.1 / Tomcat that could lead to remote code execution.",
    status: "Responsibly disclosed",
  },
  {
    target: "BSI.gov.in",
    category: "Reflected XSS",
    summary:
      "Reported a reflected cross-site scripting vulnerability through responsible disclosure.",
    status: "Responsibly disclosed",
  },
];
