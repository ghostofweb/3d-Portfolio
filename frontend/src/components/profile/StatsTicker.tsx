"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const stats = [
  { target: 74, suffix: "%", label: "cut in backend CPU usage" },
  { target: 9, suffix: "", label: "microservices migrated to AWS" },
  { target: 100, suffix: "k+", label: "concurrent users served" },
];

export default function StatsTicker() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    stats.forEach((stat, i) => {
      const el = refs.current[i];
      if (!el) return;

      if (mq.matches) {
        el.textContent = `${stat.target}${stat.suffix}`;
        return;
      }

      const counter = { val: 0 };
      gsap.to(counter, {
        val: stat.target,
        duration: 1.3,
        delay: 0.15 * i,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${Math.round(counter.val)}${stat.suffix}`;
        },
      });
    });
  }, []);

  return (
    <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <div key={stat.label}>
          <span
            ref={(node) => {
              refs.current[i] = node;
            }}
            className="font-serif text-2xl font-medium text-text sm:text-3xl"
          >
            0{stat.suffix}
          </span>
          <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
