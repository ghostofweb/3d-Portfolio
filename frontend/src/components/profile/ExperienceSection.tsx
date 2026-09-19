"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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

        <div className="flex flex-col gap-14">
          {experiences.map((exp) => (
            <article key={exp.id} className="relative">
              <span className="absolute -left-6 top-5 h-[7px] w-[7px] rounded-full bg-accent" />

              <header className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <Image
                    src={exp.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-text">
                      {exp.company}
                    </h3>
                    <p className="text-xs text-text-muted">{exp.location}</p>
                  </div>
                  <p className="text-xs text-text-muted">{exp.duration}</p>
                </div>
              </header>

              <div className="mt-5 flex flex-col gap-7 sm:pl-[60px]">
                {exp.roles.map((role, roleIndex) => (
                  <div
                    key={role.title}
                    className={
                      roleIndex > 0 ? "border-t border-border pt-7" : undefined
                    }
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h4 className="text-sm font-semibold text-text">
                        {role.title}
                      </h4>
                      {role.duration && (
                        <p className="text-xs text-text-muted">
                          {role.duration}
                        </p>
                      )}
                    </div>

                    {role.summary && (
                      <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                        {role.summary}
                      </p>
                    )}

                    <div className="mt-4 flex flex-col gap-6">
                      {role.groups.map((group) => (
                        <div key={group.label ?? "points"}>
                          {group.label &&
                            (group.href ? (
                              <a
                                href={group.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-serif text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:underline"
                              >
                                {group.label}
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                >
                                  <path d="M7 17 17 7" />
                                  <path d="M8 7h9v9" />
                                </svg>
                              </a>
                            ) : (
                              <p className="font-serif text-xs font-medium uppercase tracking-wider text-accent">
                                {group.label}
                              </p>
                            ))}

                          {group.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                              {group.description}
                            </p>
                          )}

                          <ul className="mt-2.5 flex flex-col gap-2">
                            {group.points.map((point) => (
                              <li
                                key={point}
                                className="flex gap-2.5 text-sm leading-relaxed text-text"
                              >
                                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
