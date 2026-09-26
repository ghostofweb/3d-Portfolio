import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ownProjects } from "@/content/projects";
import ImageLightbox from "@/components/common/ImageLightbox";

export function generateStaticParams() {
  return ownProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = ownProjects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.desc,
    openGraph: {
      title: project.title,
      description: project.desc,
      type: "website",
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = ownProjects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-20">
      <Link
        href="/#projects"
        className="text-sm text-text-muted transition-colors hover:text-accent"
      >
        ← Back to projects
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated">
            <Image
              src={project.logo}
              alt=""
              width={20}
              height={20}
              className="object-contain"
            />
          </span>
          <h1 className="font-serif text-2xl font-semibold text-text sm:text-3xl">
            {project.title}
          </h1>
        </div>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-text">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent px-3.5 py-1.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Visit live site
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {project.video && (
          <video
            controls
            preload="metadata"
            poster={project.video.poster}
            className="mt-10 w-full rounded-xl border border-border shadow-sm"
          >
            <source src={project.video.src} type="video/mp4" />
          </video>
        )}

        {project.shots.length > 0 && (
          <ImageLightbox>
            <div className="mt-10 flex flex-col gap-8">
              {project.shots.map((shot) => (
                <figure key={shot.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt={shot.caption ?? ""}
                    loading="lazy"
                    className="w-full cursor-zoom-in rounded-xl border border-border object-cover shadow-sm"
                  />
                  {shot.caption && (
                    <figcaption className="mt-2 text-sm text-text-muted">
                      {shot.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </ImageLightbox>
        )}
      </article>
    </div>
  );
}
