import Image from "next/image";
import { ownProjects } from "@/content/projects";

export default function ProjectsSection() {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-xl italic text-text-muted">
        Own projects
      </h2>
      <div className="mt-4 flex flex-col divide-y divide-border">
        {ownProjects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 py-4 first:pt-0"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-bg-elevated">
              <Image
                src={project.logo}
                alt=""
                width={16}
                height={16}
                className="object-contain"
              />
            </span>
            <span className="flex-1">
              <span className="text-sm font-semibold text-text group-hover:text-accent">
                {project.title}
              </span>
              <span className="block text-sm leading-relaxed text-text-muted">
                {project.desc}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
