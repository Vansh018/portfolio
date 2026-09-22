import { describe, expect, it } from "vitest";
import { safeAssetUrl, validateRepositoryPath } from "./security";

const sourcePath = "writeups/THM/tryhackme-test/README.md";
const resolve = (url: string) => safeAssetUrl(url, sourcePath, "Vansh018", "Writeups", "main");

describe("repository path validation", () => {
  it("accepts valid markdown paths", () => {
    expect(validateRepositoryPath("writeups/THM/x/README.md")).toBe("writeups/THM/x/README.md");
    expect(validateRepositoryPath("writeups\\THM\\x\\README.md")).toBe("writeups/THM/x/README.md");
  });

  it.each([
    ["parent traversal", "writeups/../../etc/passwd.md"],
    ["nested traversal", "writeups/THM/../../../secret.md"],
    ["outside writeups", "README.md"],
    ["absolute path", "/writeups/x.md"],
    ["mdx", "writeups/THM/x/page.mdx"],
    ["no extension", "writeups/THM/x/README"],
    ["option injection", "--upload-pack=touch /tmp/pwned.md"],
  ])("rejects %s", (_name, value) => {
    expect(() => validateRepositoryPath(value)).toThrow();
  });

  it("treats shell metacharacters as inert filename characters", () => {
    // The local date resolver runs `git` via execFile with an argument array, so
    // no shell is involved and metacharacters are never interpreted. The path
    // stays confined to the writeups/ tree either way.
    const value = validateRepositoryPath("writeups/THM/x/$(whoami).md");
    expect(value.startsWith("writeups/")).toBe(true);
    expect(value).not.toContain("../");
  });
});

describe("asset url allowlist", () => {
  it.each([
    ["hostname suffix spoof", "https://raw.githubusercontent.com.evil.example/x.png"],
    ["userinfo spoof", "https://raw.githubusercontent.com@evil.example/x.png"],
    ["protocol relative", "//evil.example/x.png"],
    ["javascript", "javascript:alert(1)"],
    ["vbscript", "vbscript:msgbox(1)"],
    ["data uri", "data:image/png;base64,iVBORw0KGgo="],
    ["file scheme", "file:///etc/passwd"],
    ["unlisted host", "https://evil.example/x.png"],
  ])("blocks %s", (_name, url) => {
    expect(resolve(url)).toBe("");
  });

  it("allows the writeup repository raw host", () => {
    expect(resolve("https://raw.githubusercontent.com/Vansh018/Writeups/main/writeups/THM/tryhackme-test/shot.png")).toContain("raw.githubusercontent.com/Vansh018/Writeups");
  });

  it("rewrites relative paths inside the repository", () => {
    expect(resolve("./images/shot.png")).toBe("https://raw.githubusercontent.com/Vansh018/Writeups/main/writeups/THM/tryhackme-test/images/shot.png");
  });

  it.each([
    ["parent traversal", "../../../../etc/passwd"],
    ["backslash traversal", "..\\..\\..\\windows\\win.ini"],
  ])("keeps %s inside the repository root", (_name, url) => {
    const resolved = resolve(url);
    expect(resolved === "" || resolved.includes("/Writeups/main/writeups/")).toBe(true);
  });
});
