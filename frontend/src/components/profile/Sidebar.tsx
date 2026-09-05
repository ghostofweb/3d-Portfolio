import { site } from "@/content/site";
import Mascot from "@/components/mascot/Mascot";
import SectionNav from "./SectionNav";
import LinkRow from "./LinkRow";

export default function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 pt-6 md:sticky md:top-10 md:h-fit md:w-56 md:gap-8 md:pt-10">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-accent-soft p-4 shadow-sm transition-shadow hover:shadow-md md:flex-col md:items-start">
        <Mascot />
        <div>
          <p className="font-serif text-base font-semibold text-text">
            {site.name}
          </p>
          <p className="text-sm text-accent">{site.role}</p>
        </div>
      </div>

      <SectionNav />
      <LinkRow />
    </aside>
  );
}
