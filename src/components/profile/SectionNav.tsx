"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

const ACTIVATION_OFFSET = 140;

export default function SectionNav() {
  const [activeId, setActiveId] = useState("intro");
  const tickingRef = useRef(false);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const updateActive = () => {
      tickingRef.current = false;

      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <nav className="flex flex-col gap-2.5">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`text-sm transition-colors ${
            activeId === section.id
              ? "font-medium text-accent"
              : "text-text-muted hover:text-text"
          }`}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
