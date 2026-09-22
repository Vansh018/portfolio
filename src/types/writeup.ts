export type WriteupHeading = {
  depth: number;
  id: string;
  text: string;
};

export type Writeup = {
  slug: string;
  title: string;
  platform: string;
  category: string;
  tags: string[];
  difficulty?: string;
  publishedAt?: string;
  excerpt: string;
  sourcePath: string;
  sourceUrl: string;
  rawUrl: string;
  html: string;
  headings: WriteupHeading[];
  readingMinutes: number;
};

export type WriteupArchive = {
  repository: string;
  branch: string;
  commitSha: string;
  syncedAt: string;
  writeups: Writeup[];
};
