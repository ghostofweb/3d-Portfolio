import { site } from "@/content/site";
import StatsTicker from "./StatsTicker";

export default function Header() {
  return (
    <header id="intro" className="flex scroll-mt-10 flex-col items-start gap-5 pt-6 md:pt-10">
      <div>
        <p className="text-sm text-text-muted">Hello, I&apos;m</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tighter text-text sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-2 text-base font-medium text-accent">{site.role}</p>
      </div>

      <p className="max-w-xl text-base leading-relaxed text-text">
        {site.tagline} {site.bio}
      </p>

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
