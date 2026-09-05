import { site } from "@/content/site";
import Mascot from "@/components/mascot/Mascot";
import SectionNav from "./SectionNav";
import LinkRow from "./LinkRow";

export default function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-8 md:sticky md:top-10 md:h-fit md:w-56">
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <Mascot />
        <p className="mt-3 font-serif text-base font-semibold text-text">
          {site.name}
        </p>
        <p className="text-sm text-accent">{site.role}</p>
      </div>

      <SectionNav />
      <LinkRow />
    </aside>
  );
}
