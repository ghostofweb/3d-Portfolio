import { site } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow="About" title="A bit about me" />
      <div className="grid gap-8 sm:grid-cols-3">
        <p className="sm:col-span-2 text-base leading-relaxed text-text-muted">
          {site.bio}
        </p>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-elevated p-6 text-sm">
          <div>
            <p className="text-text-muted">Based in</p>
            <p className="text-text">India 🇮🇳 · Remote</p>
          </div>
          <div>
            <p className="text-text-muted">Currently</p>
            <p className="text-text">Full Stack Developer @ Newral.in</p>
          </div>
          <div>
            <p className="text-text-muted">Reach me at</p>
            <a
              href={`mailto:${site.email}`}
              className="text-accent-cyan hover:underline"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
