import Image from "next/image";
import { ownProjects } from "@/content/projects";

export default function ProjectsSection() {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl font-medium text-text">
        Own projects
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {ownProjects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-border bg-bg-elevated p-5 transition-colors hover:border-accent"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg">
              <Image
                src={project.logo}
                alt=""
                width={18}
                height={18}
                className="object-contain"
              />
            </span>
            <span className="mt-3 text-sm font-semibold text-text group-hover:text-accent">
              {project.title}
            </span>
            <span className="mt-1.5 text-sm leading-relaxed text-text-muted">
              {project.desc}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
