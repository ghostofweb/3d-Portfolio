import { experiences } from "@/content/experience";

export default function ExperienceSection() {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl font-medium text-text">Experience</h2>
      <div className="mt-5 flex flex-col gap-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-border bg-bg-elevated p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-text">
                {exp.role} ·{" "}
                {exp.companyHref ? (
                  <a
                    href={exp.companyHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </p>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-muted">
                {exp.duration}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {exp.summary}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {exp.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-sm leading-relaxed text-text-muted"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
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
