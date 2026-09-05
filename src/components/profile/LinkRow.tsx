import { site } from "@/content/site";

const links = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Resume", href: site.resumeUrl },
];

export default function LinkRow() {
  return (
    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          className="text-text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
