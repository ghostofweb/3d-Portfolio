import { experiences } from "@/content/experience";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow="Experience" title="Where I've worked" />
      <div className="flex flex-col gap-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-border bg-bg-elevated p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-mono text-base font-medium text-text">
                {exp.pos} · {exp.name}
              </h3>
              <span className="font-mono text-xs text-text-muted">
                {exp.duration}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {exp.summary}
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {exp.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-sm leading-relaxed text-text-muted"
                >
                  <span className="text-accent-cyan">▸</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
