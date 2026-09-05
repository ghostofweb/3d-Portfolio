import { site } from "@/content/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col items-start justify-center px-6 py-24"
    >
      <p className="font-mono text-sm text-accent-cyan">
        Hi, I&apos;m {site.name.split(" ")[0]}
      </p>
      <h1 className="text-glow mt-4 max-w-2xl font-mono text-4xl font-medium tracking-tight text-text sm:text-5xl">
        {site.role}.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
        {site.tagline} {site.bio}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href="#work"
          className="rounded-full bg-accent-cyan px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          View my work
        </a>
        <a
          href="#contact"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
