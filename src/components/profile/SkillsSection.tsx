import { skillGroups } from "@/content/skills";
import Pill from "@/components/ui/Pill";

export default function SkillsSection() {
  return (
    <section id="skills" className="mt-16 scroll-mt-10">
      <h2 className="font-serif text-2xl font-semibold text-text">Skills</h2>
      <div className="mt-6 flex flex-col gap-5">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <p className="text-sm font-medium text-text">{group.category}</p>
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
