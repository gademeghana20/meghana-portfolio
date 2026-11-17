import type { MetadataRoute } from "next";
import { getPortfolioContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Lists the home page and every published project page.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getPortfolioContent();
  return [
    { url: siteUrl, priority: 1 },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      priority: 0.7,
    })),
  ];
}
