import { projects } from "@/content/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/project/ProjectCard";

export default function Projects() {
  return (
    <section id="work" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow="Work" title="Things I've built" />
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
