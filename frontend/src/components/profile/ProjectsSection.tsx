import Link from "next/link";
import Image from "next/image";
import { ownProjects } from "@/content/projects";

export default function ProjectsSection() {
  return (
    <section id="projects" className="mt-16 scroll-mt-10">
      <h2 className="font-serif text-2xl font-semibold text-text">
        Own projects
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        {ownProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group flex gap-4 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md sm:gap-5 sm:p-5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt=""
              className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover sm:h-28 sm:w-28"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Image
                  src={project.logo}
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0 object-contain"
                />
                <h3 className="font-medium text-text group-hover:text-accent">
                  {project.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">{project.desc}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs text-text-muted"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
