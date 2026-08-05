import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { posts } from "@/lib/blog";
import { comparisons } from "@/lib/comparisons";

export default function sitemap(): MetadataRoute.Sitemap {
  const newestPost = posts[0]?.date ?? "2026-07-01";

  return [
    {
      url: site.url,
      lastModified: new Date("2026-07-18"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/blog`,
      lastModified: new Date(newestPost),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/vs`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...comparisons.map((c) => ({
      url: `${site.url}/vs/${c.slug}`,
      lastModified: new Date(c.updated),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
