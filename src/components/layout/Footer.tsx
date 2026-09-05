import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Built from scratch, no
          bloat.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent-cyan"
          >
            GitHub
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent-cyan"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${site.email}`}
            className="transition-colors hover:text-accent-cyan"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
