import { site } from "@/content/site";
import {
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
  ResumeIcon,
  CalendarIcon,
} from "@/components/ui/Icons";

const links = [
  { label: "Email", href: `mailto:${site.email}`, Icon: MailIcon },
  { label: "GitHub", href: site.socials.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedInIcon },
  { label: "Resume", href: site.resumeUrl, Icon: ResumeIcon },
  { label: "Book a call", href: site.socials.cal, Icon: CalendarIcon },
];

export default function LinkRow() {
  return (
    <div className="flex flex-row flex-wrap gap-x-5 gap-y-3 md:flex-col md:flex-nowrap md:gap-2">
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </a>
      ))}
    </div>
  );
}
