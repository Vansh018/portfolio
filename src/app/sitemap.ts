import type { MetadataRoute } from "next";
import { getWriteups } from "@/lib/writeups";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vansh018.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/writeups/", "/resume/"].map((route) => ({ url: `${siteUrl}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 }));
  const writeupRoutes = getWriteups().map((writeup) => ({ url: `${siteUrl}/writeups/${writeup.slug}/`, lastModified: writeup.publishedAt ? new Date(`${writeup.publishedAt}T00:00:00Z`) : undefined, changeFrequency: "yearly" as const, priority: 0.7 }));
  return [...staticRoutes, ...writeupRoutes];
}
