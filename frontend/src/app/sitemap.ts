import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { ownProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;

  const projectRoutes: MetadataRoute.Sitemap = ownProjects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...projectRoutes,
  ];
}
