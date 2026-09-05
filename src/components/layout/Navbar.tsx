"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks, site } from "@/content/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-text"
        >
          sahiljeet<span className="text-accent-cyan">.</span>dev
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm text-text-muted transition-colors hover:text-accent-cyan"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-4 py-1.5 text-sm text-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
            >
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="text-text md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-mono text-sm">{open ? "close" : "menu"}</span>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-text-muted transition-colors hover:text-accent-cyan"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-text-muted transition-colors hover:text-accent-cyan"
            >
              Resume
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
