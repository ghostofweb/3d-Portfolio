import { site } from "@/content/site";
import StatsTicker from "./StatsTicker";
import FocusPillars from "./FocusPillars";

export default function Header() {
  return (
    <header id="intro" className="flex scroll-mt-10 flex-col items-start gap-5 pt-6 md:pt-10">
      <div>
        <p className="text-sm text-text-muted">Hello, I&apos;m</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tighter text-text sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-2 text-base font-medium text-accent">
          {site.role} <span className="text-text-muted">· {site.experienceYears}</span>
        </p>
      </div>

      <FocusPillars />

      <div className="max-w-xl">
        <p className="text-lg font-semibold leading-snug text-text">{site.tagline}</p>
        <p className="mt-2 text-base leading-relaxed text-text-muted">{site.bio}</p>
      </div>

      <StatsTicker />

      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span>
          <span className="text-text">My Work:</span> {site.currentRoles}
        </span>
      </div>

      <p className="max-w-xl text-sm leading-relaxed text-text-muted">
        {site.openTo}
      </p>
    </header>
  );
}
