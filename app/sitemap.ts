import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/docs";

const SITE_URL = "https://slateui.elias4044.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const docSlugs = getAllSlugs();

  const docRoutes = docSlugs.map((slug) => ({
    url: `${SITE_URL}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: slug === "installation" ? 0.9 : 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docRoutes,
  ];
}
