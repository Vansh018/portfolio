import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Vansh Marwaha · Security Research", short_name: "VM Research", description: "Independent security research and CTF writeups.", start_url: "/", display: "standalone", background_color: "#0b0c0d", theme_color: "#0b0c0d" };
}
