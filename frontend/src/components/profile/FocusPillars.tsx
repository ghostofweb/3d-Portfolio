import { site } from "@/content/site";

export default function FocusPillars() {
  return (
    <div className="flex flex-wrap gap-3">
      {site.pillars.map((pillar) => (
        <div
          key={pillar.title}
          className="rounded-xl border border-border bg-accent-soft px-3 py-2"
        >
          <p className="text-sm font-semibold text-text">{pillar.title}</p>
          <p className="text-xs text-text-muted">{pillar.proof}</p>
        </div>
      ))}
    </div>
  );
}
