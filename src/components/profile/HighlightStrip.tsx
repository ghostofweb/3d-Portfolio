import { site } from "@/content/site";

export default function HighlightStrip() {
  return (
    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-accent-soft px-5 py-4 text-sm leading-relaxed text-text">
      <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <p>
        <span className="font-medium">Currently:</span> {site.currentRoles}
      </p>
    </div>
  );
}
