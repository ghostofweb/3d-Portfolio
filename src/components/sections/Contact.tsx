"use client";

import { useState } from "react";
import { site } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow="Contact" title="Let's work together" />
      <div className="rounded-2xl border border-border bg-bg-elevated p-8 text-center">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-text-muted">
          Have a project in mind, or just want to say hi? My inbox is open.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-accent-cyan px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Email me
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          >
            {copied ? "Copied!" : "Copy email"}
          </button>
        </div>
      </div>
    </section>
  );
}
