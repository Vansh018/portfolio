import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { SKIP, visit } from "unist-util-visit";
import type { Element, Root, Text } from "hast";
import type { WriteupHeading } from "../../src/types/writeup";
import { safeAssetUrl } from "./security";

function textContent(node: Element): string {
  return node.children.map((child) => child.type === "text" ? (child as Text).value : child.type === "element" ? textContent(child as Element) : "").join("");
}

function redactSensitiveValues(markdown: string) {
  return markdown
    .replace(/\b(?:THM|picoCTF|flag)\{[^}\r\n]{3,}\}/gi, "[REDACTED FLAG]")
    .replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, "[REDACTED JWT]")
    .replace(/([?&](?:sig|token|key|secret)=)[^\s&\"'<>]+/gi, "$1[REDACTED]");
}

export async function renderMarkdown(markdown: string, sourcePath: string, owner: string, repo: string, branch: string) {
  const safeMarkdown = redactSensitiveValues(markdown);
  const headings: WriteupHeading[] = [];
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(() => (tree: Root) => {
      visit(tree, "element", (node: Element, index, parent) => {
        if (/^h[2-3]$/.test(node.tagName)) {
          const text = textContent(node).trim();
          const id = typeof node.properties?.id === "string" ? node.properties.id : "";
          if (text && id) headings.push({ depth: Number(node.tagName[1]), id: `user-content-${id}`, text });
        }
        if (node.tagName === "img") {
          const source = typeof node.properties?.src === "string" ? node.properties.src : "";
          const resolved = safeAssetUrl(source, sourcePath, owner, repo, branch);
          if (!resolved) {
            // Drop blocked images rather than emitting an empty src, which would
            // make the browser re-request the current page.
            if (parent && typeof index === "number") {
              parent.children.splice(index, 1);
              return [SKIP, index];
            }
            return;
          }
          node.properties.src = resolved;
          node.properties.loading = "lazy";
          node.properties.decoding = "async";
          node.properties.referrerPolicy = "no-referrer";
          if (typeof node.properties.alt !== "string") node.properties.alt = "";
        }
        if (node.tagName === "a") {
          const href = typeof node.properties?.href === "string" ? node.properties.href : "";
          if (/^https?:\/\//i.test(href)) {
            node.properties.target = "_blank";
            node.properties.rel = ["noreferrer", "noopener"];
          }
        }
      });
    })
    .use(rehypeHighlight, { detect: false })
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        "*": [...(defaultSchema.attributes?.["*"] || []), "id"],
        a: [...(defaultSchema.attributes?.a || []), "target", "rel"],
        img: [...(defaultSchema.attributes?.img || []), "loading", "decoding", "referrerPolicy"],
        code: [["className", /^hljs$/, /^hljs-[a-z_]+$/, /^language-[a-z0-9-]+$/]],
        span: [["className", /^hljs-[a-z_]+$/]],
      },
      protocols: { ...defaultSchema.protocols, src: ["http", "https"], href: ["http", "https", "mailto"] },
    })
    .use(rehypeStringify);

  const result = await processor.process(safeMarkdown);
  const wordCount = safeMarkdown.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return { html: String(result), headings, wordCount };
}
