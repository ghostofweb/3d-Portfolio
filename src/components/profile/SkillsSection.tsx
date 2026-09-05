import { skillGroups } from "@/content/skills";
import Pill from "@/components/ui/Pill";

export default function SkillsSection() {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-xl italic text-text-muted">Skills</h2>
      <div className="mt-4 flex flex-col gap-4">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {group.category}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Pill key={item} name={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
