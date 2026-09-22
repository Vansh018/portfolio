"use client";

import { useMemo, useState } from "react";
import type { Writeup } from "@/types/writeup";
import { SelectMenu } from "./select-menu";
import { WriteupCard } from "./writeup-card";

export function WriteupExplorer({ writeups, compact = false }: { writeups: Writeup[]; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All platforms");
  const [sort, setSort] = useState("newest");
  const platforms = useMemo(() => [...new Set(writeups.map((item) => item.platform))].sort(), [writeups]);
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = writeups.filter((item) => (platform === "All platforms" || item.platform === platform) && (!needle || `${item.title} ${item.excerpt} ${item.tags.join(" ")}`.toLowerCase().includes(needle)));
    return [...filtered].sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : (b.publishedAt || "").localeCompare(a.publishedAt || "") || a.title.localeCompare(b.title));
  }, [platform, query, sort, writeups]);

  const visible = compact ? results.slice(0, 6) : results;
  const platformOptions = useMemo(() => [{ value: "All platforms", label: "All platforms" }, ...platforms.map((item) => ({ value: item, label: item }))], [platforms]);
  const sortOptions = useMemo(() => [{ value: "newest", label: "Newest inferred date" }, { value: "title", label: "Title A–Z" }], []);
  return <div className="writeup-explorer"><div className="explorer-controls"><label className="explorer-field search-control"><span className="field-label">Search archive</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, technique, keyword" /></label><div className="explorer-field"><SelectMenu label="Platform" value={platform} options={platformOptions} onChange={setPlatform} /></div><div className="explorer-field"><SelectMenu label="Sort" value={sort} options={sortOptions} onChange={setSort} /></div></div><div className="result-bar"><p role="status">{results.length} artifact{results.length === 1 ? "" : "s"} matched</p>{query || platform !== "All platforms" ? <button type="button" onClick={() => { setQuery(""); setPlatform("All platforms"); }}>Clear filters</button> : null}</div>{visible.length ? <div className="writeup-grid">{visible.map((writeup, index) => <WriteupCard key={writeup.slug} writeup={writeup} index={index} />)}</div> : <div className="empty-results"><span>0 / 00</span><h3>No artifacts match this query.</h3><p>Try a broader keyword or clear one of the filters.</p></div>}</div>;
}
