import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { WriteupArticle } from "@/components/writeups/writeup-article";
import { getWriteup, getWriteups } from "@/lib/writeups";

export const dynamicParams = false;
export function generateStaticParams() { return getWriteups().map((writeup) => ({ slug: writeup.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const writeup = getWriteup(slug); if (!writeup) return {}; return { title: writeup.title, description: writeup.excerpt, openGraph: { title: writeup.title, description: writeup.excerpt, type: "article" } }; }

export default async function WriteupPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const writeup = getWriteup(slug); if (!writeup) notFound(); return <><SiteHeader /><main id="main-content" className="article-page shell"><WriteupArticle writeup={writeup} /></main></>; }
