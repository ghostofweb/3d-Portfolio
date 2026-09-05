"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/content/experience";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || !sectionRef.current || !lineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="mt-16 scroll-mt-10">
      <h2 className="font-serif text-2xl font-semibold text-text">
        Experience
      </h2>
      <div className="relative mt-6 pl-6">
        <div className="absolute left-[3px] top-1 h-[calc(100%-8px)] w-px bg-border" />
        <div
          ref={lineRef}
          style={{ transformOrigin: "top" }}
          className="absolute left-[3px] top-1 h-[calc(100%-8px)] w-px origin-top bg-accent"
        />

        <div className="flex flex-col gap-9">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative">
              <span className="absolute -left-6 top-1.5 h-[7px] w-[7px] rounded-full bg-accent" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="text-sm font-semibold text-text">{exp.role}</p>
                <p className="text-xs text-text-muted">{exp.duration}</p>
              </div>
              <p className="text-sm text-text-muted">
                {exp.companyHref ? (
                  <a
                    href={exp.companyHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text">
                {exp.summary}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {exp.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-text-muted"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
