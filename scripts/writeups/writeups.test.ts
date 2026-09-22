import { describe, expect, it } from "vitest";
import { normalizeWriteup } from "./normalize";
import { renderMarkdown } from "./render-markdown";
import { safeAssetUrl, validateRepositoryPath } from "./security";

const sourcePath = "writeups/THM/tryhackme-test/README.md";

describe("writeup security", () => {
  it("rejects traversal and unsupported content", () => {
    expect(() => validateRepositoryPath("writeups/../secret.md")).toThrow();
    expect(() => validateRepositoryPath("writeups/THM/payload.mdx")).toThrow();
  });

  it("allows validated repository assets and rejects unsafe protocols", () => {
    expect(safeAssetUrl("image.png", sourcePath, "Vansh018", "Writeups", "main")).toContain("raw.githubusercontent.com/Vansh018/Writeups/main/writeups/THM/tryhackme-test/image.png");
    expect(safeAssetUrl("javascript:alert(1)", sourcePath, "Vansh018", "Writeups", "main")).toBe("");
  });

  it("removes raw HTML and redacts challenge secrets", async () => {
    const rendered = await renderMarkdown("# Test\n<script>alert(1)</script>\nTHM{real-secret}\n![x](javascript:alert(1))", sourcePath, "Vansh018", "Writeups", "main");
    expect(rendered.html).not.toContain("<script");
    expect(rendered.html).not.toContain("real-secret");
    expect(rendered.html).toContain("[REDACTED FLAG]");
  });
});

describe("writeup normalization", () => {
  it("derives conservative metadata from path and content", async () => {
    const writeup = await normalizeWriteup(sourcePath, "# TRYHACKME — Test Room\nThis is a hard room using nmap for web enumeration.", "Vansh018", "Writeups", "main");
    expect(writeup).toMatchObject({ slug: "tryhackme-test", title: "Test Room", platform: "TryHackMe", difficulty: "Hard" });
    expect(writeup.tags).toEqual(expect.arrayContaining(["Web", "Enumeration"]));
  });
});
