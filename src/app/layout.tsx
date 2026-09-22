import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "600"], display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vansh018.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Vansh Marwaha · Independent Security Researcher", template: "%s · Vansh Marwaha" },
  description: "Independent security researcher focused on offensive security, vulnerability research, web application security, and CTFs.",
  keywords: ["Vansh Marwaha", "security researcher", "offensive security", "vulnerability research", "CTF writeups", "web application security"],
  authors: [{ name: "Vansh Marwaha" }],
  creator: "Vansh Marwaha",
  openGraph: { type: "website", title: "Vansh Marwaha · Independent Security Researcher", description: "Security research, responsible disclosure, and practical CTF writeups.", siteName: "Vansh Marwaha" },
  twitter: { card: "summary_large_image", title: "Vansh Marwaha · Independent Security Researcher", description: "Security research, responsible disclosure, and practical CTF writeups." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0b0c0d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="object-src 'none'; base-uri 'self'" />
      </head>
      <body>{children}</body>
    </html>
  );
}
