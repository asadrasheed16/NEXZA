import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { founders } from "@/data/founders";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/founders`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...founders.map((f) => ({
      url: `${site.url}/founders/${f.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
