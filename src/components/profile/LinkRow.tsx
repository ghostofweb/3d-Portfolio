import { site } from "@/content/site";

const links = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Resume", href: site.resumeUrl },
];

export default function LinkRow() {
  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          className="text-sm text-text-muted transition-colors hover:text-accent"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
