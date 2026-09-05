import { experiences } from "@/content/experience";

export default function ExperienceSection() {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-xl italic text-text-muted">Experience</h2>
      <div className="mt-4 flex flex-col divide-y divide-border">
        {experiences.map((exp) => (
          <div key={exp.id} className="py-5 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-text">
                {exp.role} ·{" "}
                {exp.companyHref ? (
                  <a
                    href={exp.companyHref}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-border underline-offset-2 hover:text-accent hover:decoration-accent"
                  >
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </p>
              <span className="text-xs text-text-muted">{exp.duration}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {exp.summary}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {exp.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-sm leading-relaxed text-text-muted"
                >
                  <span className="text-accent">–</span>
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
