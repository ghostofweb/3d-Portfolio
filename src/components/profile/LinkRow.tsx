import { site } from "@/content/site";

const links = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Resume", href: site.resumeUrl },
];

export default function LinkRow() {
  return (
    <div className="mt-6 flex flex-wrap gap-2.5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:bg-accent-soft"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
