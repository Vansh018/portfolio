import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./render-markdown";

const sourcePath = "writeups/THM/tryhackme-test/README.md";
const render = async (markdown: string) => (await renderMarkdown(markdown, sourcePath, "Vansh018", "Writeups", "main")).html;

const FORBIDDEN_TAGS = ["<script", "<iframe", "<object", "<embed", "<style", "<form", "<base", "<link", "<meta", "<svg", "<math"];
const FORBIDDEN_SCHEMES = ["javascript:", "vbscript:", "data:text/html", "data:image/svg"];

describe("writeup sanitizer: script execution", () => {
  const payloads: Array<[string, string]> = [
    ["raw script tag", "<script>alert(1)</script>"],
    ["img onerror", '<img src=x onerror="alert(1)">'],
    ["svg onload", "<svg onload=alert(1)></svg>"],
    ["iframe", '<iframe src="https://evil.example"></iframe>'],
    ["body onload", '<body onload="alert(1)">'],
    ["input autofocus onfocus", '<input autofocus onfocus="alert(1)">'],
    ["details ontoggle", "<details open ontoggle=alert(1)>"],
    ["javascript link", "[click](javascript:alert(1))"],
    ["mixed case javascript link", "[click](JaVaScRiPt:alert(1))"],
    ["entity encoded javascript link", "[click](java&#115;cript:alert(1))"],
    ["vbscript link", "[click](vbscript:msgbox(1))"],
    ["data html link", "[click](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)"],
    ["svg data image", "![x](data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+)"],
    ["mXSS namespace confusion", '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=1 onerror=alert(1)>">'],
    ["nested script in code fence escape", "```\n</code></pre><script>alert(1)</script>\n```"],
    ["clobbering via heading id", "# <img src=x onerror=alert(1)>"],
    ["noscript", "<noscript><p title=\"</noscript><img src=x onerror=alert(1)>\">"],
  ];

  it.each(payloads)("neutralizes %s", async (_name, payload) => {
    const html = await render(payload);
    for (const tag of FORBIDDEN_TAGS) expect(html.toLowerCase()).not.toContain(tag);
    for (const scheme of FORBIDDEN_SCHEMES) expect(html.toLowerCase()).not.toContain(scheme);
    expect(html).not.toMatch(/\son[a-z]+\s*=/i);
  });
});

describe("writeup sanitizer: url handling", () => {
  it("blocks images from hosts outside the allowlist", async () => {
    const html = await render("![tracker](https://evil.example/pixel.png)");
    expect(html).not.toContain("evil.example");
  });

  it("blocks protocol-relative image sources", async () => {
    const html = await render("![tracker](//evil.example/pixel.png)");
    expect(html).not.toContain("evil.example");
  });

  it("blocks path traversal in image sources", async () => {
    const html = await render("![x](../../../../etc/passwd)");
    expect(html).not.toContain("/etc/passwd");
  });

  it("allows allowlisted remote images", async () => {
    const html = await render("![shot](https://raw.githubusercontent.com/Vansh018/Writeups/main/writeups/THM/tryhackme-test/shot.png)");
    expect(html).toContain("raw.githubusercontent.com");
  });

  it("resolves repository-relative images to raw.githubusercontent.com", async () => {
    const html = await render("![shot](./images/shot.png)");
    expect(html).toContain("https://raw.githubusercontent.com/Vansh018/Writeups/main/writeups/THM/tryhackme-test/images/shot.png");
  });

  it("hardens external links opened in a new tab", async () => {
    const html = await render("[docs](https://example.com/page)");
    expect(html).toContain('rel="noreferrer noopener"');
    expect(html).toContain('target="_blank"');
  });
});

describe("writeup sanitizer: secret redaction", () => {
  it("redacts flag-shaped strings", async () => {
    const html = await render("flag is THM{abc123def456}");
    expect(html).not.toContain("abc123def456");
    expect(html).toContain("[REDACTED FLAG]");
  });

  it("redacts JWT-shaped strings", async () => {
    const html = await render("token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVPmB92K27uhbUJU1p1r_wW1gFWFOEjXk");
    expect(html).not.toContain("dBjftJeZ4CVP");
  });

  it("redacts signed url parameters", async () => {
    const html = await render("https://blob.example/x?sv=2022-11-02&sig=ZAo05W8KXdSLM9afYCNGogNRV2N5a6aB");
    expect(html).not.toContain("ZAo05W8KXdSLM9afYCNGogNRV2N5a6aB");
  });
});

describe("writeup sanitizer: legitimate content survives", () => {
  it("keeps headings, ids, and tables of contents anchors", async () => {
    const { html, headings } = await renderMarkdown("## Recon\n\n### Nmap scan\n", sourcePath, "Vansh018", "Writeups", "main");
    expect(html).toContain("user-content-recon");
    expect(headings.map((heading) => heading.text)).toEqual(["Recon", "Nmap scan"]);
  });

  it("keeps highlighted code blocks", async () => {
    const html = await render("```bash\nnmap -sV target\n```");
    expect(html).toContain("hljs");
    expect(html).toContain("nmap");
  });

  it("keeps tables", async () => {
    const html = await render("| a | b |\n| - | - |\n| 1 | 2 |");
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
  });
});
