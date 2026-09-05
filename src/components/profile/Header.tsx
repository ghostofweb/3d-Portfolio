import { site } from "@/content/site";
import DogIcon from "@/components/mascot/DogIcon";

export default function Header() {
  return (
    <header className="flex flex-col items-start gap-5 pt-20 sm:pt-28">
      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-elevated">
        <DogIcon className="h-9 w-9" />
      </span>

      <div>
        <p className="text-sm text-text-muted">Hello, I&apos;m</p>
        <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-text sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-2 text-base font-medium text-accent">{site.role}</p>
      </div>

      <p className="max-w-xl text-base leading-relaxed text-text-muted">
        {site.tagline} {site.bio}
      </p>
      <p className="max-w-xl text-sm leading-relaxed text-text-muted">
        {site.openTo}
      </p>
    </header>
  );
}
