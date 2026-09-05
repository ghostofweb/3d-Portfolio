import { site } from "@/content/site";
import DogIcon from "@/components/mascot/DogIcon";

export default function Header() {
  return (
    <header className="pt-16 sm:pt-24">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-serif text-2xl italic text-text-muted">im</span>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-elevated">
          <DogIcon className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-text underline decoration-accent decoration-2 underline-offset-4 sm:text-3xl">
          {site.name}
        </h1>
      </div>

      <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted">
        {site.tagline} {site.bio}
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
        {site.openTo}
      </p>
    </header>
  );
}
