import { skills } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import Pill from "@/components/ui/Pill";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow="Toolbox" title="Skills & technologies" />
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <Pill key={skill.name} name={skill.name} icon={skill.icon} />
        ))}
      </div>
    </section>
  );
}
