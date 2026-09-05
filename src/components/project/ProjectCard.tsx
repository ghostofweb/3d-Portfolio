import Image from "next/image";
import { Project } from "@/types/project";
import Pill from "@/components/ui/Pill";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-bg-elevated p-6 transition-colors hover:border-accent-cyan/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg">
          <Image
            src={project.logo}
            alt={`${project.title} logo`}
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <h3 className="font-mono text-base font-medium text-text group-hover:text-accent-cyan">
          {project.title}
        </h3>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-muted">
        {project.desc}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted/80">
        {project.subdesc}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Pill key={tag.id} name={tag.name} icon={tag.path} />
        ))}
      </div>

      <span className="mt-5 text-sm font-medium text-accent-cyan opacity-0 transition-opacity group-hover:opacity-100">
        Visit project →
      </span>
    </a>
  );
}
