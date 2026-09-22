import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WriteupExplorer } from "./writeup-explorer";
import type { Writeup } from "@/types/writeup";

vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));

const base: Writeup = { slug: "alpha", title: "Alpha", platform: "TryHackMe", category: "THM", tags: ["Web"], excerpt: "Web challenge", sourcePath: "writeups/THM/alpha/README.md", sourceUrl: "https://github.com/source", rawUrl: "https://raw.githubusercontent.com/source", html: "<p>Alpha</p>", headings: [], readingMinutes: 2 };
const writeups = [base, { ...base, slug: "bravo", title: "Bravo", platform: "PicoCTF", category: "PicoCTF", tags: ["Cryptography"], excerpt: "Encoding challenge" }];

describe("WriteupExplorer", () => {
  it("filters by search and reports result counts", () => {
    render(<WriteupExplorer writeups={writeups} />);
    expect(screen.getByRole("status")).toHaveTextContent("2 artifacts matched");
    fireEvent.change(screen.getByLabelText("Search archive"), { target: { value: "encoding" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 artifact matched");
    expect(screen.getByRole("heading", { name: "Bravo" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Alpha" })).not.toBeInTheDocument();
  });

  it("shows a recoverable empty state", () => {
    render(<WriteupExplorer writeups={writeups} />);
    fireEvent.change(screen.getByLabelText("Search archive"), { target: { value: "no-match" } });
    expect(screen.getByText("No artifacts match this query.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 artifacts matched");
  });

  it("filters through the platform listbox", () => {
    render(<WriteupExplorer writeups={writeups} />);
    fireEvent.click(screen.getByRole("button", { name: "Platform All platforms" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "PicoCTF" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 artifact matched");
    expect(screen.getByRole("heading", { name: "Bravo" })).toBeInTheDocument();
  });

  it("supports keyboard navigation and escape", () => {
    render(<WriteupExplorer writeups={writeups} />);
    const trigger = screen.getByRole("button", { name: "Sort Newest inferred date" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveFocus();
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "Enter" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort Title A–Z" })).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("exposes only search, platform, and sort controls", () => {
    render(<WriteupExplorer writeups={writeups} />);
    expect(screen.queryAllByRole("listbox")).toHaveLength(0);
    expect(screen.getByLabelText("Search archive")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Platform All platforms" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort Newest inferred date" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Technique/ })).not.toBeInTheDocument();
  });
});
