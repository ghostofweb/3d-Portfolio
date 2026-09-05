import { site } from "@/content/site";

export default function HighlightStrip() {
  return (
    <div className="mt-8 rounded-lg border border-accent-soft bg-accent-soft px-4 py-3 text-sm leading-relaxed text-text">
      <span className="font-medium">Currently:</span> {site.currentRoles}
    </div>
  );
}
